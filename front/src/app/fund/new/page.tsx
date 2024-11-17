'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { BaseError, useWriteContract } from 'wagmi';

import { abi } from '@/abi/FunDev.json';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import PaymentPopup from '@/components/PaymentPopup';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDEV_CONTRACT_ADDRESS as `0x${string}`;
const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;

interface IssueDetails {
  title: string;
  description: string;
}

const PageContent = () => {

  const router = useRouter();
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFundingAmount, setShowFundingAmount] = useState(false);
  const [issueDetails, setIssueDetails] = useState<IssueDetails | null>(null);
  const [repo, setRepo] = useState<string>('');
  const [issueId, setIssueId] = useState<number>(0);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectTo', currentPath);
      router.push(`/login`);
    }
  }, [ready, authenticated, router]);

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
    setErrorMessage('');
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
        setErrorMessage('Failed to fetch issue details');
      }
    } else {
      setErrorMessage('Invalid GitHub issue URL format');
    }
  };

  const { data: hash, error, writeContract, writeContractAsync } = useWriteContract();

  const handleCreateFunding = async () => {
    if (!wallets.length) {
      setErrorMessage('Please connect your wallet first.');
      return;
    } else {
      wallets[0].chainId = 'eip155:84532';
    }

    console.log('Payment processed');
    setShowPopup(false);

    if (writeContract) {
      await writeContractAsync({
        address: USDC_CONTRACT_ADDRESS,
        abi: [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address',
              },
              {
                'name': '_value',
                'type': 'uint256',
              },
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': '',
                'type': 'bool',
              },
            ],
            'type': 'function',
          },
        ],
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, BigInt(Number(fundingAmount) * 6)],
      });
      writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'createIssue',
        args: [repo, BigInt(issueId), BigInt(Number(fundingAmount) * 6)],
      });
      console.log('Transaction sent');
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
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
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
              onClick={() => setShowPopup(true)}
              className="w-1/3"
              disabled={!fundingAmount}
            >
              Create Funding
            </Button>
          </div>
          {hash && (
            <div>
              Transaction Hash:{' '}
              <a 
                href={`https://sepolia.basescan.org/tx/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                View on BaseScan
              </a>
            </div>
          )}
          {error && (
            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
          )}
        </div>
      )}
      {showPopup && (
        <PaymentPopup
          amount={Number(fundingAmount)}
          onClose={() => setShowPopup(false)}
          onPayment={handleCreateFunding}
        />
      )}
    </div>
  );
};

const Page = () => {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <PageContent />
    </Suspense>
  );
};

export default Page;