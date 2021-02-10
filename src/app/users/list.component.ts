import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;
    users_table = null;
    count = 0;
    myForm: FormGroup;  
    
    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.myForm = new FormGroup({          
               'keyword': new FormControl('')
          })
          this.accountService.getAll()
          .pipe(first())
          .subscribe(users => {
              this.users = users;
              this.users_table = users;
              this.count = Object.keys(this.users).length;
          });
    }

    onSubmit(){
        let keyword = this.myForm.get("keyword").value;
        let res = [];
        if(keyword != ''){
            this.users.forEach(user => {
                if(user["username"] === keyword || user["firstName"] === keyword 
                || user["lastName"] === keyword || user["role"] === keyword){
                    res.push(user)
                }
            });
            this.users_table = res;
        }
        else{
            this.users_table = this.users;
        }
    }

    deleteUser(id: string,username: string) {
        let confirm_text = "Are you sure to delete user "+ username + " ? The user will be deleted permanently."
        if(confirm(confirm_text)) {
            const user = this.users.find(x => x.id === id);
            user.isDeleting = true;
            this.accountService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.users = this.users.filter(x => x.id !== id);
                    this.users_table = this.users.filter(x => x.id !== id);
                    this.count--;
                });
          }
        
    }
}