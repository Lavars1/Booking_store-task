import {Component, OnInit} from '@angular/core';
import {BookstoreService} from '../bookstoreService';
import {Pageble} from '../pageble';
import {Genre} from '../interfaces';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrl: './genres.component.scss'
})
export class GenresComponent implements OnInit {
  pageGenres: Pageble<Genre[]> | null = null;
  genreForm: FormGroup;

  constructor(
    private bookstoreService: BookstoreService,
    private fb: FormBuilder) {
    this.genreForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(400)]],
      discount: ['', [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(url?: string): void {
    this.bookstoreService.getGenres(url).subscribe(response => {
      this.pageGenres = response;
    });
  }

  loadNextGenresPage(): void {
    if (this.pageGenres?.links.next) {
      this.loadGenres(this.pageGenres.links.next);
    }
  }

  loadPrevGenresPage(): void {
    if (this.pageGenres?.links.previous) {
      this.loadGenres(this.pageGenres.links.previous)
    }
  }

  // Метод для отправки формы
  addGenre(): void {
    if (this.genreForm.valid) {
      this.bookstoreService.addGenre(this.genreForm.value).subscribe(response => {
        console.log('Genre added successfully', response);
        this.genreForm.reset(); // Очистить форму после успешного добавления
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
