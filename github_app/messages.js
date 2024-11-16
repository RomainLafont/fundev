const messageForCommonIssueStatus = ({totalFunds}) => `
#### 📊 Issue state
💰 **Total Funds Contributed**: \`${totalFunds} USD\`

If you'd like to contribute to this issue, click the button below:

[![Contribute](https://img.shields.io/badge/Contribute-Click%20Here-brightgreen?style=for-the-badge)](https://contribution-link-here)

Thank you for contributing to the project and supporting its growth! 🚀  
`

const pullRequestStatus = ({ totalReviewers, reviewerNames}) => `
#### 📝 Pull Request Details:
- **Number of Reviewers**: \`${totalReviewers}\`
- **Validated by**:  
  ${reviewerNames || "_No reviewers have validated this PR yet._"}
[![Become a reviewer](https://img.shields.io/badge/Become-a-reviewer-Click%20Here-brightgreen?style=for-the-badge)](https://become-reviewer-link-here)
`

export const generatePullRequestCommentCreation = ({ totalReviewers, reviewerNames, totalFunds, devName }) => `
### 🚀 Pull Request Created!

Thank you ${devName} for opening this Pull Request! 😎
---

` + pullRequestStatus({totalReviewers, reviewerNames}) + messageForCommonIssueStatus({totalFunds});

export const messageForNewIssue = `
#### 🎉 Issue Successfully Created!

` + messageForCommonIssueStatus({totalFunds: 0});

