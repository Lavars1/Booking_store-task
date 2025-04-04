import { Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GenresComponent } from './genres/genres.component';
import { AuthorsComponent } from './authors/authors.component';
import { NewBookComponent } from './new-book/new-book.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  {
    path: 'books',
    children: [
      { path: '', component: BooksComponent },
      { path: 'new', component: NewBookComponent },
      { path: ':page', component: BooksComponent }
    ]
  },
  {
    path: 'authors',
    children: [
      { path: '', component: AuthorsComponent },
      { path: ':page', component: AuthorsComponent }
    ]
  },
  {
    path: 'genres',
    children: [
      { path: '', component: GenresComponent },
      { path: ':page', component: GenresComponent }
    ]
  },
  { path: '**', redirectTo: '' }
]
