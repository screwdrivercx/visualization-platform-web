import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, TemplateService } from '../_services';
import { environment } from 'src/environments/environment';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEditMode: boolean;
    loading = false;
    submitted = false;
    classInputText: string;
    embeddedInputText: string;
    imgInputText: string;
    isClassFileChange = false;
    isEmbeddedFileChange = false;
    isImgFileChange = false;
    isClassValid = true;
    isEmbeddedValid = true;
    isImgValid = true;
    imgUrl;
    apiUrl = environment.apiUrl;
    preconfig: Object;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private templateService: TemplateService,
        private alertService: AlertService,
        private router: Router
    ) { }

    onFileChange(type: string, event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (type == "class") {
                this.isClassFileChange = true;
                this.form.patchValue({
                    classFileSource: file
                });
                this.classInputText = this.form.get("classFileSource").value.name;
                this.isClassValid = true;
            }
            else if (type == 'img') {
                this.isImgFileChange = true;
                this.form.patchValue({
                    imgFileSource: file
                });
                this.imgInputText = this.form.get("imgFileSource").value.name;
                this.isImgValid = true;

                var mimeType = event.target.files[0].type;
                console.log(mimeType);
                if (mimeType.match(/image\/*/) == null) {
                    this.isImgValid = false;
                    this.imgUrl = null;
                    return;
                }

                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                reader.onload = (_event) => {
                    this.imgUrl = reader.result;
                }
            }
            else {
                this.isEmbeddedFileChange = true;
                this.form.patchValue({
                    embeddedFileSource: file
                });
                this.embeddedInputText = this.form.get("embeddedFileSource").value.name;
                this.isEmbeddedValid = true;
            }
        }
        else {
            type == "class" ? this.classInputText = "Select Class File" : this.embeddedInputText = "Select Embedded File";
        }
    }


    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = this.id ? true : false;

        this.imgInputText = "Drag and drop image here or browse file";
        this.classInputText = "Drag and drop Class file here or browse file";
        this.embeddedInputText = "Drag and drop Embedded file here or browse file";

        if(!this.isEditMode){
            this.form = this.formBuilder.group({
            templateName: ['', Validators.required],
            description: ['',Validators.required],
            class: ['', Validators.required],
            embedded: ['', Validators.required],
            img: ['', Validators.required],
            classFileSource: ['', Validators.required],
            embeddedFileSource: ['', Validators.required],
            imgFileSource: ['', Validators.required]
            });
        } else {
            this.form = this.formBuilder.group({
                templateName: [''],
                description: [''],
                class: [''],
                embedded: [''],
                img: [''],
                classFileSource: [''],
                embeddedFileSource: [''],
                imgFileSource: ['']
                });
            this.templateService.getById(this.id)
                .subscribe(res => {
                    this.preconfig = res;
                    console.log(this.preconfig);
                    this.imgInputText = this.preconfig["img"];
                    this.classInputText = this.preconfig["class_name"];
                    this.embeddedInputText = this.preconfig["embedded_name"];
                    this.form.patchValue({
                        templateName : this.preconfig["TemplateName"],
                        description : this.preconfig["description"]
                    })
                    this.imgUrl = this.apiUrl + "/static/" + this.preconfig["img"]
                })
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

        if (this.classInputText.split(".").pop() != "js") {
            this.isClassValid = false;
        }

        if (this.embeddedInputText.split(".").pop() != "js") {
            this.isEmbeddedValid = false;
        }

        if (this.imgInputText.split(".").pop() != "jpg" && this.imgInputText.split(".").pop() != "jpeg" && this.imgInputText.split(".").pop() != "png") {
            this.isImgValid = false;
        }

        if (!this.isClassValid || !this.isEmbeddedValid || !this.isImgValid) return;

        this.loading = true;
        const formData = new FormData();
        
        if (!this.isEditMode) {
            formData.append('templateName', this.form.get("templateName").value);
            formData.append('description',this.form.get('description').value);
            formData.append('image', this.form.get('imgFileSource').value);
            formData.append('class', this.form.get('classFileSource').value);
            formData.append('embedded', this.form.get('embeddedFileSource').value);

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
            var blob1 = new Blob([this.preconfig["img_file"]],{ type: this.imgInputText.split(".").pop() == "png" ? 'image/png' : 'image/jpeg'});
            var blob2 = new Blob([this.preconfig["class_file"]],{ type: 'text/javascript'});
            var blob3 = new Blob([this.preconfig["embedded_file"]],{ type: 'text/javascript'});

            formData.append('templateName', this.form.get("templateName").value);
            formData.append('description',this.form.get('description').value);
            this.isImgFileChange && this.form.get("imgFileSource").value != '' ?
                formData.append('image', this.form.get("imgFileSource").value) :
                formData.append('image', '');
            this.isClassFileChange && this.form.get("classFileSource").value != '' ?
                formData.append('class', this.form.get("classFileSource").value) :
                formData.append('class', blob2, this.classInputText);
            this.isEmbeddedFileChange && this.form.get("embeddedFileSource").value != '' ?
                formData.append('embedded', this.form.get("embeddedFileSource").value) :
                formData.append('embedded', blob3, this.embeddedInputText);

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