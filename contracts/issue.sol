// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IssueVault {
    struct Issue {
        string repoName;
        uint256 issueId;
        uint256 vaultBalance;
    }

    mapping(string => mapping(uint256 => Issue)) issues; // repoName => issueId => Issue

    event IssueCreated(string repoName, uint256 issueId, uint256 initialAmount);


    function createIssue(
        address tokenAddress,
        string memory repoName, 
        uint256 issueId, 
        uint256 initialAmount
    ) external {
        // Ensure the issue does not already exist
        require(issues[repoName][issueId].vaultBalance == 0, "Issue already exists");

        // Create the ERC20 token contract instance
        IERC20 token = IERC20(tokenAddress);

        // Ensure that the user has approved the contract to transfer tokens
        require(token.transferFrom(msg.sender, address(this), initialAmount), "Token transfer failed");

        // Create the issue and initialize its vault balance
        issues[repoName][issueId] = Issue(repoName, issueId, initialAmount);

        emit IssueCreated(repoName, issueId, initialAmount);
    }

    function getIssueBalance(string memory repoName, uint256 issueId) external view returns (uint256) {
    // Check if the issue exists
    require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");
    
    // Return the balance of the issue's vault
    return issues[repoName][issueId].vaultBalance;
    }
}