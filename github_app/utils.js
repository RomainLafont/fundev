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
    // Process reviewers to determine validation status
    const reviewers = requestedReviewers.data.users.map((user) => {
      const hasValidated = reviews.some(
        (review) =>
          review.user.login === user.login && review.state === "APPROVED"
      );

      return {
        name: user.login,
        validated: hasValidated,
      };
    });

    return reviewers;
  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return [];
  }
}

export async function fetchProjectFunds(context) {
  const mocked_funds = 10.0;
  return mocked_funds;
}
