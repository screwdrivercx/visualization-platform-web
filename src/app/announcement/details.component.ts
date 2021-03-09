import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AnnouncementService } from '../_services'
@Component({
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  announcement = null;
  id = null;
  constructor(
    private announcementService: AnnouncementService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    
    this.announcementService.getById(this.id)
    .pipe(first())
    .subscribe(ann => {
      this.announcement = ann;
    })
  }

}
