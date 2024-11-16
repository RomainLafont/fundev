import {
  messageForNewIssue,
  generatePullRequestCommentCreation,
  messageForAddReviewer,
} from "./messages.js";
import { fetchReviewers, fetchProjectFunds } from "./utils.js";

// This adds an event handler that your code will call later. When this event handler is called, it will log the event to the console. Then, it will use GitHub's REST API to add a comment to the pull request that triggered the event.
export async function handlePullRequestOpened({ octokit, payload }) {
  console.log(
    `Received a pull request event for #${payload.pull_request.number}`
  );

  // Fetch dynamic data
  const reviewers = await fetchReviewers(octokit, payload);
  const totalReviewers = reviewers.length;
  const validatedReviewers = reviewers.filter((r) => r.validated);
  const reviewerNames = validatedReviewers
    .map((r) => `✅ ${r.name}`)
    .join("\n  ");
  const totalFunds = await fetchProjectFunds();
  const devName = payload.repository.owner.login;

  // Generate the Markdown comment dynamically
  const commentBody = generatePullRequestCommentCreation({
    totalReviewers,
    reviewerNames,
    totalFunds,
    devName,
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

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{payload.issue.number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: messageForNewIssue,
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
  const totalReviewers = reviewers.length;
  const validatedReviewers = reviewers.filter((r) => r.validated);
  const reviewerNames = validatedReviewers
    .map((r) => `✅ ${r.name}`)
    .join("\n  ");
  const commentBody = messageForAddReviewer({
    totalReviewers,
    reviewerNames,
    newReviewer: payload.requested_reviewer.login,
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
