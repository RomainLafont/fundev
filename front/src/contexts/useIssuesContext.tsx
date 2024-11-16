import { create } from 'zustand';
import { uuidv4 } from '@walletconnect/utils';
import { useWatchContractEvent } from 'wagmi';

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

const CONTRACT_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
const START_BLOCK = BigInt(1);
const abi = undefined;

export const useIssuesContext = () => {
  const { issues, fundIssue } = useIssuesStore();

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi,
    fromBlock: START_BLOCK,
    eventName: 'IssueFunded',
    onLogs(logs) {
      logs.forEach((log) => {
        // fundIssue({
        //   issueId: log.args.issueId,
        //   repo: log.args.repo,
        //   amount: log.args.amount,
        // });
      });
    },
  });

  return {
    issues,
    fundIssue,
  };
};