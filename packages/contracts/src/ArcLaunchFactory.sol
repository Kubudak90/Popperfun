// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ArcBondingCurve} from "./ArcBondingCurve.sol";
import {ArcUsd} from "./ArcUsd.sol";

/// @title ArcLaunchFactory
/// @notice Creates Popper pops with immutable v1 economics.
/// @dev One quote asset (native USDC), one curve family (constant-product).
///      Threshold is passed in usd6 from the UI and stored as native18 on-chain.
contract ArcLaunchFactory {
    using ArcUsd for uint256;

    uint256 public constant TOKEN_SUPPLY = 1_000_000_000 ether;
    uint256 public constant VIRTUAL_NATIVE18 = 30_000 ether;
    uint256 public constant VIRTUAL_TOKENS = 800_000_000 ether;
    uint256 public constant GRADUATE_TOKEN_RESERVE = 200_000_000 ether;

    address public immutable venue;

    address[] public pops;
    mapping(address => address) public curveOfToken;

    event PopLaunched(
        address indexed curve,
        address indexed token,
        string name,
        string symbol,
        uint256 graduationThresholdUsd6,
        uint256 graduationThresholdNative18
    );

    constructor(address venue_) {
        require(venue_ != address(0), "factory: venue");
        venue = venue_;
    }

    /// @param graduationThresholdUsd6 Human USDC threshold (6 decimals). Converted to native18.
    function launch(string calldata name, string calldata symbol, uint256 graduationThresholdUsd6)
        external
        returns (address curve, address token)
    {
        require(bytes(name).length > 0 && bytes(symbol).length > 0, "factory: name");
        require(graduationThresholdUsd6 > 0, "factory: threshold");

        uint256 thresholdNative18 = graduationThresholdUsd6.usd6ToNative18();

        ArcBondingCurve deployed = new ArcBondingCurve(
            name,
            symbol,
            TOKEN_SUPPLY,
            VIRTUAL_NATIVE18,
            VIRTUAL_TOKENS,
            GRADUATE_TOKEN_RESERVE,
            thresholdNative18,
            venue
        );

        curve = address(deployed);
        token = address(deployed.token());
        pops.push(curve);
        curveOfToken[token] = curve;

        emit PopLaunched(curve, token, name, symbol, graduationThresholdUsd6, thresholdNative18);
    }

    function popCount() external view returns (uint256) {
        return pops.length;
    }
}
