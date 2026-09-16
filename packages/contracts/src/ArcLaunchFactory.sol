// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ArcBondingCurve} from "./ArcBondingCurve.sol";
import {ArcUsd} from "./ArcUsd.sol";

/// @title ArcLaunchFactory
/// @notice Creates Popper curves with immutable launch economics and configurable fee recipients.
contract ArcLaunchFactory {
    using ArcUsd for uint256;

    uint256 public constant VERSION = 2;
    uint256 public constant TOKEN_SUPPLY = 1_000_000_000 ether;
    uint256 public constant VIRTUAL_NATIVE18 = 30_000 ether;
    uint256 public constant VIRTUAL_TOKENS = 800_000_000 ether;
    uint256 public constant GRADUATE_TOKEN_RESERVE = 200_000_000 ether;
    uint16 public constant MAX_TOTAL_FEE_BPS = 1_000;

    address public immutable venue;
    address public immutable protocolTreasury;
    uint16 public immutable protocolFeeBps;
    uint16 public immutable creatorFeeBps;

    address[] public pops;
    mapping(address => address) public curveOfToken;
    mapping(address => address) public creatorOfCurve;

    event PopLaunched(address indexed curve, address indexed token, string name, string symbol, uint256 graduationThresholdUsd6, uint256 graduationThresholdNative18);
    event PopCreator(address indexed curve, address indexed creator);
    event PopMetadata(address indexed curve, string metadataURI);

    constructor(address venue_, address protocolTreasury_, uint16 protocolFeeBps_, uint16 creatorFeeBps_) {
        require(venue_ != address(0), "factory: venue");
        require(uint256(protocolFeeBps_) + uint256(creatorFeeBps_) <= MAX_TOTAL_FEE_BPS, "factory: fee");
        require(protocolFeeBps_ == 0 || protocolTreasury_ != address(0), "factory: treasury");
        venue = venue_;
        protocolTreasury = protocolTreasury_;
        protocolFeeBps = protocolFeeBps_;
        creatorFeeBps = creatorFeeBps_;
    }

    function launch(string calldata name, string calldata symbol, uint256 graduationThresholdUsd6)
        external returns (address curve, address token)
    {
        return _launch(name, symbol, "", graduationThresholdUsd6);
    }

    function launchWithMetadata(string calldata name, string calldata symbol, string calldata metadataURI, uint256 graduationThresholdUsd6)
        external returns (address curve, address token)
    {
        return _launch(name, symbol, metadataURI, graduationThresholdUsd6);
    }

    function _launch(string memory name, string memory symbol, string memory metadataURI, uint256 graduationThresholdUsd6)
        internal returns (address curve, address token)
    {
        require(bytes(name).length > 0 && bytes(name).length <= 64, "factory: name");
        require(bytes(symbol).length >= 2 && bytes(symbol).length <= 10, "factory: symbol");
        require(bytes(metadataURI).length <= 2048, "factory: metadata");
        require(graduationThresholdUsd6 > 0, "factory: threshold");
        uint256 thresholdNative18 = graduationThresholdUsd6.usd6ToNative18();

        ArcBondingCurve deployed = new ArcBondingCurve(
            name,
            symbol,
            metadataURI,
            TOKEN_SUPPLY,
            VIRTUAL_NATIVE18,
            VIRTUAL_TOKENS,
            GRADUATE_TOKEN_RESERVE,
            thresholdNative18,
            venue,
            msg.sender,
            protocolTreasury,
            protocolFeeBps,
            creatorFeeBps
        );

        curve = address(deployed);
        token = address(deployed.token());
        pops.push(curve);
        curveOfToken[token] = curve;
        creatorOfCurve[curve] = msg.sender;
        emit PopLaunched(curve, token, name, symbol, graduationThresholdUsd6, thresholdNative18);
        emit PopCreator(curve, msg.sender);
        if (bytes(metadataURI).length > 0) emit PopMetadata(curve, metadataURI);
    }

    function popCount() external view returns (uint256) { return pops.length; }
}
