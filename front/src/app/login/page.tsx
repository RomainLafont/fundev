'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';

const PageContent = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, ready } = usePrivy();
  const { login } = useLogin({
    onError: (error) => {
      console.log(error);
      router.push('/');
    },
    onComplete: () => {
      setWaiting(false);
      const redirectTo = localStorage.getItem('redirectTo') || '/';
      router.push(redirectTo);
    },
  });

  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting)
      return;

    if (ready && !authenticated) {
      setWaiting(true);
      login();
    }
  }, [ready, authenticated, login, router]);

  if (!ready || !authenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div>

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