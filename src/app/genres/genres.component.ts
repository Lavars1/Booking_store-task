import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookstoreService } from '../bookstoreService';
import { Pageble } from '../pageble';
import { Genre } from '../interfaces';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
  imports: [RouterLink, FormsModule, ReactiveFormsModule]
})
export class GenresComponent implements OnInit {
  pageGenres: Pageble<Genre[]> | null = null;
  genreForm: FormGroup;
  editingGenreId: number | null = null;
  editForm: FormGroup;
  currentPage: number = 1;

  constructor(
    private bookstoreService: BookstoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.genreForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(400)]],
      discount: [null, [Validators.min(0), Validators.max(100)]]
    });
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(400)]],
      discount: [null, [Validators.min(0), Validators.max(100)]]
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const page = params.get('page')
      this.currentPage = page ? +page : 1
      this.loadGenres()
    })
  }

  loadGenres(url?: string): void {
    const apiUrl = url || `${this.bookstoreService.apiBaseUrl}/genres/?page=${this.currentPage}`;
    this.bookstoreService.getGenres(apiUrl).subscribe(response => {
      this.pageGenres = response;
    })
  }

  loadNextGenresPage(): void {
    if (this.pageGenres?.links.next) {
      const nextPage = this.currentPage + 1
      this.router.navigate([`/genres/${nextPage}`])
    }
  }

  loadPrevGenresPage(): void {
    if (this.pageGenres?.links.previous) {
      const prevPage = this.currentPage - 1
      this.router.navigate([`/genres/${prevPage}`])
    }
  }

  addGenre(): void {
    if (this.genreForm.valid) {

      const rawGenre: Partial<Genre> = {...this.genreForm.value}

      const filteredGenres: Partial<Genre> = Object.fromEntries(
        Object.entries(rawGenre).filter(([_, value]) =>
          value !== null
        )
      )


      this.bookstoreService.addGenre(filteredGenres).subscribe(response => {
        console.log('Genre added successfully', response)
        this.genreForm.reset()
        this.loadGenres()
      })
    } else {
      console.log('Form is invalid');
    }
  }

  deleteGenre(genreID: number): void {
    this.bookstoreService.deleteGenre(genreID).subscribe({
      next: () => {
        console.log(`Genre ${genreID} successfully deleted`)
        this.loadGenres();
      },
      error: (err) => {
        console.error(`Error deleting genre ${genreID}:`, err)
      }
    })
  }

  startEditing(genre: Genre): void {
    this.editingGenreId = genre.id!
    this.editForm.patchValue({
      title: genre.title,
      description: genre.description,
      discount: genre.discount
    })
  }

  cancelEditing(): void {
    this.editingGenreId = null
  }

  saveGenre(genreId: number): void {
    if (this.editForm.valid) {
      this.bookstoreService.patchGenre(genreId, this.editForm.value)
        .subscribe({
          next: (updatedGenre) => {
            const index = this.pageGenres!.result.findIndex(a => a.id === genreId)
            if (index !== -1) {
              this.pageGenres!.result[index] = updatedGenre
            }
            this.editingGenreId = null;
            console.log("Genre saved successfully")
          },
          error: (err) => {
            console.error('Error updating genre:', err)
          }
        })
    }
  }
}
