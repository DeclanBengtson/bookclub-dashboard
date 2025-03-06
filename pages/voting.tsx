// pages/voting.tsx
import { useState } from 'react';
import { Book, BookSuggestion } from '../types/Book';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';

// Define Open Library API response type
interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number; // Optional cover ID
}

interface VotingProps {
  initialSuggestions: BookSuggestion[];
}

export default function Voting({ initialSuggestions }: VotingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>(initialSuggestions);
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  // Search Open Library API
  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results = data.docs.slice(0, 5).map((doc: OpenLibraryDoc) => ({
        id: doc.key.split('/')[2], // Extract Open Library ID
        title: doc.title,
        author: doc.author_name?.[0] || 'Unknown',
      }));
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  // Add a book suggestion
  const addSuggestion = async (book: Book) => {
    if (!suggestions.some((s) => s.id === book.id)) {
      const updatedSuggestions = [...suggestions, { ...book, votes: 0 }];
      setSuggestions(updatedSuggestions);
      setSearchQuery('');
      setSearchResults([]);
      await fetch('/api/save-voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSuggestions),
      });
    }
  };

  // Upvote a suggestion
  const upvoteSuggestion = async (id: string) => {
    const updatedSuggestions = suggestions
      .map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))
      .sort((a, b) => b.votes - a.votes);
    setSuggestions(updatedSuggestions);
    await fetch('/api/save-voting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSuggestions),
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 from-neutral-900 via-neutral-800 to-neutral-950 text-neutral-100 font-sans antialiased">
      <Head>
        <title>Book Clurb - Voting</title>
      </Head>
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
                className="px-4 py-2 rounded-full text-sm transition-colors duration-300 text-neutral-400 hover:bg-neutral-700/50"
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
                className="px-4 py-2 rounded-full text-sm transition-colors duration-300 bg-neutral-700 text-neutral-100"
              >
                Voting
              </Link>
            </div>
          </div>

          {/* Search Section */}
          <div className="space-y-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search for a book to suggest..."
              className="w-full p-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            />
            {searchResults.length > 0 && (
              <ul className="space-y-4">
                {searchResults.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg shadow-md hover:bg-neutral-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-neutral-400">{book.author}</p>
                    </div>
                    <button
                      onClick={() => addSuggestion(book)}
                      className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-sm transition-colors"
                    >
                      Suggest
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Suggestions List */}
          <div className="space-y-6">
            <h2 className="text-xl font-light text-neutral-200">Suggestions</h2>
            {suggestions.length === 0 ? (
              <p className="text-neutral-400 text-sm tracking-wide leading-relaxed">
                No suggestions yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-4">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg shadow-md hover:bg-neutral-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-lg">{suggestion.title}</p>
                      <p className="text-sm text-neutral-400">{suggestion.author}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-neutral-200 text-lg">{suggestion.votes} votes</span>
                      <button
                        onClick={() => upvoteSuggestion(suggestion.id)}
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-sm transition-colors"
                      >
                        Upvote
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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

export const getStaticProps: GetStaticProps = async () => {
  const { getVotingSuggestions } = await import('../lib/bookService');
  const initialSuggestions = await getVotingSuggestions();
  return { props: { initialSuggestions }, revalidate: 10 };
};