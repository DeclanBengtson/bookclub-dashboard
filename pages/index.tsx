import BookCard from '../components/BookCard';
import { getCurrentBook } from '../lib/bookService';
import { Book } from '../types/Book';
import { useEffect } from 'react';

interface HomeProps {
  currentBook: Book;
}

export default function Home({ currentBook }: HomeProps) {
  useEffect(() => {
    document.body.classList.add('bg-neutral-900', 'text-neutral-100', 'transition-colors', 'duration-300');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-neutral-100 font-sans antialiased">

      <main className="flex-grow container mx-auto px-6 py-16 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-12">
          {/* Minimalist Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extralight tracking-tight text-neutral-100 mb-2">
              Book Club
            </h1>
            <div className="h-0.5 w-32 bg-neutral-600 mx-auto mb-4"></div>
            <p className="text-neutral-400 text-lg tracking-wide uppercase">
              Current Reading
            </p>
          </div>

          {/* Book Presentation with Geometric Framing */}
          <div className="relative">
            {/* Geometric Border */}
            <div className="absolute inset-0 border-4 border-neutral-800 opacity-50 rotate-3 scale-95"></div>
            <div className="absolute inset-0 border-4 border-neutral-700 opacity-30 -rotate-3 scale-90"></div>
            
            {/* Book Card with Modern Layout */}
            <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-300">
              <BookCard book={currentBook} />
            </div>
          </div>

          {/* Additional Context with Minimalist Typography */}
          <div className="text-center max-w-2xl mx-auto">
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
  const currentBook = await getCurrentBook();
  return { props: { currentBook } };
}