// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title ArcLauncherToken
/// @notice Fixed-supply ERC-20 minted once to the bonding curve at launch.
/// @dev Disposable prototype. 18-decimal token; quote asset is native USDC (native18).
contract ArcLauncherToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    uint256 public immutable totalSupply;
    address public immutable curve;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    constructor(string memory name_, string memory symbol_, uint256 supply_, address curve_) {
        require(curve_ != address(0), "token: curve");
        name = name_;
        symbol = symbol_;
        totalSupply = supply_;
        curve = curve_;
        balanceOf[curve_] = supply_;
        emit Transfer(address(0), curve_, supply_);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= amount, "token: allowance");
            allowance[from][msg.sender] = allowed - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "token: to");
        uint256 bal = balanceOf[from];
        require(bal >= amount, "token: balance");
        unchecked {
            balanceOf[from] = bal - amount;
            balanceOf[to] += amount;
        }
        emit Transfer(from, to, amount);
    }
}
