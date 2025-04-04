import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Book, Author, Genre } from '../interfaces';
import { Pageble } from '../pageble';
import {BookstoreService} from '../bookstoreService';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  imports: [CurrencyPipe, DatePipe, RouterLink]
})
export class BooksComponent implements OnInit {
  pageBooks: Pageble<Book[]> | null = null;
  authors: Record<number, Author> = {};
  genres: Record<number, Genre> = {};
  error: string | null = null;
  currentPage: number = 1;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bookstoreService: BookstoreService

  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const page = params.get('page')
      this.currentPage = page ? +page : 1
      this.loadBooks()
      this.loadAuthorsAndGenres()
    })
  }

  loadBooks(url?: string): void {
    this.error = null
    const apiUrl = url || `${this.bookstoreService.apiBaseUrl}/books/?page=${this.currentPage}`
    this.bookstoreService.getBooks(apiUrl).subscribe({
      next: (response) => {
        this.pageBooks = response
      },
      error: () => {
        this.error = 'Failed to load books'
      }
    })
  }

  loadAuthorsAndGenres(): void {
    const authors$ = this.bookstoreService.getAuthors().pipe(
      switchMap(firstPage =>
        this.bookstoreService.getAllAuthors(firstPage.total_items)
      ),
      map(fullList =>
        fullList.reduce((acc, author) => {
          if (author.id !== undefined) acc[author.id] = author
          return acc
        }, {} as Record<number, Author>)
      ),
      catchError(err => {
        console.error('Error fetching all authors:', err)
        return of({})
      })
    )

    const genres$ = this.bookstoreService.getGenres().pipe(
      switchMap(firstPage =>
        this.bookstoreService.getAllGenres(firstPage.total_items)
      ),
      map(fullList =>
        fullList.reduce((acc, genre) => {
          if (genre.id !== undefined) acc[genre.id] = genre
          return acc
        }, {} as Record<number, Genre>)
      ),
      catchError(err => {
        console.error('Error fetching all genres:', err)
        return of({})
      })
    )

    forkJoin({ authors: authors$, genres: genres$ }).subscribe({
      next: ({ authors, genres }) => {
        this.authors = authors
        this.genres = genres
      },
      error: err => console.error('Error fetching data:', err)
    })
  }

  getAuthorNames(book: Book): string {
    return book.author
      .map(authorId => this.authors[authorId]?.first_name + ' ' + this.authors[authorId]?.second_name || 'Unknown')
      .join(', ')
  }

  getGenreTitles(book: Book): string {
    return book.genres
      .map(genreId => this.genres[genreId]?.title || 'Unknown')
      .join(', ')
  }

  loadNextPage(): void {
    if (this.pageBooks?.links.next) {
      const nextPage = this.currentPage + 1
      this.router.navigate([`/books/${nextPage}`])
    }
  }

  loadPrevPage(): void {
    if (this.pageBooks?.links.previous) {
      const prevPage = this.currentPage - 1
      this.router.navigate([`/books/${prevPage}`])
    }
  }

  deleteBook(bookID: number): void {
    this.bookstoreService.deleteBook(bookID).subscribe({
      next: () => {
        console.log(`Book ${bookID} deleted successfully.`)
        this.loadBooks()
      }
    })
  }
}
