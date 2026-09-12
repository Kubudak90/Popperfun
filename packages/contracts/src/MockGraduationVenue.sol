// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title MockGraduationVenue
/// @notice Stand-in for a Uniswap V4 pool/hook. Holds migrated curve liquidity.
/// @dev v1 must not invent Uniswap V4 pool, hook, or manager addresses.
contract MockGraduationVenue {
    struct Position {
        address token;
        uint256 native18;
        uint256 tokens;
    }

    mapping(address => Position) public positions;
    address[] public graduated;

    event LiquidityReceived(address indexed token, address indexed curve, uint256 native18, uint256 tokens);

    function receiveLiquidity(address token, uint256 tokens) external payable {
        require(token != address(0), "venue: token");
        require(positions[token].token == address(0), "venue: already");

        positions[token] = Position({token: token, native18: msg.value, tokens: tokens});
        graduated.push(token);
        emit LiquidityReceived(token, msg.sender, msg.value, tokens);
    }

    function graduatedCount() external view returns (uint256) {
        return graduated.length;
    }

    receive() external payable {}
}
