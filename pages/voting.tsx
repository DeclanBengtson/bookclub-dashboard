// pages/voting.tsx
import { useState } from 'react';
import { Book, BookSuggestion } from '../types/Book';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';

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
      const results = data.docs.slice(0, 5).map((doc: any) => ({
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
      // Save to JSON (client-side write, not ideal for production)
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
    // Save to JSON
    await fetch('/api/save-voting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSuggestions),
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-neutral-100 font-sans antialiased">
      <Head>
        <title>Book Clurb - Voting</title>
      </Head>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-100 mb-2">
              Next Book Voting
            </h1>
            <div className="h-0.5 w-24 bg-neutral-600 mx-auto mb-3"></div>
            <Link href="/" className="text-neutral-400 hover:text-neutral-100 transition-colors">
              Back to Home
            </Link>
          </div>

          {/* Search Section */}
          <div className="space-y-4">
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
              <ul className="space-y-2">
                {searchResults.map((book) => (
                  <li
                    key={book.id}
                    className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg"
                  >
                    <span>{book.title} by {book.author}</span>
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
          <div className="space-y-4">
            <h2 className="text-xl font-light text-neutral-200">Suggestions</h2>
            {suggestions.length === 0 ? (
              <p className="text-neutral-400">No suggestions yet. Add one above!</p>
            ) : (
              <ul className="space-y-3">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="text-sm text-neutral-400">{suggestion.author}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-neutral-200">{suggestion.votes} votes</span>
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
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { getVotingSuggestions } = await import('../lib/bookService');
  const initialSuggestions = await getVotingSuggestions();
  return { props: { initialSuggestions }, revalidate: 10 }; // Revalidate every 10 seconds
};