export interface Book {
    id: string;
    title: string;
    author: string;
    coverImageUrl: string;
    startDate: string;
    endDate?: string;
    status: 'CURRENT' | 'COMPLETED' | 'UPCOMING';
    synopsis?: string;
    notes?: string;
  }