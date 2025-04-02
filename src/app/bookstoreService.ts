import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pageble } from './pageble';
import {Author, Book, Genre} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookstoreService {
  private apiBaseUrl = 'https://bookstore-api.wis-software.ru/api';

  constructor(private http: HttpClient) {}

  getBooks(url: string = `${this.apiBaseUrl}/books`): Observable<Pageble<Book[]>> {
    return this.http.get<Pageble<Book[]>>(url);
  }

  getAuthors(url?: string): Observable<Pageble<Author[]>> {
    const requestUrl = url || `${this.apiBaseUrl}/authors`;
    return this.http.get<Pageble<Author[]>>(requestUrl);
  }

  getGenres(url?: string): Observable<Pageble<Genre[]>> {
    const requestUrl = url || `${this.apiBaseUrl}/genres`;
    return this.http.get<Pageble<Genre[]>>(requestUrl);
  }

  addAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(`${this.apiBaseUrl}/authors/`, author);
  }

  addGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(`${this.apiBaseUrl}/genres/`, genre);
  }

}

