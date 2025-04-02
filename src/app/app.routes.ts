import { Routes } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {MainPageComponent} from './main-page/main-page.component';
import {GenresComponent} from './genres/genres.component';
import {AuthorsComponent} from './authors/authors.component';


export const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'books', component: BooksComponent},
  {path: "authors", component: AuthorsComponent},
  {path: "genres", component: GenresComponent},
  {path: 'books/new', component: MainPageComponent},
  {path: "**", redirectTo: ""}
];
