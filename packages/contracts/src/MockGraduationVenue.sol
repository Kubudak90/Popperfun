// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ArcLauncherToken} from "./ArcLauncherToken.sol";
import {IGraduationVenue} from "./IGraduationVenue.sol";

/// @title MockGraduationVenue
/// @notice Testnet-only sink for migrated liquidity. It is NOT a DEX pool.
/// @dev Only the token's immutable curve may register that token, preventing third-party pre-registration griefing.
contract MockGraduationVenue is IGraduationVenue {
    struct Position {
        address token;
        address curve;
        uint256 native18;
        uint256 tokens;
    }

    mapping(address => Position) public positions;
    address[] public graduated;

    event LiquidityReceived(address indexed token, address indexed curve, uint256 native18, uint256 tokens);

    function receiveLiquidity(address token, uint256 tokens) external payable {
        require(token != address(0), "venue: token");
        require(tokens > 0 && msg.value > 0, "venue: empty");
        ArcLauncherToken launched = ArcLauncherToken(token);
        require(launched.curve() == msg.sender, "venue: curve");
        require(positions[token].token == address(0), "venue: already");
        require(launched.balanceOf(address(this)) >= tokens, "venue: tokens");

        positions[token] = Position({token: token, curve: msg.sender, native18: msg.value, tokens: tokens});
        graduated.push(token);
        emit LiquidityReceived(token, msg.sender, msg.value, tokens);
    }

    function graduatedCount() external view returns (uint256) {
        return graduated.length;
    }

    receive() external payable {}
}
