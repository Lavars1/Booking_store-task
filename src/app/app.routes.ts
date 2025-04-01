import { Routes } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {MainPageComponent} from './main-page/main-page.component';


export const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'books', component: BooksComponent},
  {path: "**", redirectTo: ""}
];
