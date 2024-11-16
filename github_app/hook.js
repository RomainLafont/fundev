import {
  messageForNewIssue,
  generatePullRequestCommentCreation,
  messageForAddReviewer,
  messageForPRApproval,
  messageForPRDisapproval,
  messageForMerge,
} from "./messages.js";
import { fetchReviewers, fetchProjectFunds } from "./utils.js";

// This adds an event handler that your code will call later. When this event handler is called, it will log the event to the console. Then, it will use GitHub's REST API to add a comment to the pull request that triggered the event.
export async function handlePullRequestOpened({ octokit, payload }) {
  console.log(
    `Received a pull request event for #${payload.pull_request.number}`
  );

  // Fetch dynamic data
  const reviewers = await fetchReviewers(octokit, payload);
  const totalReviewers = Object.entries(reviewers).length;
  const totalFunds = await fetchProjectFunds();
  const devName = payload.repository.owner.login;
  const encodedURL = encodeURIComponent(payload.pull_request.issue_url);

  // Generate the Markdown comment dynamically
  const commentBody = generatePullRequestCommentCreation({
    totalReviewers,
    reviewers,
    totalFunds,
    devName,
    encodedURL,
  });

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: commentBody,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
}

// This adds an event handler that your code will call later. When this event handler is called, it will log the event to the console. Then, it will use GitHub's REST API to add a comment to the issue that triggered the event.
export async function handleIssuesCreated({ octokit, payload }) {
  console.log(`Received a issue creation event for ${payload.repository.name}`);
  console.log(payload.issue.url);
  const encodedURL = encodeURIComponent(payload.issue.url);
  console.log(encodedURL)
  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/" + payload.issue.number + "/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: messageForNewIssue(encodedURL),
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
}

export async function handleReviewerAdd({ octokit, payload }) {
  console.log(`Received a reviewer add event`);

  const totalFunds = await fetchProjectFunds();
  const reviewers = await fetchReviewers(octokit, payload);
  const totalReviewers = Object.entries(reviewers).length;
  const encodedURL = encodeURIComponent(payload.pull_request.issue_url);
  const commentBody = messageForAddReviewer({
    totalReviewers,
    reviewers,
    newReviewer: payload.requested_reviewer.login,
    totalFunds,
    encodedURL,
  });

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: commentBody,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
}

export async function handleReviewSubmission({ octokit, payload }) {
  console.log(`Received a pr approval event`);

  const totalFunds = await fetchProjectFunds();
  const reviewers = await fetchReviewers(octokit, payload);
  console.log('Reviewers:', reviewers);
  
  const totalReviewers = Object.entries(reviewers).length;
  const encodedURL = encodeURIComponent(payload.pull_request.issue_url);

  const { pull_request, review, repository } = payload;
  console.log('Review:', review);
  // Only process if we have all required information
  if (!review || !pull_request || !repository) {
    console.log("Missing required information in webhook payload");
    return;
  }

  // Get review state and reviewer information
  const reviewState = review.state.toUpperCase();
  const reviewerName = review.user.login;
  let commentBody;

  switch (reviewState) {
    case "APPROVED":
      commentBody = messageForPRApproval({
        totalReviewers,
        reviewers,
        reviewer: reviewerName,
        totalFunds,
        encodedURL,
      });
      break;
    case "CHANGES_REQUESTED":
      commentBody = messageForPRDisapproval({
        totalReviewers,
        reviewers,
        reviewer: reviewerName,
        totalFunds,
        encodedURL,
      });
      break;
    default:
      return; // Don't post comment for other states
  }

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: commentBody,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
}

export async function handleClose({ octokit, payload }) {
  console.log(`Received a close event`);
  if (payload.pull_request.merged) {
    handleMerge(octokit, payload)
  }
}

export async function handleMerge({ octokit, payload }) {
  console.log(`Received a merge event`);

  const totalFunds = await fetchProjectFunds();
  const reviewers = await fetchReviewers(octokit, payload);
  const author = payload.pull_request.assignee.login;
  const commentBody = messageForMerge({
    reviewers,
    author,
    totalFunds,
  });

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: commentBody,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
}
