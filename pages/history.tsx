import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getBookHistory } from '../lib/bookService';
import { Book } from '../types/Book'; // Add this import

// Define the props interface
interface HistoryPageProps {
  books: Book[];
}

export default function HistoryPage({ books }: HistoryPageProps) { // Add type annotation
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Reading History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <div key={book.id} className="border p-4 rounded">
              <h3 className="font-bold">{book.title}</h3>
              <p>{book.author}</p>
              <p>Started: {book.startDate}</p>
              {book.endDate && <p>Completed: {book.endDate}</p>}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const books = await getBookHistory();
  return { props: { books } };
}