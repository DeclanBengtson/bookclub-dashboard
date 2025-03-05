import { Book } from '../types/Book';

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="max-w-sm mx-auto bg-amber-900/50 backdrop-blur-sm border border-amber-700 rounded-xl shadow-xl p-6 transform hover:scale-105 transition duration-300 ease-in-out">
      {/* Book Cover Image with Frame */}
      <div className="relative overflow-hidden rounded-lg border-4 border-amber-800">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="w-full h-80 object-cover transform hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Book Details */}
      <div className="mt-6 text-amber-100">
        <h2 className="text-3xl font-serif font-bold text-amber-300 tracking-wide mb-2">
          {book.title}
        </h2>
        <p className="text-lg italic text-amber-200 mb-4">{book.author}</p>

        {/* Synopsis with Elegant Overlay */}
        <div className="bg-amber-800/50 p-4 rounded-lg border border-amber-700">
          <p className="text-base text-amber-100 leading-relaxed">{book.synopsis}</p>
        </div>

        {/* Metadata */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-amber-300">
            <span className="font-semibold text-amber-200">Started:</span>{' '}
            {new Date(book.startDate).toLocaleDateString()}
          </p>
          {book.endDate && (
            <p className="text-sm text-amber-300">
              <span className="font-semibold text-amber-200">Completed:</span>{' '}
              {new Date(book.endDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-sm text-amber-300">
            <span className="font-semibold text-amber-200">Status:</span>{' '}
            <span className="capitalize">{book.status}</span>
          </p>
          {book.notes && (
            <p className="text-sm text-amber-300 italic mt-2">
              <span className="font-semibold text-amber-200">Notes:</span>{' '}
              {book.notes}
            </p>
          )}
        </div>

        {/* Decorative Element */}
        <div className="mt-6 flex justify-center">
          <div className="w-16 h-1 bg-amber-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}