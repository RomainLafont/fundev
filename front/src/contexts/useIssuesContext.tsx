import { create } from 'zustand';
import { uuidv4 } from '@walletconnect/utils';
import { useWatchContractEvent } from 'wagmi';
import { abi } from '@/abi/FunDev.json';

export interface Issue {
  id: string;
  repo: string;
  githubId: string;
  funds: Fund[];
  // Add more properties as needed
}

export interface Fund {
  issueId: string;
  repo: string;
  amount: number;
  // Add more properties as needed
}

interface IssuesState {
  issues: Issue[];
  fundIssue: (fund: Fund) => void;
}

const useIssuesStore = create<IssuesState>((set) => ({
  issues: [],
  fundIssue: (fund: Fund) => set((state) => {

    let issue = state.issues.find((issue) => issue.id === fund.issueId);
    if (!issue) {
      issue = {
        id: uuidv4(),
        repo: fund.repo,
        githubId: fund.issueId,
        funds: [],
      };
      state.issues.push(issue);
    }

    const updatedIssues = state.issues.map((issue) => {
      if (issue.id === fund.issueId) {
        return { ...issue, funds: [...issue.funds, fund] };
      }
      return issue;
    });
    return { issues: updatedIssues };
  }),
}));

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDEV_CONTRACT_ADDRESS as `0x${string}`;

export const useIssuesContext = () => {
  const { issues, fundIssue } = useIssuesStore();

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi,
    eventName: 'IssueCreated',
    onLogs(logs) {
      console.log('new logs:', logs);
    },
  });

  return {
    issues,
    fundIssue,
  };
};