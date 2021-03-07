import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, TemplateService } from '../_services';
import { environment } from 'src/environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEditMode: boolean;
    loading = false;
    submitted = false;
    imgInputText: string;
    classInputText: string;
    embeddedInputText: string;
    dataInputText: string;
    configInputText: string;
    isClassFileChange = false;
    isEmbeddedFileChange = false;
    isImgFileChange = false;
    isDataFileChange = false;
    isConfigFileChange = false;
    isClassValid = true;
    isEmbeddedValid = true;
    isImgValid = true;
    isDataValid = true;
    isConfigValid = true;
    imgUrl;
    apiUrl = environment.apiUrl;
    preconfig: Object;

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
            else if (type == "data") {
                this.isDataFileChange = true;
                this.form.patchValue({
                    dataFileSource: file
                });
                this.dataInputText = this.form.get("dataFileSource").value.name;
                this.isDataValid = true;
            }
            else if (type == "config") {
                this.isConfigFileChange = true;
                this.form.patchValue({
                    configFileSource: file
                });
                this.configInputText = this.form.get("configFileSource").value.name;
                this.isConfigValid = true;
            }
            else if(type == "embedded"){
                this.isEmbeddedFileChange = true;
                this.form.patchValue({
                    embeddedFileSource: file
                });
                this.embeddedInputText = this.form.get("embeddedFileSource").value.name;
                this.isEmbeddedValid = true;
            }
        }
        else {
            return;
        }
    }


    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = this.id ? true : false;

        this.imgInputText = "Drag and drop image here or browse file";
        this.classInputText = "Drag and drop Class file here or browse file";
        this.embeddedInputText = "Drag and drop Embedded file here or browse file";
        this.dataInputText = "Drag and drop example data file here or browse file";
        this.configInputText = "Drag and drop example config file here or browse file";

        if(!this.isEditMode){
            this.form = this.formBuilder.group({
                templateName: ['', Validators.required],
                description: ['',Validators.required],
                img: ['', Validators.required],
                class: ['', Validators.required],
                embedded: ['', Validators.required],
                data: ['',Validators.required],
                config: ['',Validators.required],
                imgFileSource: ['', Validators.required],
                classFileSource: ['', Validators.required],
                embeddedFileSource: ['', Validators.required],
                dataFileSource: ['',Validators.required],
                configFileSource: ['',Validators.required]
            });
        } else {
            this.form = this.formBuilder.group({
                templateName: [''],
                description: [''],
                img: [''],
                class: [''],
                embedded: [''],
                data: [''],
                config: [''],
                classFileSource: [''],
                embeddedFileSource: [''],
                imgFileSource: [''],
                dataFileSource: [''],
                configFileSource: ['']
            });
            this.templateService.getById(this.id)
                .subscribe(res => {
                    this.preconfig = res;
                    this.imgInputText = this.preconfig["img"];
                    this.classInputText = this.preconfig["class_name"];
                    this.embeddedInputText = this.preconfig["embedded_name"];
                    this.dataInputText = this.preconfig["data_name"];
                    this.configInputText = this.preconfig["config_name"];
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

        if(this.dataInputText.split(".").pop() != "csv" && this.dataInputText.split(".").pop() != "json"){
            this.isDataValid = false;
        }
      
        if(this.configInputText.split(".").pop() != "csv" && this.configInputText.split(".").pop() != "json"){
            this.isConfigValid = false;
        }

        if (!this.isClassValid || !this.isEmbeddedValid || !this.isImgValid || !this.isDataValid || !this.isConfigValid) return;

        this.loading = true;
        const formData = new FormData();
        
        if (!this.isEditMode) {
            formData.append('templateName', this.form.get("templateName").value);
            formData.append('description',this.form.get('description').value);
            formData.append('image', this.form.get('imgFileSource').value);
            formData.append('class', this.form.get('classFileSource').value);
            formData.append('embedded', this.form.get('embeddedFileSource').value);
            formData.append('data', this.form.get('dataFileSource').value);
            formData.append('config', this.form.get('configFileSource').value);

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
            var blob1 = new Blob([this.preconfig["class_file"]],{ type: 'text/javascript'});
            var blob2 = new Blob([this.preconfig["embedded_file"]],{ type: 'text/javascript'});
            var blob3 = new Blob([this.preconfig["data"]],{ type: this.dataInputText.split(".").pop() == "csv" ? 'application/vnd.ms-excel' : 'application/json'})
            var blob4 = new Blob([this.preconfig["config"]],{ type: this.configInputText.split(".").pop() == "csv" ? 'application/vnd.ms-excel' : 'application/json'})


            formData.append('templateName', this.form.get("templateName").value);
            formData.append('description',this.form.get('description').value);
            this.isImgFileChange && this.form.get("imgFileSource").value != '' ?
                formData.append('image', this.form.get("imgFileSource").value) :
                formData.append('image', '');
            this.isClassFileChange && this.form.get("classFileSource").value != '' ?
                formData.append('class', this.form.get("classFileSource").value) :
                formData.append('class', blob1, this.classInputText);
            this.isEmbeddedFileChange && this.form.get("embeddedFileSource").value != '' ?
                formData.append('embedded', this.form.get("embeddedFileSource").value) :
                formData.append('embedded', blob2, this.embeddedInputText);
            this.isDataFileChange && this.form.get("dataFileSource").value != '' ?
                formData.append('data', this.form.get("dataFileSource").value) :
                formData.append('data', blob3, this.dataInputText);
            this.isConfigFileChange && this.form.get("configFileSource").value != '' ?
                formData.append('config', this.form.get("configFileSource").value) :
                formData.append('config', blob4, this.configInputText);

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