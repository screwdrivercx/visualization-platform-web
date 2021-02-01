import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { AccountService,AlertService,VgenService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit{
    user: User;
    items = null;
    role;
    count : Number;

    constructor(private accountService: AccountService,
                private vgenService: VgenService,
                private alertService: AlertService) { }


    delete(id,refId){
        let confirm_text = "Are you sure to delete This Visualization ?\nIt will be deleted permanently. \nrefId : " + refId;
        if(confirm(confirm_text)) {
            const item = this.items.find(x => x.id === id);
            item.isDeleting = true;
            this.vgenService.delete(id)
                .pipe(first())
                .subscribe(() => this.items = this.items.filter(x => x.id !== id));
            this.alertService.success('Visualization Deleted Successfully', { keepAfterRouteChange: true });
          }
    }

    ngOnInit(): void {
        this.role = this.accountService.getRole();
        this.user = this.accountService.userValue;
        if(this.role == "user" || this.role == "designer"){
            this.vgenService.getAll()
            .pipe(first())
            .subscribe((items: any[]) => {
                this.items = items;
                this.count = items.length;
            });
        }
        
    }


}