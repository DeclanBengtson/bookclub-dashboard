import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Book } from '../types/Book';

// Dynamically import BookCard to ensure client-side rendering
const BookCard = dynamic(() => import('../components/BookCard'), { ssr: false });

interface HomeProps {
  currentBook: Book;
  bookHistory: Book[];
}

export default function Home({ currentBook, bookHistory }: HomeProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
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
                  Book Club
                </h1>
                <div className="h-0.5 w-24 bg-neutral-600 mx-auto mb-3"></div>
                </div>
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-800 rounded-full p-1 flex space-x-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                  activeTab === 'current' 
                    ? 'bg-neutral-700 text-neutral-100' 
                    : 'text-neutral-400 hover:bg-neutral-700/50'
                }`}
              >
                Current Reading
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                  activeTab === 'history' 
                    ? 'bg-neutral-700 text-neutral-100' 
                    : 'text-neutral-400 hover:bg-neutral-700/50'
                }`}
              >
                Book History
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'current' ? (
            <div className="space-y-6">
              

              <BookCard book={currentBook} showPageTracker={true} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {bookHistory.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}

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
  const { getCurrentBook, getBookHistory } = await import('../lib/bookService');
  const currentBook = await getCurrentBook();
  const bookHistory = await getBookHistory();
  return { props: { currentBook, bookHistory } };
}