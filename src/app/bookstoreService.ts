import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Pageble} from './pageble';
import {Author, Book, Genre} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookstoreService {
  apiBaseUrl = 'https://bookstore-api.wis-software.ru/api'

  constructor(private http: HttpClient) {
  }

  getBooks(url: string = `${this.apiBaseUrl}/books/?page=${1}`): Observable<Pageble<Book[]>> {
    return this.http.get<Pageble<Book[]>>(url)
  }

  getAuthors(url?: string): Observable<Pageble<Author[]>> {
    const requestUrl = url || `${this.apiBaseUrl}/authors`
    return this.http.get<Pageble<Author[]>>(requestUrl)
  }

  getGenres(url?: string): Observable<Pageble<Genre[]>> {
    const requestUrl = url || `${this.apiBaseUrl}/genres`
    return this.http.get<Pageble<Genre[]>>(requestUrl)
  }

  addAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(`${this.apiBaseUrl}/authors/`, author)
  }

  addGenre(genre: Partial<Genre>): Observable<Genre> {
    return this.http.post<Genre>(`${this.apiBaseUrl}/genres/`, genre)
  }

  getAllAuthors(count:number): Observable<Author[]> {
    return this.http.get<Pageble<Author[]>>(`${this.apiBaseUrl}/authors/?page_size=${count}`).pipe(
      map(response => response.result as Author[]),
    )
  }

  getAllGenres(count:number): Observable<Genre[]> {
    return this.http.get<Pageble<Genre[]>>(`${this.apiBaseUrl}/genres/?page_size=${count}`).pipe(
      map(response => response.result as Genre[]),
    )
  }

  addBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.apiBaseUrl}/books/`, book)
  }

  deleteAuthor(authID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/authors/${authID}/`)
  }

  deleteGenre(genreID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/genres/${genreID}/`)
  }

  deleteBook(bookID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/books/${bookID}`)
  }

  patchAuthor(authorId: number, changes: Partial<Author>): Observable<Author> {
    return this.http.patch<Author>(`${this.apiBaseUrl}/authors/${authorId}/`, changes)
  }

  patchGenre(genreID: number, changes: Partial<Genre>) {
    return this.http.patch<Genre>(`${this.apiBaseUrl}/genres/${genreID}/`, changes)
  }


}

