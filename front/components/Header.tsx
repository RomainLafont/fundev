'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const Header = () => {

  const { login } = usePrivy();

  return (
    <header className="flex items-center justify-between py-6 px-8">
      <h1 className="text-2xl font-bold">Fundev</h1>
      <nav>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:text-gray-300">Funders</a></li>
          <li><a href="#" className="hover:text-gray-300">Maintainers</a></li>
          <li><a href="#" className="hover:text-gray-300">Developers</a></li>
          <li><a href="#" className="hover:text-gray-300">Validators</a></li>
          <li><a href="#" className="hover:text-gray-300">Docs</a></li>
        </ul>
      </nav>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={login}>
        Login
      </button>
    </header>
  );
};

export default Header;