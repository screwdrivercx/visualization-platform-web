import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AnnouncementService, AccountService } from '../_services'
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md'
import { User } from '../_models';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './announcement.component.html'
})
export class AnnouncementComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent) mdbTablePagination : MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective;
  announcements: any = [];
  previous: any = [];
  user: User;

  constructor(
    private announcementService: AnnouncementService,
    private accountService: AccountService,
    private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.user = this.accountService.userValue;
    this.announcementService.getAll()
    .subscribe(ann => {
      this.announcements = ann;
      this.mdbTable.setDataSource(this.announcements);
      this.announcements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    })
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(20);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  delete(id: string) {
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
