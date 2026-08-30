// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Wrapped OG (WOG)
/// @notice ERC-20 wrapper for native 0G (A0GI) gas tokens
contract WOG is ERC20 {
    constructor() ERC20("Wrapped 0G", "WOG") {}

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "WOG: insufficient balance");
        _burn(msg.sender, amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "WOG: transfer failed");
    }
}
