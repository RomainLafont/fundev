import React, { PropsWithChildren } from 'react';
import Header from '@/components/Header';

const Template = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <footer>
        {/* Your footer content goes here */}
      </footer>
    </div>
  );
};

export default Template;