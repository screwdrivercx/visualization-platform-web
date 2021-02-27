import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router'
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TemplateService } from '../_services'

@Component({ templateUrl: './template.component.html' })

export class TemplateComponent implements OnInit {
  id: number;
  template: Object;
  apiUrl = environment.apiUrl;
  tryDoctype;

  constructor(
    private templateService : TemplateService,
    private actRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;

    this.templateService.getById(this.id)
      .pipe(first())
      .subscribe(template => {
        this.template = template
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/static/example-${this.template["TemplateName"]}.html`);
      });
  }

}
