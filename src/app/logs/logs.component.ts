import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  myForm: FormGroup;
  logs = null;
  logs_table = null;

  constructor(private accountService: AccountService,
              private alertService : AlertService) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'keyword': new FormControl('')
    })
    this.accountService.getAllLog()
      .subscribe(res => {
        this.logs = res;
        this.logs_table = res;
      })
  }

  onSubmit() {
    let keyword = this.myForm.get("keyword").value;

    if (keyword != '') {
      if (isNaN(+keyword)) { //is a role
        this.accountService.getLogByRole(keyword)
          .subscribe(res => {
            this.logs_table = res;
          })
      } else { // is an id
        this.accountService.getLogById(keyword)
          .subscribe(res => {
            this.logs_table = res;
          },err =>{
            this.alertService.error(err, { keepAfterRouteChange : false, autoClose: true });
          })
      }

    } else {
      this.logs_table = this.logs;
    }

  }

}
