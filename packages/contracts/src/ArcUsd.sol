// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title ArcUsd
/// @notice Unit conversion between human usd6 (6 decimals) and native18 (18 decimals).
/// @dev On Arc, the native gas token is USDC. Curve accounting is always native18.
///      UI / factory config is usd6. Never treat an unlabeled integer as either unit.
library ArcUsd {
    uint256 internal constant USD6_DECIMALS = 6;
    uint256 internal constant NATIVE18_DECIMALS = 18;

    /// @dev 1e12 — 1 usd6 atom = 1e12 native18 atoms.
    uint256 internal constant USD6_TO_NATIVE18 = 1e12;

    function usd6ToNative18(uint256 usd6) internal pure returns (uint256 native18) {
        native18 = usd6 * USD6_TO_NATIVE18;
    }

    function native18ToUsd6(uint256 native18) internal pure returns (uint256 usd6) {
        usd6 = native18 / USD6_TO_NATIVE18;
    }
}
