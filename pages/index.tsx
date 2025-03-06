// pages/index.tsx
import dynamic from 'next/dynamic';
import { Book } from '../types/Book';
import Layout from '../components/layout';

const BookCard = dynamic(() => import('../components/BookCard'), { ssr: false });

interface HomeProps {
  currentBook: Book;
}

export default function Home({ currentBook }: HomeProps) {
  return (
    <Layout title="Current Reading" activeTab="current">
      <BookCard book={currentBook} showPageTracker={true} />
    </Layout>
  );
}

export async function getStaticProps() {
  const { getCurrentBook } = await import('../lib/bookService');
  const currentBook = await getCurrentBook();
  return { props: { currentBook }, revalidate: 10 };
}