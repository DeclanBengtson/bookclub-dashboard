import { Book } from '../types/Book';
import { useState } from 'react';
import Image from 'next/image';

export default function BookCard({ book, showPageTracker = false }: { 
  book: Book, 
  showPageTracker?: boolean 
}) {
  const [currentPage, setCurrentPage] = useState<string>('');
  const totalPages = book.totalPages ? parseInt(String(book.totalPages)) : 0;
  const startDate = new Date(book.startDate);
  const endDate = book.endDate ? new Date(book.endDate) : null;
  
  const calculatePagesPerDay = (): number => {
    if (!endDate) return 0;
    
    const currentPageNum = currentPage === '' ? 0 : parseInt(currentPage);
    const remainingPages = totalPages - currentPageNum;
    const today = new Date();
    const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
    return Math.ceil(remainingPages / daysRemaining);
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    
    // Allow empty string or valid numbers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? 0 : parseInt(value);
      
      // Only enforce max if there's a value
      if (value !== '' && numValue > totalPages) {
        setCurrentPage(totalPages.toString());
      } else {
        setCurrentPage(value);
      }
    }
  };

  const getCurrentPageNum = (): number => {
    return currentPage === '' ? 0 : parseInt(currentPage);
  };

  // Calculate progress percentage for the progress bar
  const calculateProgress = (): number => {
    if (totalPages === 0) return 0;
    const currentPageNum = getCurrentPageNum();
    return Math.round((currentPageNum / totalPages) * 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden">
      {/* Responsive layout - vertical on small screens, horizontal on medium+ */}
      <div className="flex flex-col md:flex-row">
        {/* Book Cover - Better mobile sizing */}
        <div className="w-full md:w-2/5 lg:w-1/3 p-4 flex justify-center md:justify-start">
          <div className="relative h-80 md:h-auto w-48 md:w-full">
            {book.coverImageUrl && (
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                fill // Uses parent container dimensions with object-fit
                sizes="(max-width: 768px) 100vw, 33vw" // Responsive sizes
                className="object-contain md:object-cover rounded-md shadow-md opacity-95 transition duration-300 hover:opacity-100"
                style={{ objectFit: 'contain' }} // Ensure consistent behavior
                priority 
              />
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-stone-800 mb-1">
              {book.title}
            </h2>
            <p className="text-sm text-stone-500 uppercase tracking-widest">
              {book.author}
            </p>
          </div>

          {/* Synopsis */}
          {book.synopsis && (
            <div className="bg-stone-50 p-3 md:p-4 rounded-lg border border-stone-200">
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                {book.synopsis}
              </p>
            </div>
          )}

          {/* Metadata Grid - Better on small screens */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-stone-50 p-2 rounded border border-stone-200">
              <p className="text-stone-500 uppercase tracking-wider mb-1 text-[10px]">Started</p>
              <p className="text-stone-700">
                {startDate.toLocaleDateString()}
              </p>
            </div>

            {endDate && (
              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <p className="text-stone-500 uppercase tracking-wider mb-1 text-[10px]">Due</p>
                <p className="text-stone-700">
                  {endDate.toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="bg-stone-50 p-2 rounded border border-stone-200">
              <p className="text-stone-500 uppercase tracking-wider mb-1 text-[10px]">Status</p>
              <p className="text-stone-700 capitalize">
                {book.status.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Page Tracker - Fixed input issues */}
          {showPageTracker && totalPages > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <label className="text-stone-600 text-sm">Current Page:</label>
                <div className="flex items-center bg-stone-100 rounded overflow-hidden border border-stone-200">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentPage}
                    onChange={handlePageChange}
                    placeholder="0"
                    className="bg-stone-100 text-stone-800 p-1 w-12 text-center text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                  <span className="text-stone-500 text-sm px-2">/ {totalPages}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-stone-500">
                  <span>Progress</span>
                  <span>{calculateProgress()}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Always show the pages per day and finish by information when there's an end date */}
              {endDate && (
                <div className="bg-stone-50 p-3 rounded border border-stone-200 text-center md:text-left">
                  <p className="text-stone-600 text-xs">
                    Pages per day to finish: 
                    <span className="text-amber-800 font-bold ml-2">
                      {calculatePagesPerDay()}
                    </span>
                  </p>
                  <p className="text-stone-600 text-xs mt-1">
                    Finish by:
                    <span className="text-amber-800 font-bold ml-2">
                      {endDate.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}