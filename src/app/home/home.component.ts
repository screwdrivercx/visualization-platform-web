import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models';
import { AccountService, AlertService, VgenService, TemplateService, AnnouncementService } from '../_services';
import { OwlOptions } from 'ngx-owl-carousel-o'

@Component({ templateUrl: 'home.component.html', styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
    user: User;
    items = null;
    role;
    count = 0;
    countActive = 0;
    apiUrl = environment.apiUrl;
    templates = null;
    announcements = null

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
        private TemplateService: TemplateService,
        private announcementService: AnnouncementService
    ) { }

    updateActivate(refId, status) {
        this.vgenService.updateActivate(refId, status)
            .subscribe(() => {
                this.count = 0;
                this.countActive = 0;
                this.vgenService.getAll()
                    .subscribe((items: any[]) => {
                        items.forEach(item => {
                            if (item.status == "active") {
                                this.count++;
                                this.countActive++;
                            }else{
                                this.count++;
                            }
                        });
                        this.items = items;
                    });
            });

        this.alertService.success("Update Visualization status Successfully", { keepAfterRouteChange: true, autoClose: true });

    }

    delete(id, refId) {
        let confirm_text = "Are you sure to delete This Visualization ?\nIt will be deleted permanently. \nrefId : " + refId;
        if (confirm(confirm_text)) {
            const item = this.items.find(x => x.id === id);
            item.isDeleting = true;
            if(item["status"] == "active"){
                this.countActive--;
            }
            this.vgenService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.items = this.items.filter(x => x.id !== id)
                    this.count -= 1;
                });
            this.alertService.success('Visualization Deleted Successfully', { keepAfterRouteChange: true, autoClose: true });
        }
    }

    ngOnInit(): void {
        this.role = this.accountService.getRole();
        this.user = this.accountService.userValue;
        if (this.role == "user" || this.role == "designer") {
            this.announcementService.getLatest()
                .pipe(first())
                .subscribe((ann: any[]) => {
                    this.announcements = ann;
                })
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
                            this.countActive++;
                        }else{
                            this.count++;
                        }
                    });
                    this.items = items;
                });
        }

    }

    delete_(id: string) {
        let confirm_text = "Are you sure to delete this announcement ? This announcement will be deleted permanently."
        if(confirm(confirm_text)) {
            const announcement = this.announcements.find(x => x.id === id);
            announcement.isDeleting = true;
            this.announcementService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.announcements = this.announcements.filter(x => x.id !== id);
                });
          }
    }
}