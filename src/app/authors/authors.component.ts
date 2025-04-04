import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookstoreService } from '../bookstoreService';
import { Pageble } from '../pageble';
import { Author } from '../interfaces';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
  imports: [RouterLink, FormsModule, ReactiveFormsModule]
})
export class AuthorsComponent implements OnInit {
  pageAuthors: Pageble<Author[]> | null = null;
  authorForm: FormGroup;
  editingAuthorId: number | null = null;
  editForm: FormGroup;
  currentPage: number = 1;

  constructor(
    private fb: FormBuilder,
    private bookstoreService: BookstoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.authorForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
      second_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]]
    })
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const page = params.get('page')
      this.currentPage = page ? +page : 1
      this.loadAuthors()
    })
  }

  loadAuthors(url?: string): void {
    const apiUrl = url || `${this.bookstoreService.apiBaseUrl}/authors/?page=${this.currentPage}`
    this.bookstoreService.getAuthors(apiUrl).subscribe(response => {
      this.pageAuthors = response
    })
  }

  loadNextAuthorsPage(): void {
    if (this.pageAuthors?.links.next) {
      const nextPage = this.currentPage + 1
      this.router.navigate([`/authors/${nextPage}`])
    }
  }

  loadPrevAuthorsPage(): void {
    if (this.pageAuthors?.links.previous) {
      const prevPage = this.currentPage - 1
      this.router.navigate([`/authors/${prevPage}`])
    }
  }

  startEditing(author: Author): void {
    this.editingAuthorId = author.id!
    this.editForm.patchValue({
      first_name: author.first_name,
      second_name: author.second_name
    })
  }

  cancelEditing(): void {
    this.editingAuthorId = null
  }

  saveAuthor(authorId: number): void {
    if (this.editForm.valid) {
      this.bookstoreService.patchAuthor(authorId, this.editForm.value).subscribe({
        next: (updatedAuthor) => {
          const index = this.pageAuthors!.result.findIndex(a => a.id === authorId)
          if (index !== -1) {
            this.pageAuthors!.result[index] = updatedAuthor
          }
          this.editingAuthorId = null
          console.log("Author saved successfully")
        },
        error: (err) => {
          console.error('Error updating author:', err)
        }
      })
    }
  }

  addAuthor(): void {
    if (this.authorForm.valid) {
      this.bookstoreService.addAuthor(this.authorForm.value).subscribe(response => {
        console.log('Author added successfully', response)
        this.authorForm.reset()
        this.loadAuthors()
      })
    }
  }

  deleteAuthor(authorID: number): void {
    this.bookstoreService.deleteAuthor(authorID).subscribe({
      next: () => {
        console.log(`Author ${authorID} successfully deleted`)
        this.loadAuthors()
      },
      error: (err) => {
        console.error(`Error deleting author ${authorID}:`, err)
      }
    })
  }
}
