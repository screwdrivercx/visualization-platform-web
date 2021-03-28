import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

@Component({ templateUrl: 'resetpassword.component.html' })
export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    token: string;
    notequal = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private actRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.token = this.actRoute.snapshot.params.token;
        this.form = this.formBuilder.group({
          password: ['', [Validators.required, Validators.minLength(6)]],
          password_confirm: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
      if(this.form.get("password").value != this.form.get("password_confirm").value){
        this.notequal = true;
        return ;
      }

        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.resetPassword(this.token, this.form.get("password").value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Reset password successful', { keepAfterRouteChange: true });
                    this.router.navigate(['/account/login']);
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
