import { Book } from '../types/Book';
import { useState } from 'react';

export default function BookCard({ book, showPageTracker = false }: { 
  book: Book, 
  showPageTracker?: boolean 
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = book.totalPages || 0;
  const startDate = new Date(book.startDate);
  const finishDate = book.finishDate ? new Date(book.finishDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

  const calculatePagesPerDay = () => {
    const remainingPages = totalPages - currentPage;
    const today = new Date();
    const daysRemaining = Math.max(1, Math.ceil((finishDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
    return Math.ceil(remainingPages / daysRemaining);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-neutral-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-700 overflow-hidden">
      <div className="flex">
        {/* Book Cover */}
        <div className="w-1/3 relative">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover grayscale-[20%] opacity-90 transition duration-300 hover:grayscale-0 hover:opacity-100"
          />
        </div>

        {/* Book Details */}
        <div className="w-2/3 p-6 space-y-4">
          <div className="text-left">
            <h2 className="text-3xl font-extralight tracking-tight text-neutral-100 mb-1">
              {book.title}
            </h2>
            <p className="text-sm text-neutral-400 uppercase tracking-widest">
              {book.author}
            </p>
          </div>

          {/* Synopsis */}
          {book.synopsis && (
            <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
              <p className="text-sm text-neutral-400 leading-relaxed">
                {book.synopsis}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700">
              <p className="text-neutral-500 uppercase tracking-wider mb-1 text-[10px]">Started</p>
              <p className="text-neutral-300">
                {new Date(book.startDate).toLocaleDateString()}
              </p>
            </div>

            {book.endDate && (
              <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700">
                <p className="text-neutral-500 uppercase tracking-wider mb-1 text-[10px]">Completed</p>
                <p className="text-neutral-300">
                  {new Date(book.endDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700">
              <p className="text-neutral-500 uppercase tracking-wider mb-1 text-[10px]">Status</p>
              <p className="text-neutral-300 capitalize">
                {book.status.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Page Tracker */}
          {showPageTracker && book.totalPages && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="text-neutral-400 text-sm">Current Page:</label>
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  max={totalPages}
                  min={0}
                  className="bg-neutral-700 text-neutral-100 p-1 rounded w-20 text-sm"
                />
                <span className="text-neutral-500 text-sm">/ {totalPages}</span>
              </div>
              {currentPage > 0 && currentPage < totalPages && (
                <div className="bg-neutral-800/50 p-2 rounded border border-neutral-700">
                  <p className="text-neutral-400 text-xs">
                    Pages per day to finish: 
                    <span className="text-neutral-100 font-bold ml-2">
                      {calculatePagesPerDay()}
                    </span>
                  </p>
                  <p className="text-neutral-400 text-xs mt-1">
                    Planned Finish Date:
                    <span className="text-neutral-100 font-bold ml-2">
                      {finishDate.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Decorative Element */}
          <div className="h-0.5 w-16 bg-neutral-600 mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
}