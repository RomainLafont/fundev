'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

interface Issue {
  id: number;
  repo: string;
  name: string;
  status: string;
  totalAmount: string;
}

const issues: Issue[] = [
  {
    id: 1,
    repo: 'frontend',
    name: 'Button not aligned',
    status: 'Open',
    totalAmount: '$100.00',
  },
  {
    id: 2,
    repo: 'backend',
    name: 'API endpoint returning 500',
    status: 'In Progress',
    totalAmount: '$250.00',
  },
  {
    id: 3,
    repo: 'database',
    name: 'Optimize query performance',
    status: 'Closed',
    totalAmount: '$500.00',
  },
  {
    id: 4,
    repo: 'mobile-app',
    name: 'Crash on startup',
    status: 'Open',
    totalAmount: '$300.00',
  },
  {
    id: 5,
    repo: 'documentation',
    name: 'Update API docs',
    status: 'In Progress',
    totalAmount: '$150.00',
  },
];

const Page = () => {

  const router = useRouter();

  return (
    <div>
      <h1>Available issues</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Repo</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Reward</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id} onClick={() => router.push(`/issues/${issue.id}`)} className="cursor-pointer">
              <TableCell className="font-medium">{issue.repo}</TableCell>
              <TableCell>{issue.name}</TableCell>
              <TableCell>{issue.status}</TableCell>
              <TableCell className="text-right">{issue.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;