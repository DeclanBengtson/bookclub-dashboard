// pages/index.tsx
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Book } from '../types/Book';
import Link from 'next/link';

const BookCard = dynamic(() => import('../components/BookCard'), { ssr: false });

interface HomeProps {
  currentBook: Book;
}

export default function Home({ currentBook }: HomeProps) {
  const [activeTab, setActiveTab] = useState<'current'>('current'); // Simplified to single tab
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    document.body.classList.add('bg-neutral-900', 'text-neutral-100', 'transition-colors', 'duration-300');
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-neutral-100 font-sans antialiased">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-100 mb-2">
              Book Clurb
            </h1>
            <div className="h-0.5 w-24 bg-neutral-600 mx-auto mb-3"></div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-800 rounded-full p-1 flex space-x-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-full text-sm transition-colors duration-300 bg-neutral-700 text-neutral-100"
              >
                Current Reading
              </Link>
              <Link
                href="/history"
                className="px-4 py-2 rounded-full text-sm transition-colors duration-300 text-neutral-400 hover:bg-neutral-700/50"
              >
                Book History
              </Link>
              <Link
                href="/voting"
                className="px-4 py-2 rounded-full text-sm transition-colors duration-300 text-neutral-400 hover:bg-neutral-700/50"
              >
                Voting
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <BookCard book={currentBook} showPageTracker={true} />
          </div>

          {/* Additional Context */}
          <div className="text-center max-w-xl mx-auto">
            <p className="text-neutral-400 text-sm tracking-wide leading-relaxed">
              An exploration of literary landscapes, curated with precision and passion.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const { getCurrentBook } = await import('../lib/bookService');
  const currentBook = await getCurrentBook();
  return { props: { currentBook }, revalidate: 10 };
}