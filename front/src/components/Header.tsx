'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Header = () => {

  const router = useRouter();
  const { login } = usePrivy();

  return (
    <header className="flex items-center justify-between py-6 px-8">
      <h1 className="text-2xl font-bold" onClick={() => router.push('/')}>Fundev</h1>
      <nav>
        <ul className="flex space-x-6">
          <li><a href="#funders" className="hover:text-gray-300">Funders</a></li>
          <li><a href="#maintainers" className="hover:text-gray-300">Maintainers</a></li>
          <li><a href="#developers" className="hover:text-gray-300">Developers</a></li>
          <li><a href="#validators" className="hover:text-gray-300">Validators</a></li>
          <li><a href="#" className="hover:text-gray-300">Docs</a></li>
          <li><a href="#" className="hover:text-gray-300" onClick={() => router.push('/issues')}>Issues</a></li>
        </ul>
      </nav>
      <Button className={'capitalize'} onClick={login}>
        Login
      </Button>
    </header>
  );
};

export default Header;