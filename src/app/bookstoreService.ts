import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Book} from './booksInterface';
import { Observable, tap} from 'rxjs';
import {Pageble} from './pageble';

@Injectable({
  providedIn: 'root'
})
export class BookstoreService {
  private apiUrl = 'https://bookstore-api.wis-software.ru/api/books';

  constructor(private http: HttpClient) {}

  getBooks(url?: string): Observable<Pageble<Book[]>> {
    const requestUrl = url ?? this.apiUrl;

    return this.http.get<Pageble<Book[]>>(requestUrl).pipe(
      tap({
        next: () => console.log('Successfully fetched books'),
        error: (err) => console.error('Error fetching books:', err)
      })
    );
  }
}
