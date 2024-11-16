import dotenv from "dotenv";

dotenv.config();

const messageForCommonIssueStatus = ({totalFunds}) => `
### 📊 Issue state
💰 **Total Funds Contributed**: \`${totalFunds} USD\`

If you'd like to contribute to this issue, click the button below:

[![Contribute](https://img.shields.io/badge/Contribute-Click%20Here-purple?style=for-the-badge)](${websiteURL}/fund)

Thank you for contributing to the project and supporting its growth! 🚀  
`

const pullRequestStatus = ({ totalReviewers, reviewers}) => `
### 📝 Pull Request Details:
- **Number of Reviewers**: \`${totalReviewers}\`
- **Review status**:  
${Object.entries(reviewers).map(([name, { state }]) => `  - ${getStateEmoji(state)} @${name}: \`${state}\``).join('\n')}
[![Become a reviewer](https://img.shields.io/badge/Become%20a%20Reviewer-blue?style=for-the-badge)](${websiteURL}/review)
[![Validate review](https://img.shields.io/badge/Validate%20Review-green?style=for-the-badge)](${websiteURL}/validate)
`

export const generatePullRequestCommentCreation = ({ totalReviewers, reviewers, totalFunds, devName }) => `
### 🚀 Pull Request Created!

Thank you @${devName} for opening this Pull Request! 😎
You can submit your solution by clicking the button below :
[![Submit solution](https://img.shields.io/badge/Submit%20Solution-brightgreen?style=for-the-badge)](${websiteURL}/submit)
---

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds});

export const messageForNewIssue = `
### 🎉 Issue Successfully Created!

` + messageForCommonIssueStatus({totalFunds: 0});

export const messageForAddReviewer = ({ totalReviewers, reviewers, newReviewer, totalFunds }) => `
### 🔍 @${newReviewer} has joined the reviewer team !

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds});

export const messageForPRApproval = ({ totalReviewers, reviewers, reviewer, totalFunds }) => `
### ✅ @${reviewer} has approved the pull request !

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds});

export const messageForPRDisapproval = ({ totalReviewers, reviewers, reviewer, totalFunds }) => `
### 🚫 @${reviewer} has disapproved the pull request !

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds});


const getStateEmoji = (state) => {
  switch(state.toUpperCase()) {
    case 'APPROVED': return '✅';
    case 'CHANGES_REQUESTED': return '❌';
    case 'PENDING': return '⏳';
    case 'COMMENTED': return '💭';
    default: return '❔';
  }
};

const websiteURL = process.env.WEBSITE_URL;