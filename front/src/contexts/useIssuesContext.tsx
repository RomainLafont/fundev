import { create } from 'zustand';
import { uuidv4 } from '@walletconnect/utils';

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

export const useIssuesContext = () => {
  const { issues, fundIssue } = useIssuesStore();

  // Wagmi hook to fetch events will be added here

  return {
    issues,
    fundIssue,
  };
};