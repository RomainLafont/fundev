// These are the dependencies for this file.
//
// You installed the `dotenv` and `octokit` modules earlier. The `@octokit/webhooks` is a dependency of the `octokit` module, so you don't need to install it separately. The `fs` and `http` dependencies are built-in Node.js modules.
import dotenv from "dotenv";
import {App} from "octokit";
import {createNodeMiddleware} from "@octokit/webhooks";
import fs from "fs";
import http from "http";
import { handleIssuesCreated, handleClose, handlePullRequestOpened, handleReviewerAdd, handleReviewSubmission, handlePRChange} from "./hook.js";
import { watchContractEvent } from '@wagmi/core'
const abi = JSON.parse(fs.readFileSync(new URL('./abi.json', import.meta.url)))
import { config } from './config.js'

// This reads your `.env` file and adds the variables from that file to the `process.env` object in Node.js.
dotenv.config();

// This assigns the values of your environment variables to local variables.
const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
export const websiteURL = process.env.WEBSITE_URL;

// This reads the contents of your private key file.
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// This creates a new instance of the Octokit App class.
const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  },
});

// Watch contract event
const contractAddress = '0xDF155f2355A4739E88Cfe13d6e1e531fB22aBAf4'

// Issue created
const issueCreated = watchContractEvent(config, {
  address: contractAddress,
  abi,
  eventName: 'IssueCreated',
  onLogs(logs) {
    console.log('New logs!', logs)
  },
})
issueCreated()

// Issue updated
const issueUpdated = watchContractEvent(config, {
  address: contractAddress,
  abi,
  eventName: 'IssueUpdated',
  onLogs(logs) {
    console.log('New logs!', logs)
  },
})
issueUpdated()

// Issue validated
const issueValidated = watchContractEvent(config, {
  address: contractAddress,
  abi,
  eventName: 'IssueValidated',
  onLogs(logs) {
    console.log('New logs!', logs)
  },
})
issueValidated()

// Pull request approved
const pullRequestApproved = watchContractEvent(config, {
  address: contractAddress,
  abi,
  eventName: 'PullRequestApproved',
  onLogs(logs) {
    console.log('New logs!', logs)
  },
})
pullRequestApproved()

// This sets up a webhook event listener. When your app receives a webhook event from GitHub with a `X-GitHub-Event` header value of `pull_request` and an `action` payload value of `opened`, it calls the `handlePullRequestOpened` event handler that is defined above.
app.webhooks.on("pull_request.opened", handlePullRequestOpened);
app.webhooks.on("issues.opened", handleIssuesCreated);
app.webhooks.on("pull_request.review_requested", handleReviewerAdd);
app.webhooks.on("pull_request_review.submitted", handleReviewSubmission);
app.webhooks.on("pull_request.closed", handleClose);
app.webhooks.on("pull_request", handlePRChange);

// This logs any errors that occur.
app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

// This determines where your server will listen.
//
// For local development, your server will listen to port 3001 on `localhost`. When you deploy your app, you will change these values. For more information, see "[Deploy your app](#deploy-your-app)."
const port = process.env.PORT || 3000;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const path = "/api/webhook";
const localWebhookUrl = `http://${host}:${port}${path}`;

// This sets up a middleware function to handle incoming webhook events.
//
// Octokit's `createNodeMiddleware` function takes care of generating this middleware function for you. The resulting middleware function will:
//
//    - Check the signature of the incoming webhook event to make sure that it matches your webhook secret. This verifies that the incoming webhook event is a valid GitHub event.
//    - Parse the webhook event payload and identify the type of event.
//    - Trigger the corresponding webhook event handler.
const middleware = createNodeMiddleware(app.webhooks, {path});

// This creates a Node.js server that listens for incoming HTTP requests (including webhook payloads from GitHub) on the specified port. When the server receives a request, it executes the `middleware` function that you defined earlier. Once the server is running, it logs messages to the console to indicate that it is listening.
http.createServer(middleware).listen(port, () => {
  console.log(`Server is listening for events at: ${localWebhookUrl}`);
  console.log('Press Ctrl + C to quit.')
});
