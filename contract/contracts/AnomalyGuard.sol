// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILiquidityPool {
    function swap(uint256 tokenAmount) external;
}

contract AnomalyGuardWallet {
    address public owner;
    IERC20 public token;
    ILiquidityPool public liquidityPool;

    constructor(address _token, address _liquidityPool) {
        owner = msg.sender;
        token = IERC20(_token);
        liquidityPool = ILiquidityPool(_liquidityPool);
    }

    receive() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function forwardTokens(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
    }

    function forwardETH() external payable onlyOwner {}

    function executeAnomalyExit() external onlyOwner {
        uint256 tokenBalance = token.balanceOf(address(this));

        if (tokenBalance > 0) {
            // Approve LiquidityPool to take tokens
            token.approve(address(liquidityPool), tokenBalance);
            liquidityPool.swap(tokenBalance);
        }

        // Transfer all ETH to owner
        payable(owner).transfer(address(this).balance);
    }
}
