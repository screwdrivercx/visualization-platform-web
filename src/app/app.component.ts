import { Component,OnInit } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models/user';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent implements OnInit{
    title = "visualization-platform";
    user: User;
    isHome:Boolean;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(): void {
        let url = window.location.href.split('/');
        if(url.length<=4 && url.pop() == ""){
            this.isHome = true
        }else{
            this.isHome = false;
        }
        
        console.log(this.isHome)
    }

    toHome(){
        this.isHome = true;
        console.log(this.isHome)
    }

    toOther(){
        this.isHome = false;
        console.log(this.isHome)
    }

    logout() {
        this.accountService.logout();
    }
}