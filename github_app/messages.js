import dotenv from "dotenv";

dotenv.config();
const websiteURL = process.env.WEBSITE_URL;

const messageForCommonIssueStatus = ({totalFunds, encodedURL}) => `
### 📊 Issue state
💰 **Total Funds Contributed**: \`${totalFunds} USD\`

If you'd like to contribute to this issue, click the button below:

[![Contribute](https://img.shields.io/badge/Contribute-Click%20Here-purple?style=for-the-badge)](${websiteURL}/fund/new?url=${encodedURL})

Thank you for contributing to the project and supporting its growth! 🚀  
`

const pullRequestStatus = ({ totalReviewers, reviewers}) => `
### 📝 Pull Request Details:
- **Number of Reviewers**: \`${totalReviewers}\`
- **Review status**:  
${Object.entries(reviewers).map(([name, { state }]) => `  - ${getStateEmoji(state)} @${name}: \`${state}\``).join('\n')}
[![Become a reviewer](https://img.shields.io/badge/Become%20a%20Reviewer-blue?style=for-the-badge)](${websiteURL}/review)
[![Validate review](https://img.shields.io/badge/Validate%20Review-green?style=for-the-badge)](${websiteURL}/validate) [![Deny review](https://img.shields.io/badge/Deny%20Review-red?style=for-the-badge)](${websiteURL}/deny)
`

export const generatePullRequestCommentCreation = ({ totalReviewers, reviewers, totalFunds, devName, encodedURL}) => `
### 🚀 Pull Request Created!

Thank you @${devName} for opening this Pull Request! 😎
---
You should link this PR to an existing issue to gain money 💵
` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds, encodedURL});

export const messageForNewIssue = (encodedURL) => `
### 🎉 Issue Successfully Created!

` + messageForCommonIssueStatus({totalFunds: 0, encodedURL});

export const messageForAddReviewer = ({ totalReviewers, reviewers, newReviewer, totalFunds, encodedURL }) => `
### 🔍 @${newReviewer} has joined the reviewer team !

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds, encodedURL});

export const messageForPRApproval = ({ totalReviewers, reviewers, reviewer, totalFunds, encodedURL }) => `
### ✅ @${reviewer} has approved the pull request !

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds, encodedURL});

export const messageForPRDisapproval = ({ totalReviewers, reviewers, reviewer, totalFunds, encodedURL }) => `
### 🚫 @${reviewer} has disapproved the pull request !

` + pullRequestStatus({ totalReviewers, reviewers}) + messageForCommonIssueStatus({totalFunds, encodedURL});

export const messageForMerge = ({ reviewers, author, totalFunds }) => `
### 🎉 Pullrequest Successfully Merged!

Congrats @${author} for your success ! 
Your efforts made you earn **${totalFunds} USD** 💵
Thanks to all reviewers : 
${Object.entries(reviewers).map(([name, { state }]) => `@${name}`).join('\n')}

Keep building a web3 world ! 🔷
`;

export const messageSubmit = ({issueId, prId, repo}) => `
### 🔥 Pullrequest linked to an issue 

It's time to make big money by submitting your solution :
[![Submit solution](https://img.shields.io/badge/Submit%20Solution-brightgreen?style=for-the-badge)](${websiteURL}/pull_request/submit?issueId=${issueId}&prId=${prId}&repository=${repo})
`;

export const messageWarningLink = `
### ⚠️ No Issue linked to this PR ! 

You should link an Issue to this PR otherwise you won't be able to claim any money 😥
`;

const getStateEmoji = (state) => {
  switch(state.toUpperCase()) {
    case 'APPROVED': return '✅';
    case 'CHANGES_REQUESTED': return '❌';
    case 'PENDING': return '⏳';
    case 'COMMENTED': return '💭';
    default: return '❔';
  }
};

