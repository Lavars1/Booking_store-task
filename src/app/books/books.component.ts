import { Component, inject, OnInit } from '@angular/core';
import { Book, Author, Genre } from '../interfaces';
import { BookstoreService } from '../bookstoreService';
import { Pageble } from '../pageble';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-books',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {
  booksService = inject(BookstoreService)

  pageBooks: Pageble<Book[]> | null = null
  authors: Record<number, Author> = {}
  genres: Record<number, Genre> = {}
  error: string | null = null

  ngOnInit(): void {
    this.loadBooks()
    this.loadAuthors()
    this.loadGenres()
  }

  loadBooks(url?: string): void {
    this.error = null
    this.booksService.getBooks(url).subscribe({
      next: (response) => {
        this.pageBooks = response
      },
      error: () => {
        this.error = 'Failed to load books'
      }
    })
  }

  loadAuthors(): void {
    this.booksService.getAuthors().subscribe((page) => {
      this.authors = page.result.reduce((acc, author) => {
        acc[author.id!] = author
        return acc
      }, {} as Record<number, Author>)
    })
  }

  loadGenres(): void {
    this.booksService.getGenres().subscribe((page) => {
      this.genres = page.result.reduce((acc, genre) => {
        acc[genre.id!] = genre
        return acc
      }, {} as Record<number, Genre>)
    })
  }

  getAuthor(book: Book): string {
    if (!book.author.length) return 'Unknown'

    const authorNames = book.author.map(authorId =>
      this.authors[authorId]
        ? `${this.authors[authorId].first_name} ${this.authors[authorId].second_name}`
        : null
    ).filter(Boolean)

    return authorNames.length ? authorNames.join(', ') : 'Unknown'
  }

  getGenres(book: Book): string {
    if (!book.genres.length) return 'Unknown'

    const genreTitles = book.genres.map(genreId =>
      this.genres[genreId]?.title || null
    ).filter(Boolean)

    return genreTitles.length ? genreTitles.join(', ') : 'Unknown'
  }

  loadNextPage(): void {
    if (this.pageBooks?.links.next) {
      this.loadBooks(this.pageBooks.links.next)
    }
  }

  loadPrevPage(): void {
    if (this.pageBooks?.links.previous) {
      this.loadBooks(this.pageBooks.links.previous)
    }
  }
}
