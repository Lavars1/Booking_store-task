export interface Book {
  id: number;
  title: string;
  in_stock: number;
  description: string;
  price: number;
  genres: string[];
  author: string[];
  release_date: string;
  writing_date: string;
}
