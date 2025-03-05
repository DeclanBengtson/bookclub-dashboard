import { Book } from '../types/Book';

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="border rounded-lg p-4 max-w-sm">
      <img src={book.coverImageUrl} alt={book.title} className="w-full h-64 object-cover" />
      <h2 className="text-xl font-bold mt-2">{book.title}</h2>
      <p className="text-gray-600">{book.author}</p>
      <p className="mt-2">{book.synopsis}</p>
      <p className="text-sm mt-2">Started: {book.startDate}</p>
      <p className="text-sm">Status: {book.status}</p>
    </div>
  );
}