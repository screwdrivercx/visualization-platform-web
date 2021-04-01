import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService, AlertService } from '../_services';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md'

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent) mdbTablePagination : MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
  logs: any = [];
  previous: any = [];
  myForm: FormGroup;

  constructor(private accountService: AccountService,
              private alertService : AlertService,
              private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'keyword': new FormControl('')
    });

    this.accountService.getAllLog()
      .subscribe(res => {
        this.logs = res;
        this.mdbTable.setDataSource(this.logs);
        this.logs = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      });
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(20);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  onSubmit() {
    let keyword = this.myForm.get("keyword").value;

    if (keyword != '') {
      if (isNaN(+keyword)) { //is a role
        this.accountService.getLogByRole(keyword)
          .subscribe(res => {
            this.logs = res;
          })
      } else { // is an id
        this.accountService.getLogById(keyword)
          .subscribe(res => {
            this.logs = res;
          },err =>{
            this.alertService.error(err, { keepAfterRouteChange : false, autoClose: true });
          })
      }

    } else {
      this.accountService.getAllLog()
      .subscribe(res => {
        this.logs = res;
      });
    }

  }

}
