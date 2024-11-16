export async function fetchReviewers(octokit, payload) {
  try {
    // Fetch both requested reviewers and actual reviews
    const [requestedReviewers, reviews] = await Promise.all([
      octokit.rest.pulls.listRequestedReviewers({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: payload.pull_request.number,
      }),
      octokit.rest.pulls.listReviews({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: payload.pull_request.number,
      }),
    ]);

    // First, create a map of reviewer name to their latest review state
    const reviewersMap = reviews.data.reduce((acc, review) => {
      const reviewerName = review.user.login;

      // Update only if this is a newer review or if we haven't seen this reviewer
      if (
        !acc[reviewerName] ||
        new Date(review.submitted_at) > new Date(acc[reviewerName].submittedAt)
      ) {
        acc[reviewerName] = {
          state: review.state.toUpperCase(),
          submittedAt: review.submitted_at,
        };
      }
      return acc;
    }, {});

    // Add requested reviewers with PENDING state if they haven't reviewed yet
    requestedReviewers.data.users.forEach((user) => {
      const reviewerName = user.login;
      if (!reviewersMap[reviewerName]) {
        reviewersMap[reviewerName] = {
          state: "PENDING",
          submittedAt: null,
        };
      }
    });

    return reviewersMap;
  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return {};
  }
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function fetchIssuesFromPR({owner, repo, pr}) {
  const query = `{
    resource(url: "https://github.com/${owner}/${repo}/pull/${pr}") {
      ... on PullRequest {
        timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT], first: 100) {
          nodes {
            ... on ConnectedEvent {
              id
              subject {
                ... on Issue {
                  number
                }
              }
            }
            ... on DisconnectedEvent {
              id
              subject {
                ... on Issue {
                  number
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({query}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const issues = {};
    data.data.resource.timelineItems.nodes.map((node) => {
      if (issues.hasOwnProperty(node.subject.number)) {
        issues[node.subject.number]++;
      } else {
        issues[node.subject.number] = 1;
      }
    });
    const linkedIssues = [];
    for (const [issue, count] of Object.entries(issues)) {
      if (count % 2 != 0) {
        linkedIssues.push(issue);
      }
    }
    return linkedIssues;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function fetchProjectFunds(context) {
  const mocked_funds = 10.0;
  return mocked_funds;
}
