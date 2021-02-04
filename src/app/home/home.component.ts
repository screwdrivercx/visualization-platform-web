import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models';
import { AccountService, AlertService, VgenService, TemplateService } from '../_services';
import { OwlOptions } from 'ngx-owl-carousel-o'

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;
    items = null;
    role;
    count = 0;
    apiUrl = environment.apiUrl;
    templates = null;
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        navSpeed: 1000,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 4
            }
        },
        nav: true
    }

    constructor(private accountService: AccountService,
        private vgenService: VgenService,
        private alertService: AlertService,
        private TemplateService: TemplateService
    ) { }

    updateActivate(refId, status) {
        this.vgenService.updateActivate(refId, status)
            .subscribe(res => {
                this.count = 0;
                this.vgenService.getAll()
                    .subscribe((items: any[]) => {
                        items.forEach(item => {
                            if (item.status == "active") {
                                this.count++;
                            }
                        });
                        this.items = items;
                        console.log(items);
                        console.log(this.items);
                    });
            });

        this.alertService.success("Update Visualization status Successfully", { keepAfterRouteChange: true, autoClose: true });

    }

    delete(id, refId) {
        let confirm_text = "Are you sure to delete This Visualization ?\nIt will be deleted permanently. \nrefId : " + refId;
        if (confirm(confirm_text)) {
            const item = this.items.find(x => x.id === id);
            item.isDeleting = true;
            this.vgenService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.items = this.items.filter(x => x.id !== id)
                    this.count -= 1;
                    console.log("deleted");
                });
            this.alertService.success('Visualization Deleted Successfully', { keepAfterRouteChange: true, autoClose: true });
        }
    }

    ngOnInit(): void {
        this.role = this.accountService.getRole();
        this.user = this.accountService.userValue;
        if (this.role == "user" || this.role == "designer") {
            this.TemplateService.getAll()
                .pipe(first())
                .subscribe((templates: any[]) => {
                    this.templates = templates
                });
            this.vgenService.getAll()
                .pipe(first())
                .subscribe((items: any[]) => {
                    items.forEach(item => {
                        if (item.status == "active") {
                            this.count++;
                        }
                    });
                    this.items = items;
                });
        }

    }


}