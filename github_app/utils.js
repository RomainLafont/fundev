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
      if (!acc[reviewerName] || 
          new Date(review.submitted_at) > new Date(acc[reviewerName].submittedAt)) {
        acc[reviewerName] = {
          state: review.state.toUpperCase(),
          submittedAt: review.submitted_at
        };
      }
      return acc;
    }, {});

    // Add requested reviewers with PENDING state if they haven't reviewed yet
    requestedReviewers.data.users.forEach(user => {
      const reviewerName = user.login;
      if (!reviewersMap[reviewerName]) {
        reviewersMap[reviewerName] = {
          state: 'PENDING',
          submittedAt: null
        };
      }
    });

    return reviewersMap;

  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return {};
  }
}

export async function fetchProjectFunds(context) {
  const mocked_funds = 10.0;
  return mocked_funds;
}
