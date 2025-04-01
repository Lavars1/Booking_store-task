export interface Pageble<T> {
  links: {
    next: string | null;
    previous: string | null;
  };
  total_items: number;
  total_pages: number;
  page: number;
  page_size: number;
  result: T;
}
