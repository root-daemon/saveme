// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.13;

contract Wallet {
    mapping(address => address[]) public userTokens;

    mapping(address => mapping(address => uint256)) public tokenBalances;

    function addToken(address token, uint256 amount) external {
        userTokens[msg.sender].push(token);
        tokenBalances[msg.sender][token] += amount;
    }

    function removeToken(address token, uint256 amount) external {
        require(tokenBalances[msg.sender][token] >= amount, "Insufficient balance");
        tokenBalances[msg.sender][token] -= amount;
    }

    function getTokenBalance(address token) external view returns (uint256) {
        return tokenBalances[msg.sender][token];
    }

    function getUserTokens() external view returns (address[] memory) {
        return userTokens[msg.sender];
    }
}
