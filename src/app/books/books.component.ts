import {Component, inject} from '@angular/core';
import {Book} from '../booksInterface';
import {BookstoreService} from '../bookstoreService';
import {Pageble} from '../pageble';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-books',
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  booksService = inject(BookstoreService)


  pageBooks: Pageble<Book[]> | null = null;
  error: string | null = null;
  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(url?: string): void {
    this.error = null;

    this.booksService.getBooks(url).subscribe({
      next: (response) => {
        this.pageBooks = response;
        console.log('Books loaded:', this.pageBooks);
      },
      error: (err) => {
        this.error = 'Fail';
        console.error('Error:', err);
      }
    });
  }

  loadNextPage(): void {
    if (this.pageBooks?.links.next) {
      this.loadBooks(this.pageBooks.links.next);
    }
  }

  loadPrevPage(): void {
    if (this.pageBooks?.links.previous) {
      this.loadBooks(this.pageBooks.links.previous);
    }
  }

}
