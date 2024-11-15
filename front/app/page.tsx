'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { ImSpinner2 } from 'react-icons/im';

export default function Home() {


  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  console.log('is ready: ', ready);

  return (
    <div className="container mx-auto px-4">
      <header className="py-6">
        <h1 className="text-4xl font-bold text-center">Fundev</h1>
      </header>
      <main className="text-center">
        <p className="text-xl">
          Offer bounties for your GitHub issues or earn money by solving them.
        </p>
        <button className="mt-6" disabled={disableLogin} onClick={login}>
          {disableLogin && <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />}
          {disableLogin ? 'Loading' : 'Start'}
        </button>
      </main>
    </div>
  );
}
