'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [error, setError] = useState('');
  const [showFundingAmount, setShowFundingAmount] = useState(false);

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setInputValue(urlParam);
    }
  }, [searchParams]);

  const isValidGitHubIssueUrl = (url: string) => {
    const githubIssueRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/\d+$/;
    return githubIssueRegex.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleFundingAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFundingAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidGitHubIssueUrl(inputValue)) {
      setShowFundingAmount(true);
    } else {
      setError('Invalid GitHub issue URL format');
    }
  };

  const handleCreateFunding = () => {
    // Process the valid GitHub issue URL and funding amount
    console.log('Funding issue:', inputValue);
    console.log('Funding amount:', fundingAmount);
    // Add your logic here to handle the funding creation
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

      {showFundingAmount && (
        <div className="mt-4">
          <h3 className="text-2xl font-bold mb-2">Enter Funding Amount</h3>
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

export default Page;