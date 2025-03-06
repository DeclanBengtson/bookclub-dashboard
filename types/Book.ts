export interface Book {
    id: string;
    title: string;
    author: string;
    coverImageUrl: string;
    startDate: string;
    endDate?: string;
    finishDate?: string;
    status: 'CURRENT' | 'COMPLETED' | 'UPCOMING';
    synopsis?: string;
    notes?: string;
    totalPages?: number;
  }

  export interface BookSuggestion extends Book {
    votes: number;
  }