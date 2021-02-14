import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md'

import { AccountService } from '../_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit, AfterViewInit{
    @ViewChild(MdbTablePaginationComponent) mdbTablePagination : MdbTablePaginationComponent;
    @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
    users : any = [];
    users_table : any = [];
    count = 0;
    myForm: FormGroup;  
    previous: any = [];
    
    constructor(private accountService: AccountService,
                private cdRef : ChangeDetectorRef) {}

    ngOnInit() {
        this.myForm = new FormGroup({          
               'keyword': new FormControl('')
          })
          this.accountService.getAll()
          .pipe(first())
          .subscribe(users => {
              this.users = users;
              this.users_table = users;
              this.mdbTable.setDataSource(this.users_table);
              this.users_table = this.mdbTable.getDataSource();
              this.previous = this.mdbTable.getDataSource();
              this.count = Object.keys(this.users_table).length;
          });
    }
    
    ngAfterViewInit(): void {
        this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);

        this.mdbTablePagination.calculateFirstItemIndex();
        this.mdbTablePagination.calculateLastItemIndex();
        this.cdRef.detectChanges();
    }

    onSubmit(){
        let keyword = this.myForm.get("keyword").value;
        let res = [];
        if(keyword != ''){
            this.users.forEach(user => {
                if(user["id"] == keyword || user["username"].includes(keyword) || user["firstName"].includes(keyword) 
                || user["lastName"].includes(keyword) || user["role"].includes(keyword)){
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