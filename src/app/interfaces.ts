export interface Book {
  id?: number;
  in_stock?: number;
  title?: string;
  description?: string;
  price?: number;
  genres: number[];
  author: number[];
  release_date?: string;
  writing_date?: string;
}

export interface Author {
  id?: number;
  first_name: string;
  second_name: string;
}

export interface Genre {
  id?: number;
  title: string;
  description: string;
  discount?: number;
}
