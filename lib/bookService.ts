// lib/bookService.ts
import fs from 'fs/promises';
import path from 'path';
import { Book, BookSuggestion } from '../types/Book';

const BOOKS_PATH = path.join(process.cwd(), 'data', 'books.json');
const CURRENT_BOOK_PATH = path.join(process.cwd(), 'data', 'currentBook.json');

export async function getCurrentBook(): Promise<Book> {
  const data = await fs.readFile(CURRENT_BOOK_PATH, 'utf8');
  return JSON.parse(data);
}

export async function getBookHistory(): Promise<Book[]> {
  const data = await fs.readFile(BOOKS_PATH, 'utf8');
  return JSON.parse(data);
}

export async function updateCurrentBook(bookData: Book): Promise<void> {
  await fs.writeFile(CURRENT_BOOK_PATH, JSON.stringify(bookData, null, 2));
}

export async function addBookToHistory(book: Book): Promise<void> {
  const books = await getBookHistory();
  books.push(book);
  await fs.writeFile(BOOKS_PATH, JSON.stringify(books, null, 2));
}

