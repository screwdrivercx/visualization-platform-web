import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, VgenService } from '../_services'

@Component({ templateUrl: 'detail.component.html' })
export class DetailComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  TemplateName: String;
  inputText: String;

  constructor(
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private vgenService: VgenService
  ) {
    this.TemplateName = this.actRoute.snapshot.params.TemplateName;
    this.inputText = "Select Data File";
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      data: ['', Validators.required],
      config: [''],
      fileSource: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      
      this.form.patchValue({
        fileSource: file
      });

      this.inputText = this.form.get("fileSource").value.name;
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('dataset', this.form.get('fileSource').value);
    this.loading = true;
    this.vgenService.generate(this.TemplateName, formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.alertService.success('Generate Visualization successful', { keepAfterRouteChange: true });
          //this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}

