// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ArcLauncherToken} from "./ArcLauncherToken.sol";
import {MockGraduationVenue} from "./MockGraduationVenue.sol";

/// @title ArcBondingCurve
/// @notice Constant-product curve quoted in native USDC (native18).
/// @dev x * y = k with virtual reserves. Trading is one-sided vs native USDC.
///      Graduation is two-phase: prepare (lock) then finalize (send to mock venue).
contract ArcBondingCurve {
    enum Phase {
        Trading,
        Prepared,
        Graduated
    }

    ArcLauncherToken public immutable token;
    MockGraduationVenue public immutable venue;

    /// @dev Virtual native USDC reserve (native18). Immutable launch economics.
    uint256 public immutable virtualNative18;
    /// @dev Virtual token reserve (18 decimals). Immutable launch economics.
    uint256 public immutable virtualTokens;
    /// @dev Graduation line in native18. Immutable after create.
    uint256 public immutable graduationThresholdNative18;
    /// @dev Tokens reserved to migrate with raised USDC. Immutable.
    uint256 public immutable graduateTokenReserve;

    uint256 public realNative18;
    uint256 public tokensSold;
    Phase public phase;

    uint256 public pendingNative18;
    uint256 public pendingTokens;

    event Buy(address indexed buyer, uint256 native18In, uint256 tokensOut);
    event Sell(address indexed seller, uint256 tokensIn, uint256 native18Out);
    event GraduationPrepared(uint256 native18, uint256 tokens);
    event Graduated(address indexed venue, uint256 native18, uint256 tokens);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 supply_,
        uint256 virtualNative18_,
        uint256 virtualTokens_,
        uint256 graduateTokenReserve_,
        uint256 graduationThresholdNative18_,
        address venue_
    ) {
        require(virtualNative18_ > 0 && virtualTokens_ > 0, "curve: virtual");
        require(supply_ > graduateTokenReserve_, "curve: reserve");
        require(graduationThresholdNative18_ > 0, "curve: threshold");
        require(venue_ != address(0), "curve: venue");

        token = new ArcLauncherToken(name_, symbol_, supply_, address(this));
        venue = MockGraduationVenue(payable(venue_));
        virtualNative18 = virtualNative18_;
        virtualTokens = virtualTokens_;
        graduateTokenReserve = graduateTokenReserve_;
        graduationThresholdNative18 = graduationThresholdNative18_;
        phase = Phase.Trading;
    }

    function spotPriceNative18() public view returns (uint256) {
        uint256 x = virtualNative18 + realNative18;
        uint256 y = virtualTokens - tokensSold;
        require(y > 0, "curve: empty");
        return (x * 1e18) / y;
    }

    function quoteBuy(uint256 native18In) public view returns (uint256 tokensOut) {
        require(phase == Phase.Trading, "curve: phase");
        uint256 x = virtualNative18 + realNative18;
        uint256 y = virtualTokens - tokensSold;
        // dy = y - k / (x + dx)  with k = x * y
        tokensOut = y - (x * y) / (x + native18In);
        uint256 remaining = token.balanceOf(address(this)) - graduateTokenReserve;
        if (tokensOut > remaining) tokensOut = remaining;
    }

    function quoteSell(uint256 tokensIn) public view returns (uint256 native18Out) {
        require(phase == Phase.Trading, "curve: phase");
        uint256 x = virtualNative18 + realNative18;
        uint256 y = virtualTokens - tokensSold;
        // dx = x - k / (y + dy)
        native18Out = x - (x * y) / (y + tokensIn);
        if (native18Out > realNative18) native18Out = realNative18;
    }

    function buy(uint256 minTokensOut) external payable returns (uint256 tokensOut) {
        require(phase == Phase.Trading, "curve: phase");
        require(msg.value > 0, "curve: value");
        tokensOut = quoteBuy(msg.value);
        require(tokensOut >= minTokensOut && tokensOut > 0, "curve: slip");

        realNative18 += msg.value;
        tokensSold += tokensOut;
        require(token.transfer(msg.sender, tokensOut), "curve: transfer");
        emit Buy(msg.sender, msg.value, tokensOut);
    }

    function sell(uint256 tokensIn, uint256 minNative18Out) external returns (uint256 native18Out) {
        require(phase == Phase.Trading, "curve: phase");
        require(tokensIn > 0, "curve: tokens");
        native18Out = quoteSell(tokensIn);
        require(native18Out >= minNative18Out && native18Out > 0, "curve: slip");

        require(token.transferFrom(msg.sender, address(this), tokensIn), "curve: pull");
        realNative18 -= native18Out;
        tokensSold -= tokensIn;
        (bool ok,) = payable(msg.sender).call{value: native18Out}("");
        require(ok, "curve: payout");
        emit Sell(msg.sender, tokensIn, native18Out);
    }

    function canGraduate() public view returns (bool) {
        return phase == Phase.Trading && realNative18 >= graduationThresholdNative18;
    }

    /// @notice Phase 1 — lock the curve and snapshot liquidity to migrate.
    function prepareGraduation() public {
        require(canGraduate(), "curve: threshold");
        phase = Phase.Prepared;
        pendingNative18 = realNative18;
        pendingTokens = graduateTokenReserve;
        emit GraduationPrepared(pendingNative18, pendingTokens);
    }

    /// @notice Phase 2 — send native USDC + reserved tokens to the mock venue.
    function finalizeGraduation() public {
        require(phase == Phase.Prepared, "curve: not prepared");
        phase = Phase.Graduated;

        uint256 nativeAmount = pendingNative18;
        uint256 tokenAmount = pendingTokens;
        pendingNative18 = 0;
        pendingTokens = 0;

        require(token.transfer(address(venue), tokenAmount), "curve: migrate tokens");
        venue.receiveLiquidity{value: nativeAmount}(address(token), tokenAmount);
        emit Graduated(address(venue), nativeAmount, tokenAmount);
    }

    /// @notice Convenience: run both graduation phases in one transaction.
    function graduate() external {
        prepareGraduation();
        finalizeGraduation();
    }
}
