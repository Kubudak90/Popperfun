// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ArcLauncherToken} from "./ArcLauncherToken.sol";
import {IGraduationVenue} from "./IGraduationVenue.sol";

/// @title ArcBondingCurve
/// @notice Constant-product Popper curve quoted in native USDC (native18).
contract ArcBondingCurve {
    enum Phase { Trading, Prepared, Graduated }

    uint16 public constant MAX_TOTAL_FEE_BPS = 1_000;

    ArcLauncherToken public immutable token;
    IGraduationVenue public immutable venue;
    address public immutable creator;
    address public immutable protocolTreasury;
    uint16 public immutable protocolFeeBps;
    uint16 public immutable creatorFeeBps;

    uint256 public immutable virtualNative18;
    uint256 public immutable virtualTokens;
    uint256 public immutable graduationThresholdNative18;
    uint256 public immutable graduateTokenReserve;

    uint256 public realNative18;
    uint256 public tokensSold;
    Phase public phase;
    uint256 public protocolFeesAccrued;
    uint256 public creatorFeesAccrued;

    bool private entered;

    event Buy(address indexed buyer, uint256 native18In, uint256 tokensOut);
    event Sell(address indexed seller, uint256 tokensIn, uint256 native18Out);
    event FeesAccrued(uint256 protocolNative18, uint256 creatorNative18);
    event FeesWithdrawn(address indexed recipient, uint256 native18);
    event GraduationPrepared(uint256 native18, uint256 tokens);
    event Graduated(address indexed venue, uint256 native18, uint256 tokens);

    modifier nonReentrant() {
        require(!entered, "curve: reentrant");
        entered = true;
        _;
        entered = false;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory metadataURI_,
        uint256 supply_,
        uint256 virtualNative18_,
        uint256 virtualTokens_,
        uint256 graduateTokenReserve_,
        uint256 graduationThresholdNative18_,
        address venue_,
        address creator_,
        address protocolTreasury_,
        uint16 protocolFeeBps_,
        uint16 creatorFeeBps_
    ) {
        require(virtualNative18_ > 0 && virtualTokens_ > 0, "curve: virtual");
        require(supply_ > graduateTokenReserve_, "curve: reserve");
        require(graduationThresholdNative18_ > 0, "curve: threshold");
        require(venue_ != address(0) && creator_ != address(0), "curve: address");
        require(uint256(protocolFeeBps_) + uint256(creatorFeeBps_) <= MAX_TOTAL_FEE_BPS, "curve: fee");
        require(protocolFeeBps_ == 0 || protocolTreasury_ != address(0), "curve: treasury");

        token = new ArcLauncherToken(name_, symbol_, metadataURI_, supply_, address(this), creator_);
        venue = IGraduationVenue(venue_);
        creator = creator_;
        protocolTreasury = protocolTreasury_;
        protocolFeeBps = protocolFeeBps_;
        creatorFeeBps = creatorFeeBps_;
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

    function _fees(uint256 amount) internal view returns (uint256 protocolFee, uint256 creatorFee) {
        protocolFee = (amount * protocolFeeBps) / 10_000;
        creatorFee = (amount * creatorFeeBps) / 10_000;
    }

    function _quoteBuyNet(uint256 native18InNet) internal view returns (uint256 tokensOut) {
        uint256 x = virtualNative18 + realNative18;
        uint256 y = virtualTokens - tokensSold;
        tokensOut = y - (x * y) / (x + native18InNet);
        uint256 remaining = token.balanceOf(address(this)) - graduateTokenReserve;
        if (tokensOut > remaining) tokensOut = remaining;
    }

    function quoteBuy(uint256 native18In) public view returns (uint256 tokensOut) {
        require(phase == Phase.Trading, "curve: phase");
        (uint256 protocolFee, uint256 creatorFee) = _fees(native18In);
        uint256 net = native18In - protocolFee - creatorFee;
        require(net > 0, "curve: fee input");
        return _quoteBuyNet(net);
    }

    function _grossSell(uint256 tokensIn) internal view returns (uint256 grossNative18Out) {
        uint256 x = virtualNative18 + realNative18;
        uint256 y = virtualTokens - tokensSold;
        grossNative18Out = x - (x * y) / (y + tokensIn);
        if (grossNative18Out > realNative18) grossNative18Out = realNative18;
    }

    function quoteSell(uint256 tokensIn) public view returns (uint256 native18Out) {
        require(phase == Phase.Trading, "curve: phase");
        uint256 gross = _grossSell(tokensIn);
        (uint256 protocolFee, uint256 creatorFee) = _fees(gross);
        return gross - protocolFee - creatorFee;
    }

    function buy(uint256 minTokensOut) external payable nonReentrant returns (uint256 tokensOut) {
        require(phase == Phase.Trading, "curve: phase");
        require(msg.value > 0, "curve: value");
        (uint256 protocolFee, uint256 creatorFee) = _fees(msg.value);
        uint256 net = msg.value - protocolFee - creatorFee;
        require(net > 0, "curve: fee input");
        tokensOut = _quoteBuyNet(net);
        require(tokensOut >= minTokensOut && tokensOut > 0, "curve: slip");

        realNative18 += net;
        protocolFeesAccrued += protocolFee;
        creatorFeesAccrued += creatorFee;
        tokensSold += tokensOut;
        require(token.transfer(msg.sender, tokensOut), "curve: transfer");
        emit FeesAccrued(protocolFee, creatorFee);
        emit Buy(msg.sender, msg.value, tokensOut);
    }

    function sell(uint256 tokensIn, uint256 minNative18Out) external nonReentrant returns (uint256 native18Out) {
        require(phase == Phase.Trading, "curve: phase");
        require(tokensIn > 0, "curve: tokens");
        uint256 gross = _grossSell(tokensIn);
        (uint256 protocolFee, uint256 creatorFee) = _fees(gross);
        native18Out = gross - protocolFee - creatorFee;
        require(native18Out >= minNative18Out && native18Out > 0, "curve: slip");

        require(token.transferFrom(msg.sender, address(this), tokensIn), "curve: pull");
        realNative18 -= gross;
        protocolFeesAccrued += protocolFee;
        creatorFeesAccrued += creatorFee;
        tokensSold -= tokensIn;
        (bool ok,) = payable(msg.sender).call{value: native18Out}("");
        require(ok, "curve: payout");
        emit FeesAccrued(protocolFee, creatorFee);
        emit Sell(msg.sender, tokensIn, native18Out);
    }

    function withdrawCreatorFees() external nonReentrant {
        require(msg.sender == creator, "curve: creator");
        uint256 amount = creatorFeesAccrued;
        require(amount > 0, "curve: no fees");
        creatorFeesAccrued = 0;
        (bool ok,) = payable(creator).call{value: amount}("");
        require(ok, "curve: fee payout");
        emit FeesWithdrawn(creator, amount);
    }

    function withdrawProtocolFees() external nonReentrant {
        require(msg.sender == protocolTreasury, "curve: treasury");
        uint256 amount = protocolFeesAccrued;
        require(amount > 0, "curve: no fees");
        protocolFeesAccrued = 0;
        (bool ok,) = payable(protocolTreasury).call{value: amount}("");
        require(ok, "curve: fee payout");
        emit FeesWithdrawn(protocolTreasury, amount);
    }

    function canGraduate() public view returns (bool) {
        return phase == Phase.Trading && realNative18 >= graduationThresholdNative18;
    }

    /// @notice Atomically locks and migrates curve liquidity. A venue failure reverts the entire transition.
    function graduate() external nonReentrant {
        require(canGraduate(), "curve: threshold");
        phase = Phase.Prepared;
        uint256 nativeAmount = realNative18;
        uint256 tokenAmount = graduateTokenReserve;
        emit GraduationPrepared(nativeAmount, tokenAmount);

        phase = Phase.Graduated;
        realNative18 = 0;
        require(token.transfer(address(venue), tokenAmount), "curve: migrate tokens");
        venue.receiveLiquidity{value: nativeAmount}(address(token), tokenAmount);
        emit Graduated(address(venue), nativeAmount, tokenAmount);
    }
}
