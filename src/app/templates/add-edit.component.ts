import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, TemplateService } from '../_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEditMode: boolean;
    loading = false;
    submitted = false;
    classInputText: string;
    embeddedInputText: string;
    isClassFileChange = false;
    isEmbeddedFileChange = false;
    isClassValid = true;
    isEmbeddedValid = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private templateService : TemplateService,
        private alertService: AlertService,
        private router : Router
    ) { }

    onFileChange(type: string,event) {
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          console.log(file);
          if(type == "class"){
              this.isClassFileChange = true;
            this.form.patchValue({
              classFileSource: file
            });
            this.classInputText = this.form.get("classFileSource").value.name;
            this.isClassValid = true;
          } else{
              this.isEmbeddedFileChange = true;
            this.form.patchValue({
              embeddedFileSource: file
            });
            this.embeddedInputText = this.form.get("embeddedFileSource").value.name;
            this.isEmbeddedValid = true;
          }
        }
        else{
          type == "class" ? this.classInputText = "Select Class File" : this.embeddedInputText = "Select Embedded File";
        }
      }
    

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = this.id ? true : false;

        if(this.isEditMode){
            this.templateService.getById(this.id)
            .subscribe(res => {
                this.form.get("templateName").setValue(res["TemplateName"]);
            })
        }

        this.classInputText = "Drag and drop Class file here or browse file";
        this.embeddedInputText = "Drag and drop Embedded file here or browse file";
        this.form = this.formBuilder.group({
            templateName: ['', Validators.required],
            class: ['', Validators.required],
            embedded: ['', Validators.required],
            classFileSource: ['', Validators.required],
            embeddedFileSource: ['', Validators.required]
        });

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

        if(this.classInputText.split(".").pop() != "js"){
            this.isClassValid=false;
          }
      
        if(this.embeddedInputText.split(".").pop() != "js"){
            this.isEmbeddedValid = false;
        }

        if(!this.isClassValid || !this.isEmbeddedValid) return;

        const formData = new FormData();

        formData.append('templateName',this.form.get("templateName").value);
        formData.append('class', this.form.get('classFileSource').value);
        formData.append('embedded', this.form.get('embeddedFileSource').value);

        this.loading = true;
        if (!this.isEditMode) {
            this.templateService.create(formData)
            .subscribe({
                next: () => {
                    this.alertService.success('Template Added Successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/templates'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            })
        } else {
            this.templateService.update(formData)
            .subscribe({
                next: () => {
                    this.alertService.success('Template Updated Successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/templates'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            })
        }
    }

}