// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IGraduationVenue {
    function receiveLiquidity(address token, uint256 tokens) external payable;
}
