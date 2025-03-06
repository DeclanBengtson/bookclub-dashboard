// pages/voting.tsx
import { useState } from 'react';
import { Book, BookSuggestion } from '../types/Book';
import { GetStaticProps } from 'next';
import Layout from '../components/layout';

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
    <Layout title="Voting" activeTab="voting">
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
          className="w-full p-3 rounded-lg bg-white border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
        />
        {searchResults.length > 0 && (
          <ul className="space-y-4">
            {searchResults.map((book) => (
              <li
                key={book.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-stone-200 hover:bg-amber-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-stone-800">{book.title}</p>
                  <p className="text-sm text-stone-500">{book.author}</p>
                </div>
                <button
                  onClick={() => addSuggestion(book)}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-sm transition-colors shadow-sm"
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
        <h2 className="text-xl font-light text-stone-800">Suggestions</h2>
        {suggestions.length === 0 ? (
          <p className="text-stone-500 text-sm tracking-wide leading-relaxed">
            No suggestions yet. Add one above!
          </p>
        ) : (
          <ul className="space-y-4">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-stone-200 hover:bg-amber-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-lg text-stone-800">{suggestion.title}</p>
                  <p className="text-sm text-stone-500">{suggestion.author}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-stone-700 text-lg">{suggestion.votes} votes</span>
                  <button
                    onClick={() => upvoteSuggestion(suggestion.id)}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-sm transition-colors shadow-sm"
                  >
                    Upvote
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { getVotingSuggestions } = await import('../lib/bookService');
  const initialSuggestions = await getVotingSuggestions();
  return { props: { initialSuggestions }, revalidate: 10 };
};