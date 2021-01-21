import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models/user';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    title = "visualization-platform";
    user: User;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        console.log(this.user);
    }

    logout() {
        this.accountService.logout();
    }
}