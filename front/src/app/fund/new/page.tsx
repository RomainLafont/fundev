'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useWriteContract } from 'wagmi';


import { abi } from '@/abi/FunDev.json';

const CONTRACT_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';

interface IssueDetails {
  title: string;
  description: string;
}

const PageContent = () => {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [error, setError] = useState('');
  const [showFundingAmount, setShowFundingAmount] = useState(false);
  const [issueDetails, setIssueDetails] = useState<IssueDetails | null>(null);
  const [repo, setRepo] = useState<string>('');
  const [issueId, setIssueId] = useState<number>(0);

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setInputValue(urlParam);
    }
  }, [searchParams]);

  const isValidGitHubIssueUrl = (url: string) => {
    const githubIssueRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/;
    return githubIssueRegex.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
    setIssueDetails(null);
    setShowFundingAmount(false);
  };

  const handleFundingAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFundingAmount(e.target.value);
  };

  const fetchIssueDetails = async (url: string) => {
    const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/);
    if (!match) return null;

    const [, owner, repo, issueNumber] = match;
    setRepo(`${owner}/${repo}`);
    setIssueId(Number(issueNumber));
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch issue details');
      const data = await response.json();
      return { title: data.title, description: data.body };
    } catch (error) {
      console.error('Error fetching issue details:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidGitHubIssueUrl(inputValue)) {
      const details = await fetchIssueDetails(inputValue);
      if (details) {
        setIssueDetails(details);
        setShowFundingAmount(true);
      } else {
        setError('Failed to fetch issue details');
      }
    } else {
      setError('Invalid GitHub issue URL format');
    }
  };

  const { writeContract } = useWriteContract();

  const handleCreateFunding = async () => {

    if (writeContract) {
      try {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: 'createIssue', // Replace with your actual function name
          args: [repo, issueId, fundingAmount],
        });
        console.log('Transaction sent');
        // Handle successful transaction
      } catch (error) {
        console.error('Error creating funding:', error);
        // Handle error
      }
    }
  };

  return (
    <div>
      <h2 className="text-5xl text-center font-bold mb-8">New funding</h2>

      <p className="mb-2">Copy github issue link and paste here to create a funding on it</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full">
        <div className="flex items-center gap-2 w-full">
          <input
            type="url"
            id="githubIssueUrl"
            name="githubIssueUrl"
            placeholder="GitHub Issue URL"
            required
            className="w-2/3 p-2 border rounded"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            className="w-1/3"
            disabled={showFundingAmount}
          >
            Next
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {issueDetails && (<>
          <h3 className="text-2xl font-bold mt-8">{issueDetails.title}</h3>
          <div className="mt-4 p-4 border rounded bg-gray-200">
            {issueDetails.description ?
              <p className="mt-2">{issueDetails.description}</p> :
              <p className="text-gray-500 italic mt-2">No description available</p>}
          </div>
        </>
      )}

      {showFundingAmount && (
        <div className="mt-4">
          <p className="mb-2">Enter Funding Amount</p>
          <div className="flex items-center gap-2 w-full">
            <input
              type="number"
              id="fundingAmount"
              name="fundingAmount"
              placeholder="Funding amount in dollars"
              required
              className="w-2/3 p-2 border rounded"
              value={fundingAmount}
              onChange={handleFundingAmountChange}
            />
            <Button
              onClick={handleCreateFunding}
              className="w-1/3"
              disabled={!fundingAmount}
            >
              Create Funding
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export function Page() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <PageContent />
    </Suspense>
  );
}