import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { AccountService,VgenService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit{
    user: User;
    items = null;
    role;
    count : Number;

    constructor(private accountService: AccountService,
                private vgenService: VgenService) { }

    ngOnInit(): void {
        this.role = this.accountService.getRole();
        this.user = this.accountService.userValue;
        if(this.accountService.getRole() == "user" || this.accountService.getRole() == "designer"){
            this.vgenService.getAll()
            .pipe(first())
            .subscribe(items => {
                this.items = items;
                this.count = items.length;
            });
        }
        
    }


}