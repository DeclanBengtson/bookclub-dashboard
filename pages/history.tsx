// pages/history.tsx
import dynamic from 'next/dynamic';
import { Book } from '../types/Book';
import { GetStaticProps } from 'next';
import Layout from '../components/layout';

const BookCard = dynamic(() => import('../components/BookCard'), { ssr: false });

interface HistoryProps {
  bookHistory: Book[];
}

export default function History({ bookHistory }: HistoryProps) {
  return (
    <Layout title="Book History" activeTab="history">
      <div className="space-y-4">
        {bookHistory.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { getBookHistory } = await import('../lib/bookService');
  const bookHistory = await getBookHistory();
  return { props: { bookHistory }, revalidate: 10 };
};