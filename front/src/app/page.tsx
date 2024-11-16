'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export default function Home() {

  const router = useRouter();
  const { ready, login, authenticated } = usePrivy();

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  console.log('is ready: ', ready);

  return (
    <article className="text-center">
      <div className="flex justify-center">
        <img src={'images/logo.png'} alt={'Fundev'} className="w-1/2 max-w-xs" />
      </div>
      <h1 className="text-6xl mb-3">Fundev</h1>
      <p className="text-3xl mb-16">
        Offer bounties for your GitHub issues or <span className="text-secondary">earn money by solving them.</span>
      </p>

      <section className="mb-16">
        <h2 className="text-5xl text-center font-bold mb-8">How It Works</h2>
        <div className="flex justify-center space-x-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">Link your GitHub account</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Fund</h3>
            <p className="text-gray-600">Fund Issues you want to see Solved</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Solve</h3>
            <p className="text-gray-600">Earn by resolving issues</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-5xl text-center font-bold mb-8">Who Benefits from Fundev?</h2>

        <div id={'funders'} className="grid grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-gray-600">
            <h3 className="text-2xl font-semibold mb-4 text-center">Funders</h3>
            <ul className="text-xl list-disc list-inside">
              <li>Support favored projects</li>
              <li>Prioritize specific features</li>
              <li>Influence project direction</li>
            </ul>
          </div>
          <div id={'maintainers'} className="bg-gray-100 p-6 rounded-lg shadow-md text-gray-600">
            <h3 className="text-2xl font-semibold mb-4 text-center">Project Owners</h3>
            <ul className="text-xl list-disc list-inside">
              <li>Accelerate issue resolution</li>
              <li>Boost project development</li>
              <li>Engage community financially</li>
            </ul>
          </div>

          <div id={'developers'} className="bg-gray-100 p-6 rounded-lg shadow-md text-gray-600">
            <h3 className="text-2xl font-semibold mb-4 text-center">Developers</h3>
            <ul className="text-xl list-disc list-inside">
              <li>Earn solving issues</li>
              <li>Contribute to open-source</li>
              <li>Enhance GitHub portfolio</li>
            </ul>
          </div>

          <div id={'validators'} className="bg-gray-100 p-6 rounded-lg shadow-md text-gray-600">
            <h3 className="text-2xl font-semibold mb-4 text-center">Validators</h3>
            <ul className="text-xl list-disc list-inside">
              <li>Ensure solution quality</li>
              <li>Earn validation rewards</li>
              <li>Uphold project integrity</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-5xl text-center font-bold mb-8">Get Started?</h2>
        <Button
          onClick={login}
          disabled={disableLogin}
          className={'capitalize'}
        >
          Sign up now
        </Button>
        <p className="text-xl mb-4">And start to earn money</p>
      </section>
    </article>
  );
}
