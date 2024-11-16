export const abi = [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "PROTOCOL_FEE_PERCENTAGE",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "SLASH_PERCENTAGE",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "USDC_TOKEN",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "VALIDATOR_FEE_PERCENTAGE",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "addFunds",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addValidator",
      "inputs": [
        {
          "name": "stakeAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addValidatorStake",
      "inputs": [
        {
          "name": "additionalStake",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "approvePullRequest",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "pullRequestId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createIssue",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "initialAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createPullRequest",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "pullRequestId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getIssueBalance",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getValidatorStake",
      "inputs": [
        {
          "name": "validator",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "protocolFeeVault",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        {
          "name": "newOwner",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "unapprovePullRequest",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "pullRequestId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "usdc",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract IERC20"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "validatorStakeAmount",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "withdrawProtocolFees",
      "inputs": [
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawValidatorStake",
      "inputs": [
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "IssueCreated",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "initialAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "IssueUpdated",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "issueBalance",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "IssueValidated",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProtocolFeesWithdrawn",
      "inputs": [
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PullRequestApproved",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "pullRequestId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "validator",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PullRequestCreated",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "pullRequestId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "proposer",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PullRequestUnapproved",
      "inputs": [
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "issueId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "pullRequestId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "validator",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ValidatorAdded",
      "inputs": [
        {
          "name": "validator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "stakedAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ValidatorSlashed",
      "inputs": [
        {
          "name": "validator",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "slashedAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ValidatorStakeUpdated",
      "inputs": [
        {
          "name": "validator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "stakedAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ValidatorWithdrawn",
      "inputs": [
        {
          "name": "validator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        }
      ]
    }
  ] as const