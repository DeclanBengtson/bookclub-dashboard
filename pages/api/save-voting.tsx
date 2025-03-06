// pages/api/save-voting.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { saveVotingSuggestions } from '../../lib/bookService';
import { BookSuggestion } from '../../types/Book';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const suggestions: BookSuggestion[] = req.body;
    await saveVotingSuggestions(suggestions);
    res.status(200).json({ message: 'Suggestions saved' });
  } catch (error) {
    console.error('Failed to save suggestions:', error);
    res.status(500).json({ message: 'Failed to save suggestions' });
  }
}