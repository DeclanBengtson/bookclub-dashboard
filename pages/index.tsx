import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BookCard from '../components/BookCard';
import { getCurrentBook } from '../lib/bookService';
import { Book } from '../types/Book'; // Add this import

// Define the props interface
interface HomeProps {
  currentBook: Book;
}

export default function Home({ currentBook }: HomeProps) { // Add type annotation
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Current Book</h2>
        <BookCard book={currentBook} />
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const currentBook = await getCurrentBook();
  return { props: { currentBook } };
}