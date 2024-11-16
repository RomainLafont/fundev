'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { GitPullRequest, GitFork, AlertCircle } from 'lucide-react';
import { abi } from '@/abi/FunDev.json';
import { useWriteContract } from 'wagmi';

const CONTRACT_ADDRESS = '0xDF155f2355A4739E88Cfe13d6e1e531fB22aBAf4';

const PullRequestPage = () => {
  const searchParams = useSearchParams();
  
  const issueId = searchParams.get('issueId');
  const prId = searchParams.get('prId');
  const repository = searchParams.get('repository');

  const { writeContract } = useWriteContract();

  const handleSubmit = async () => {
    // Here you would implement your submission logic
    console.log('Submitting PR:', { issueId, prId, repository });
    if (writeContract) {
        try {
          writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'createPullRequest', 
            args: [repository, issueId, prId],
          });
          console.log('Transaction sent');
          // Handle successful transaction
        } catch (error) {
          console.error('Error creating pull request:', error);
          // Handle error
        }
      }
  };

  const handleCreateFunding = async () => {

    
  };

  // Check if all required parameters are present
  const hasAllParams = issueId && prId && repository;

  if (!hasAllParams) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <h2 className="text-xl font-semibold">Missing Parameters</h2>
            <p className="text-gray-600">
              Please provide all required parameters: issueId, prId, and repository.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <GitPullRequest className="h-6 w-6" />
            Pull Request Submission
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
              <GitFork className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Repository</p>
                <p className="text-lg font-semibold">{repository}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Issue ID</p>
                <p className="text-lg font-semibold">#{issueId}</p>
              </div>
              
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium text-gray-600">PR ID</p>
                <p className="text-lg font-semibold">#{prId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Submit Pull Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default PullRequestPage;