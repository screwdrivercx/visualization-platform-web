import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { AccountService } from '../_services';
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title = "visualization-platform";
  user: User;
  apiUrl = environment.apiUrl;


    constructor(private accountService: AccountService,
                private router : Router) { }

    ngOnInit(): void {
      this.accountService.user.subscribe(x => this.user = x);
        if(this.user){
          this.router.navigate(['/home']);
        }
    }
}
