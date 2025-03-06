import React, { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title: string;
  activeTab: 'current' | 'history' | 'voting';
}

export default function Layout({ children, title, activeTab }: LayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    document.body.classList.remove('bg-neutral-900', 'text-neutral-100');
    document.body.classList.add('bg-stone-50', 'text-stone-800', 'transition-colors', 'duration-300');
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">
      <Head>
        <title>{`Book Clurb - ${title}`}</title>
      </Head>
      
      {/* Fixed Header */}
      <header className="w-full py-6 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-stone-800 mb-2">
                Book Clurb
              </h1>
              <div className="h-0.5 w-24 bg-amber-700/50 mx-auto"></div>
            </div>

            {/* Tabs - Centered with equal widths */}
            <div className="flex justify-center">
              <div className="bg-white rounded-full p-1 flex shadow-sm border border-stone-200">
                <div className="grid grid-cols-3 w-full">
                  <Link
                    href="/"
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 text-center whitespace-nowrap w-32 flex items-center justify-center ${
                      activeTab === 'current' 
                        ? 'bg-amber-100 text-amber-900' 
                        : 'text-stone-600 hover:bg-amber-50'
                    }`}
                  >
                    Current Reading
                  </Link>
                  <Link
                    href="/history"
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 text-center whitespace-nowrap w-32 flex items-center justify-center ${
                      activeTab === 'history' 
                        ? 'bg-amber-100 text-amber-900' 
                        : 'text-stone-600 hover:bg-amber-50'
                    }`}
                  >
                    Book History
                  </Link>
                  <Link
                    href="/voting"
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 text-center whitespace-nowrap w-32 flex items-center justify-center ${
                      activeTab === 'voting' 
                        ? 'bg-amber-100 text-amber-900' 
                        : 'text-stone-600 hover:bg-amber-50'
                    }`}
                  >
                    Voting
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Main Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Footer Content */}
          <div className="text-center max-w-xl mx-auto pt-8">
            <p className="text-stone-500 text-sm tracking-wide leading-relaxed">
              An exploration of literary landscapes, curated with precision and passion.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}