# GitHub App Local Development Environment Setup

This repository contains a GitHub App that can be deployed and tested locally. Follow the steps below to set up your development environment.

---

## Prerequisites

Ensure the following tools are installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [npx](https://docs.npmjs.com/cli/v8/commands/npx)
- [Smee.io](https://smee.io/)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file at the root of the project and add the following variables:

    APP_ID="YOUR_APP_ID"
    WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
    PRIVATE_KEY_PATH="YOUR_PRIVATE_KEY_PATH"

    Replace the placeholder values (YOUR_APP_ID, YOUR_WEBHOOK_SECRET, YOUR_PRIVATE_KEY_PATH) with the appropriate credentials:
        APP_ID: Obtain the App ID from your GitHub App's settings.
        WEBHOOK_SECRET: Set a secret value for validating incoming webhook events.
        PRIVATE_KEY_PATH: Path to your GitHub App's private key file (e.g., ./private-key.pem).

## Testing Locally

1. Install the GitHub App
    Go to your GitHub App's settings and install the app on a repository you want to test with.

2. Set up webhook proxy
    Open a terminal and run the following command to start the webhook proxy:
    ```bash
    npx smee -u $WEBHOOK_PROXY_URL -t http://localhost:3000/api/webhook
    ```
    Replace $WEBHOOK_PROXY_URL with the unique URL from Smee.io.

3. Start the server
    In a second terminal, run:
    ```bash
    npm run server
    ```

4. Trigger events
    Create a Pull Request (PR) on the repository where the app is installed. The app should respond to the PR events as defined in its logic.

## Notes

    Ensure your .env file is correctly configured before starting the server.
    Use Smee.io to forward GitHub webhooks to your local development environment.

## Troubleshooting

    If the app doesn't respond to events, verify:
        The APP_ID, WEBHOOK_SECRET, and PRIVATE_KEY_PATH are correctly configured.
        The Smee.io proxy is running and connected.
        The app is installed on the correct repository.
    Check the terminal logs for errors.