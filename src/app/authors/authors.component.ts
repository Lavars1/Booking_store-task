import {Component, OnInit} from '@angular/core';
import {BookstoreService} from '../bookstoreService';
import {Pageble} from '../pageble';
import {Author} from '../interfaces';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'app-authors',
    templateUrl: './authors.component.html',
    imports: [
        RouterLink,
        FormsModule,
        ReactiveFormsModule
    ],
    styleUrl: './authors.component.scss'
})
export class AuthorsComponent implements OnInit {
    pageAuthors: Pageble<Author[]> | null = null;
    newAuthor: Author = {first_name: '', second_name: ''};
    authorForm: FormGroup;


    constructor(
        private fb: FormBuilder,
        private bookstoreService: BookstoreService
    ) {
        this.authorForm = this.fb.group({
            first_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
            second_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]]
        });
    }

    ngOnInit(): void {
        this.loadAuthors();
    }

    loadAuthors(url?: string): void {
        this.bookstoreService.getAuthors(url).subscribe(response => {
            this.pageAuthors = response;
        })
    }

    loadNextAuthorsPage(): void {
        if (this.pageAuthors?.links.next) {
            this.loadAuthors(this.pageAuthors.links.next);
        }
    }

    loadPrevAuthorsPage(): void {
        if (this.pageAuthors?.links.previous) {
            this.loadAuthors(this.pageAuthors.links.previous);
        }
    }

    addAuthor(): void {
        if (this.authorForm.valid) {
            this.bookstoreService.addAuthor(this.authorForm.value).subscribe(response => {
                console.log('Author added successfully', response);
                this.authorForm.reset()
            });
        }
    }
}
