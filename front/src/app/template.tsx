import React, { PropsWithChildren } from 'react';
import Header from '@/components/Header';

const Template = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Header />
      <main className={'min-h-screen'}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto pl-12">
          <div className="flex justify-between">
            <div className="w-1/3">
              <h2 className={'text-gray-300 font-bold text-xl mb-2'}>Documentation</h2>
              <nav className="flex flex-col space-y-2">
                <a href="#funders" className="text-gray-300 hover:text-white transition-colors duration-200">Funders</a>
                <a href="#maintainers"
                   className="text-gray-300 hover:text-white transition-colors duration-200">Maintainers</a>
                <a href="#developers"
                   className="text-gray-300 hover:text-white transition-colors duration-200">Developers</a>
                <a href="#validators"
                   className="text-gray-300 hover:text-white transition-colors duration-200">Validators</a>
              </nav>
            </div>
            <div className="w-1/3">
              <h2 className={'text-gray-300 font-bold text-xl mb-2'}>Company</h2>
              <nav className="flex flex-col space-y-2">
                <a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a>
                <a href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</a>
              </nav>
            </div>
            <div className="w-1/3">
              <h2 className={'text-gray-300 font-bold text-xl mb-2'}>Legal</h2>
              <nav className="flex flex-col space-y-2">
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of
                  Service</a>
                <a href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy
                  Policy</a>
              </nav>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-secondary">Copyright &copy; {new Date().getFullYear()} Fundev</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Template;