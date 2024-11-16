'use client';

import React, { useEffect, useState } from 'react';

const Page = ({ params }: { params: { id: string } }) => {

  const [issue, setIssue] = useState<any>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/owner/repo/issues/${params.id}`);
        const data = await response.json();
        setIssue(data);
      } catch (error) {
        console.error('Error fetching issue:', error);
      }
    };

    fetchIssue();
  }, [params.id]);


  return (
    <div>
      <h1>Issue {params.id}</h1>
      {issue ? (
        <div>
          <h2>{issue.title}</h2>
          <p>{issue.body}</p>
          <p>Reward: {issue.labels.find((label: any) => label.name.startsWith('reward:'))?.name.split(':')[1] || 'Not specified'}</p>
          <p>Status: {issue.state}</p>
          <a href={issue.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      ) : (
        <p>Loading issue details...</p>
      )}
    </div>
  );
};

export default Page;