import { Book } from '../types/Book';

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="max-w-sm w-full mx-auto bg-neutral-800/30 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-neutral-700 transform transition duration-300 hover:scale-[1.02]">
      {/* Book Cover Image with Geometric Framing */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute -inset-2 bg-neutral-700 opacity-30 rotate-3 rounded-lg"></div>
        <div className="absolute -inset-1 bg-neutral-700 opacity-20 -rotate-3 rounded-lg"></div>
        
        <div className="relative z-10 rounded-lg overflow-hidden">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-80 object-cover grayscale-[20%] opacity-90 transition duration-300 hover:grayscale-0 hover:opacity-100"
          />
        </div>
      </div>

      {/* Book Details with Minimalist Typography */}
      <div className="mt-6 text-neutral-300 space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-extralight tracking-tight text-neutral-100 mb-1">
            {book.title}
          </h2>
          <p className="text-sm text-neutral-400 uppercase tracking-widest">
            {book.author}
          </p>
        </div>

        {/* Synopsis with Minimal Overlay */}
        {book.synopsis && (
          <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
            <p className="text-sm text-neutral-400 leading-relaxed text-center">
              {book.synopsis}
            </p>
          </div>
        )}

        {/* Metadata with Clean Layout */}
        <div className="grid grid-cols-2 gap-2 text-xs text-center">
          <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700">
            <p className="text-neutral-500 uppercase tracking-wider mb-1">Started</p>
            <p className="text-neutral-300">
              {new Date(book.startDate).toLocaleDateString()}
            </p>
          </div>

          {book.endDate && (
            <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700">
              <p className="text-neutral-500 uppercase tracking-wider mb-1">Completed</p>
              <p className="text-neutral-300">
                {new Date(book.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700 col-span-2">
            <p className="text-neutral-500 uppercase tracking-wider mb-1">Status</p>
            <p className="text-neutral-300 capitalize">
              {book.status.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Subtle Decorative Element */}
        <div className="h-0.5 w-16 bg-neutral-600 mx-auto"></div>
      </div>
    </div>
  );
}