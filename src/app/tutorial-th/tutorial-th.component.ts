import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TemplateService,AccountService } from '../_services';

@Component({
  selector: 'app-tutorial-th',
  templateUrl: './tutorial-th.component.html',
  styleUrls: ['./tutorial-th.component.css']
})
export class TutorialThComponent implements OnInit {
  templates: Object;
  apiUrl = environment.apiUrl;

  constructor(private router : Router,
    private accountService : AccountService,
    private templateService : TemplateService) { }

  handleChange(){
    this.router.navigate(['/tutorial']);
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  ngOnInit(): void {
    const user = this.accountService.userValue;
    if(user)
    this.templateService.getAll()
      .pipe(first())
      .subscribe(templates => this.templates = templates);
  }
}
