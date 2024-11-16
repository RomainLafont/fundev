// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IssueVault {
    uint256 public constant VALIDATOR_FEE_PERCENTAGE = 10;  // 10%
    uint256 public constant PROTOCOL_FEE_PERCENTAGE = 5;   // 5%
    uint256 public protocolFeeVault;

    struct Issue {
        string repoName;
        uint256 issueId;
        uint256 vaultBalance;
    }

    struct PullRequest {
        address proposer;
        uint256 pullRequestId;
        uint256 approvalCount;
        uint256 validatorCount;
        address[] validators;
        mapping(address => bool) approvals;
    }

    mapping(string => mapping(uint256 => Issue)) private issues;
    mapping(string => mapping(uint256 => PullRequest[])) private issuePullRequests;

    mapping(address => uint256) private validators;
    uint256 public validatorStakeAmount = 50;

    event IssueCreated(string repoName, uint256 issueId, uint256 initialAmount);
    event IssueUpdated(string repoName, uint256 issueId, uint256 issueBalance);
    event IssueValidated(string repoName, uint256 issueId);

    event PullRequestCreated(string repoName, uint256 issueId, uint256 pullRequestId, address proposer);
    event ValidatorAdded(address validator, uint256 stakedAmount);
    event PullRequestApproved(string repoName, uint256 issueId, uint256 pullRequestId, address validator);
    event PullRequestUnapproved(string repoName, uint256 issueId, uint256 pullRequestId, address validator);

    function createIssue(
        address tokenAddress,
        string memory repoName, 
        uint256 issueId, 
        uint256 initialAmount
    ) external {
        require(issues[repoName][issueId].vaultBalance == 0, "Issue already exists");

        IERC20 token = IERC20(tokenAddress);

        require(token.transferFrom(msg.sender, address(this), initialAmount), "Token transfer failed");

        issues[repoName][issueId] = Issue(repoName, issueId, initialAmount);

        emit IssueCreated(repoName, issueId, initialAmount);
    }

    function getIssueBalance(string memory repoName, uint256 issueId) external view returns (uint256) {
        require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");
        
        return issues[repoName][issueId].vaultBalance;
    }

    function addFunds(
        address tokenAddress,
        string memory repoName,
        uint256 issueId,
        uint256 amount
    ) external {
        require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");

        IERC20 token = IERC20(tokenAddress);

        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        issues[repoName][issueId].vaultBalance += amount;

        emit IssueUpdated(repoName, issueId, issues[repoName][issueId].vaultBalance);
    }

    function createPullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId
    ) external {
        require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");

        PullRequest storage newPullRequest = issuePullRequests[repoName][issueId].push();
        
        newPullRequest.proposer = msg.sender;
        newPullRequest.pullRequestId = pullRequestId;
        newPullRequest.approvalCount = 0;
        newPullRequest.validatorCount = getActiveValidatorCount();

        emit PullRequestCreated(repoName, issueId, pullRequestId, msg.sender);
    }

    function addValidator(address tokenAddress) external {
        IERC20 token = IERC20(tokenAddress);

        require(token.transferFrom(msg.sender, address(this), validatorStakeAmount), "Token transfer failed");

        validators[msg.sender] = validatorStakeAmount;

        emit ValidatorAdded(msg.sender, validators[msg.sender]);
    }

    function getValidatorStake(address validator) external view returns (uint256) {
        return validators[validator];
    }

    function approvePullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId,
        address tokenAddress
    ) external {
        require(validators[msg.sender] >= validatorStakeAmount, "Only validators can approve");
        
        PullRequest storage pr = issuePullRequests[repoName][issueId][pullRequestId];
        require(!pr.approvals[msg.sender], "Validator already approved");
        
        pr.approvals[msg.sender] = true;
        pr.approvalCount += 1;
        pr.validators.push(msg.sender);
        
        emit PullRequestApproved(repoName, issueId, pullRequestId, msg.sender);

        if (pr.approvalCount >= 3 && (pr.approvalCount * 100 / pr.validatorCount) >= 80) {
            _completePullRequest(repoName, issueId, pullRequestId, tokenAddress);
        }
    }

    // Unapprove a pull request
    function unapprovePullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId,
        address tokenAddress
    ) external {
        require(validators[msg.sender] >= validatorStakeAmount, "Only validators can unapprove");

        PullRequest storage pr = issuePullRequests[repoName][issueId][pullRequestId];
        require(pr.approvals[msg.sender], "Validator has not approved");

        pr.approvals[msg.sender] = false;
        pr.approvalCount -= 1;
        pr.validators.push(msg.sender);

        emit PullRequestUnapproved(repoName, issueId, pullRequestId, msg.sender);

        // Check if enough validators have unapproved
        uint256 unapprovalCount = pr.validatorCount - pr.approvalCount;
        if (unapprovalCount >= 3 && (unapprovalCount * 100 / pr.validatorCount) >= 80) {
            _rejectPullRequest(repoName, issueId, pullRequestId, tokenAddress);
        }
    }

    function _completePullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId,
        address tokenAddress
    ) private {
        Issue storage issue = issues[repoName][issueId];
        PullRequest storage pr = issuePullRequests[repoName][issueId][pullRequestId];
        IERC20 token = IERC20(tokenAddress);

        uint256 totalAmount = issue.vaultBalance;
        
        uint256 validatorFee = (totalAmount * VALIDATOR_FEE_PERCENTAGE) / 100;
        uint256 protocolFee = (totalAmount * PROTOCOL_FEE_PERCENTAGE) / 100;
        uint256 proposerAmount = totalAmount - validatorFee - protocolFee;

        issue.vaultBalance = 0;
        protocolFeeVault += protocolFee;

        require(token.transfer(pr.proposer, proposerAmount), "Proposer transfer failed");
        
        uint256 feePerValidator = validatorFee / pr.validatorCount;

        uint256 length = pr.validators.length;
        
        for (uint256 i = 0; i < length; i++) {
            if (pr.approvals[pr.validators[i]] == true) {
                require(token.transfer(pr.validators[i], feePerValidator), "Validator fee transfer failed");
            }
        }
    }

    function _rejectPullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId,
        address tokenAddress
    ) private {
        Issue storage issue = issues[repoName][issueId];
        PullRequest storage pr = issuePullRequests[repoName][issueId][pullRequestId];
        IERC20 token = IERC20(tokenAddress);

        uint256 totalAmount = issue.vaultBalance;
        
        uint256 validatorFee = (totalAmount * VALIDATOR_FEE_PERCENTAGE) / 100;
        uint256 remainingAmount = totalAmount - validatorFee;

        issue.vaultBalance = remainingAmount; // Return remaining amount to issue vault

        uint256 feePerValidator = validatorFee / pr.validatorCount;

        uint256 length = pr.validators.length;
        
        for (uint256 i = 0; i < length; i++) {
            if (pr.approvals[pr.validators[i]] == false) { // Reward validators who unapproved
                require(token.transfer(pr.validators[i], feePerValidator), "Validator fee transfer failed");
            }
        }
    }

}
