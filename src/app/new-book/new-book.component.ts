import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Author, Book, Genre } from '../interfaces';
import { BookstoreService } from '../bookstoreService';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-new-book',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.scss'
})
export class NewBookComponent implements OnInit {
  bookForm: FormGroup
  authors: Record<number, Author> = {}
  genres: Record<number, Genre> = {}
  selectedGenres: Genre[] = []
  selectedAuthors: Author[] = []

  constructor(
    private fb: FormBuilder,
    private bookstoreService: BookstoreService) {
    this.bookForm = this.fb.group({
      title: [''],
      description: [''],
      price: [null, [Validators.min(0)]],
      in_stock: [null, [Validators.min(0)]],
      genres: [[], Validators.required],
      author: [[], Validators.required],
      release_date: [''],
      writing_date: [''],
    })
  }

  ngOnInit(): void {
    this.loadAuthorsAndGenres()
  }

  loadAuthorsAndGenres(): void {
    const authors$ = this.bookstoreService.getAuthors().pipe(
      switchMap(firstPage =>
        this.bookstoreService.getAllAuthors(firstPage.total_items)
      ),
      catchError(err => {
        console.error('Error fetching all authors:', err)
        return of([])
      })
    )

    const genres$ = this.bookstoreService.getGenres().pipe(
      switchMap(firstPage =>
        this.bookstoreService.getAllGenres(firstPage.total_items)
      ),
      catchError(err => {
        console.error('Error fetching all genres:', err)
        return of([])
      })
    )

    forkJoin({ authors: authors$, genres: genres$ }).subscribe({
      next: ({ authors, genres }) => {
        this.authors = authors.reduce((acc, author) => {
          if (author.id !== undefined) {
            acc[author.id] = author
          }
          return acc
        }, {} as Record<number, Author>)

        this.genres = genres.reduce((acc, genre) => {
          if (genre.id !== undefined) {
            acc[genre.id] = genre
          }
          return acc
        }, {} as Record<number, Genre>)
      },
      error: (err) => console.error('Error fetching data:', err)
    })
  }
  onSubmit(): void {
    if (this.bookForm.valid) {
      const genresValue = this.bookForm.value.genres
      const genresArray = Array.isArray(genresValue)
        ? genresValue.map(Number)
        : [Number(genresValue)]
      const authorsValue = this.bookForm.value.author
      const authorsArray = Array.isArray(authorsValue)
        ? authorsValue.map(Number)
        : [Number(authorsValue)]

      const rawBook: Partial<Book> = {
        ...this.bookForm.value,
        genres: genresArray,
        author: authorsArray
      }
      const filteredBook: Partial<Book> = Object.fromEntries(
        Object.entries(rawBook).filter(([_, value]) =>
          value !== undefined && value !== null && value !== ""
        )
      )


      this.bookstoreService.addBook(filteredBook).subscribe({
        next: (response) => {
          console.log('Book created:', response)
          this.bookForm.reset()
          this.selectedAuthors = []
          this.selectedGenres = []
        },
        error: (error) => {
          console.error('Error creating book:', error)
        }
      })
    }
  }



  get genresList(): Genre[] {
    return Object.values(this.genres)
  }

  get authorsList(): Author[] {
    return Object.values(this.authors)
  }

}
