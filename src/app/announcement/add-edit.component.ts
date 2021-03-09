import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AnnouncementService } from '../_services';
import { environment } from 'src/environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEditMode: boolean;
    loading = false;
    submitted = false;
    apiUrl = environment.apiUrl;

    editorConfig: AngularEditorConfig = {
        editable: true,
          spellcheck: true,
          height: 'auto',
          minHeight: '40vh',
          maxHeight: '40vh',
          width: 'auto',
          minWidth: '0',
          translate: 'yes',
          enableToolbar: true,
          showToolbar: true,
          placeholder: 'Enter text here...',
          defaultParagraphSeparator: '',
          defaultFontName: '',
          defaultFontSize: '',
          fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
          ],
          customClasses: [
          {
            name: 'quote',
            class: 'quote',
          },
          {
            name: 'redText',
            class: 'redText'
          },
          {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1',
          },
        ],
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [
                'subscript',
                'superscript',
              ],
              [
                'customClasses',
                'insertImage',
                'insertVideo',
                'removeFormat',
              ]
        ]
    };


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private announcementService: AnnouncementService,
        private router: Router
    ) { }


    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = this.id ? true : false;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            message: ['', Validators.required],
        });

        if (this.isEditMode) {
            this.announcementService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (!this.isEditMode) {
            this.create();
        } else {
            this.update();
        }
    }

    create(){
        this.announcementService.create(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Announcement Added Successfully', { keepAfterRouteChange: true });
                this.router.navigate(['/home']);
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    }

    update(){
        this.announcementService.update(this.id, this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Announcement Updated Successfully', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    }

}