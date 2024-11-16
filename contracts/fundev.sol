// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FunDev is Ownable(msg.sender) {
    uint256 public constant VALIDATOR_FEE_PERCENTAGE = 1;  // 1%
    uint256 public constant PROTOCOL_FEE_PERCENTAGE = 4;   // 4%
    uint256 public protocolFeeVault;
    uint256 public validatorStakeAmount = 50;
    uint256 public constant SLASH_PERCENTAGE = 5; // 5% of stake gets slashed

    struct Issue {
        string repoName;
        uint256 issueId;
        uint256 vaultBalance;
        mapping(uint256 => uint256) pullRequestsIndex;
    }

    struct PullRequest {
        address proposer;
        bool active;
        uint256 approvalsCount;
        uint256 validationsCount;
        address[] validators;
        mapping(address => bool) approvals;
    }

    uint256 numberOfPr;
    mapping(uint256 => PullRequest) private pullRequests; // prIndex --> pull request
    mapping(string => mapping(uint256 => Issue)) private issues; // repoName --> issue ID --> issue

    mapping(address => uint256) private validators;
    mapping(address => bool) private isValidator;

    event IssueCreated(string repoName, uint256 issueId, uint256 initialAmount);
    event IssueUpdated(string repoName, uint256 issueId, uint256 issueBalance);
    event IssueValidated(string repoName, uint256 issueId);

    event PullRequestCreated(string repoName, uint256 issueId, uint256 pullRequestId, address proposer);
    event ValidatorAdded(address indexed validator, uint256 stakedAmount);
    event PullRequestApproved(string repoName, uint256 issueId, uint256 pullRequestId, address validator);
    event PullRequestUnapproved(string repoName, uint256 issueId, uint256 pullRequestId, address validator);
    event ValidatorSlashed(address validator, uint256 slashedAmount);
    event ValidatorWithdrawn(address indexed validator, uint256 amount);
    event ProtocolFeesWithdrawn(address indexed to, uint256 amount);

    address public constant USDC_TOKEN = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // Mainnet USDC address
    IERC20 public immutable usdc;

    constructor() {
        usdc = IERC20(USDC_TOKEN);
    }

    function createIssue(
        string memory repoName, 
        uint256 issueId, 
        uint256 initialAmount
    ) external {
        require(issues[repoName][issueId].vaultBalance == 0, "Issue already exists");

        require(usdc.transferFrom(msg.sender, address(this), initialAmount), "USDC transfer failed");

        Issue storage issue = issues[repoName][issueId];

        issue.repoName = repoName;
        issue.issueId = issueId;
        issue.vaultBalance = initialAmount;

        emit IssueCreated(repoName, issueId, initialAmount);
    }

    function getIssueBalance(string memory repoName, uint256 issueId) external view returns (uint256) {
        require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");
        
        return issues[repoName][issueId].vaultBalance;
    }

    function addFunds(
        string memory repoName,
        uint256 issueId,
        uint256 amount
    ) external {
        require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");

        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        issues[repoName][issueId].vaultBalance += amount;

        emit IssueUpdated(repoName, issueId, issues[repoName][issueId].vaultBalance);
    }

    function createPullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId
    ) external {
        require(issues[repoName][issueId].vaultBalance > 0, "Issue does not exist");

        uint256 prIndex = numberOfPr + 1;
        issues[repoName][issueId].pullRequestsIndex[pullRequestId] = numberOfPr + 1;

        // Create a new PullRequest
        PullRequest storage newPullRequest = pullRequests[prIndex];
        newPullRequest.proposer = msg.sender;
        newPullRequest.approvalsCount = 0;
        newPullRequest.validationsCount = 0;
        newPullRequest.active = true;

        emit PullRequestCreated(repoName, issueId, pullRequestId, msg.sender);
    }

    function addValidator(uint256 stakeAmount) external {
        require(!isValidator[msg.sender], "Already a validator");
        require(stakeAmount >= validatorStakeAmount, "Stake amount below minimum");
        
        require(usdc.transferFrom(msg.sender, address(this), stakeAmount), "USDC transfer failed");
        
        validators[msg.sender] = stakeAmount;
        isValidator[msg.sender] = true;
        
        emit ValidatorAdded(msg.sender, stakeAmount);
    }

    function getValidatorStake(address validator) external view returns (uint256) {
        return validators[validator];
    }

    function approvePullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId
    ) external {
        require(validators[msg.sender] >= validatorStakeAmount, "Only validators can approve");
        
        uint256 prIndex = issues[repoName][issueId].pullRequestsIndex[pullRequestId];

        uint256 approvalsCount = pullRequests[prIndex].approvalsCount;

        uint256 validationsCount = pullRequests[prIndex].validationsCount;
        bool approval = pullRequests[prIndex].approvals[msg.sender];

        require(approval != true, "Validator already approved");

        if (approval == false) {
            approvalsCount += 2;
        } else {
            validationsCount += 1;
            approvalsCount += 1;
            pullRequests[prIndex].validators.push(msg.sender);
        }

        pullRequests[prIndex].approvals[msg.sender] = true;
        pullRequests[prIndex].approvalsCount = approvalsCount;

        emit PullRequestApproved(repoName, issueId, pullRequestId, msg.sender);

        if (approvalsCount >= 3 && (approvalsCount * 100 / validationsCount) >= 80) {
           _completePullRequest(repoName, issueId, pullRequestId);
      }
    }

    // Unapprove a pull request
    function unapprovePullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId
    ) external {
        require(validators[msg.sender] >= validatorStakeAmount, "Only validators can unapprove");

        uint256 prIndex = issues[repoName][issueId].pullRequestsIndex[pullRequestId];
        uint256 approvalsCount = pullRequests[prIndex].approvalsCount;
        uint256 validationsCount = pullRequests[prIndex].validationsCount;
        bool approval = pullRequests[prIndex].approvals[msg.sender];

        require(approval != false, "Validator has already unapproved");

        if (approval == true) {
            approvalsCount -= 2;
        } else {
            validationsCount += 1;
            approvalsCount -= 1;
            pullRequests[prIndex].validators.push(msg.sender);
        }

        pullRequests[prIndex].approvals[msg.sender] = false;
        pullRequests[prIndex].approvalsCount = approvalsCount;

        emit PullRequestUnapproved(repoName, issueId, pullRequestId, msg.sender);

        // Check if enough validators have unapproved
        uint256 unapprovalCount = validationsCount - approvalsCount;
        if (unapprovalCount >= 3 && (unapprovalCount * 100 / validationsCount) >= 80) {
            _rejectPullRequest(repoName, issueId, pullRequestId);
        }
    }

    function _completePullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId
    ) private {
        Issue storage issue = issues[repoName][issueId];
        uint256 prIndex = issues[repoName][issueId].pullRequestsIndex[pullRequestId];
        
        // Slash validators who voted against
        uint256 numberOfValidators = pullRequests[prIndex].validators.length;
        for (uint256 i = 0; i < numberOfValidators; i++) {
            address validator = pullRequests[prIndex].validators[i];
            if (!pullRequests[prIndex].approvals[validator]) {
                uint256 slashAmount = (validators[validator] * SLASH_PERCENTAGE) / 100;
                validators[validator] -= slashAmount;
                protocolFeeVault += slashAmount;
                emit ValidatorSlashed(validator, slashAmount);
            }
        }

        // Original completion logic
        uint256 totalAmount = issue.vaultBalance;
        uint256 validatorFee = (totalAmount * VALIDATOR_FEE_PERCENTAGE) / 100;
        uint256 protocolFee = (totalAmount * PROTOCOL_FEE_PERCENTAGE) / 100;
        uint256 proposerAmount = totalAmount - validatorFee - protocolFee;

        issue.vaultBalance = 0;
        protocolFeeVault += protocolFee;

        uint256 approvalsCount = pullRequests[prIndex].approvalsCount;
        address proposer = pullRequests[prIndex].proposer;

        uint256 feePerValidator = validatorFee / approvalsCount;

        // Transfer money to each validator who approved
        for (uint256 i = 0; i < numberOfValidators; i++) {
            if (pullRequests[prIndex].approvals[pullRequests[prIndex].validators[i]] == true) {
                require(usdc.transfer(pullRequests[prIndex].validators[i], feePerValidator), "Validator fee transfer failed");
            }
        }

        require(usdc.transfer(proposer, proposerAmount), "Proposer transfer failed");

        pullRequests[prIndex].active = false;
    }

    function _rejectPullRequest(
        string memory repoName,
        uint256 issueId,
        uint256 pullRequestId
    ) private {
        Issue storage issue = issues[repoName][issueId];
        uint256 prIndex = issues[repoName][issueId].pullRequestsIndex[pullRequestId];
        
        // Slash validators who approved
        uint256 numberOfValidators = pullRequests[prIndex].validators.length;
        for (uint256 i = 0; i < numberOfValidators; i++) {
            address validator = pullRequests[prIndex].validators[i];
            if (pullRequests[prIndex].approvals[validator]) {
                uint256 slashAmount = (validators[validator] * SLASH_PERCENTAGE) / 100;
                validators[validator] -= slashAmount;
                protocolFeeVault += slashAmount;
                emit ValidatorSlashed(validator, slashAmount);
            }
        }

        // Original rejection logic
        uint256 totalAmount = issue.vaultBalance;
        uint256 validatorFee = (totalAmount * VALIDATOR_FEE_PERCENTAGE) / 100;
        uint256 approvalsCount = pullRequests[prIndex].approvalsCount;

        uint256 feePerValidator = validatorFee / (numberOfValidators - approvalsCount);

        // Transfer money to each validator who rejected
        for (uint256 i = 0; i < numberOfValidators; i++) {
            if (pullRequests[prIndex].approvals[pullRequests[prIndex].validators[i]] == false) {
                require(usdc.transfer(pullRequests[prIndex].validators[i], feePerValidator), "Validator fee transfer failed");
            }
        }

        pullRequests[prIndex].active = false;
    }

    function withdrawValidatorStake(uint256 amount) external {
        require(isValidator[msg.sender], "Not a validator");
        require(amount <= validators[msg.sender], "Insufficient stake balance");
        require(amount > 0, "Amount must be greater than 0");
        
        // Check if validator is active in any pull requests
        for (uint256 i = 0; i < numberOfPr; i++) {
            PullRequest storage pr = pullRequests[i];
            if (pullRequests[i].active) {  // If PR is still active
                for (uint256 j = 0; j < pr.validators.length; j++) {
                    require(pr.validators[j] != msg.sender, "Validator active in PR");
                }
            }
        }
        
        // If withdrawing full amount, remove validator status
        if (amount == validators[msg.sender]) {
            isValidator[msg.sender] = false;
        } else {
            // Ensure remaining amount is still above minimum
            require(
                validators[msg.sender] - amount >= validatorStakeAmount,
                "Remaining stake below minimum"
            );
        }
        
        validators[msg.sender] -= amount;
        require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
        
        emit ValidatorWithdrawn(msg.sender, amount);
    }

    function withdrawProtocolFees(address to, uint256 amount) external onlyOwner {
        require(amount <= protocolFeeVault, "Insufficient protocol fees");
        require(amount > 0, "Amount must be greater than 0");
        require(to != address(0), "Invalid address");
        
        protocolFeeVault -= amount;
        require(usdc.transfer(to, amount), "USDC transfer failed");
        
        emit ProtocolFeesWithdrawn(to, amount);
    }

}
