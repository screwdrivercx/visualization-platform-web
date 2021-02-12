import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { TemplateService } from '../_services';

@Component({ templateUrl: 'templateList.component.html' })
export class TemplateListComponent implements OnInit {
  count = 0;
  myForm: FormGroup;
  refId: string;
  isEditMode: boolean;
  templates = null;
  apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute,
    private templateService: TemplateService) { }

  deleteTemplate(id: Number,templateName: string) {
    let confirm_text = "Are you sure to delete template " + templateName + " ? The template will be deleted permanently."
    if (confirm(confirm_text)) {
      const template = this.templates.find(x => x.id === id);
      template.isDeleting = true;
      this.templateService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.templates = this.templates.filter(x => x.id !== id);
          this.count--;
        });
    }

  }

  ngOnInit() {
    this.refId = this.route.snapshot.params['refId'];
    this.isEditMode = this.refId ? true : false;
    
    this.templateService.getAll()
      .pipe(first())
      .subscribe(templates => {
        this.templates = templates;
        this.count = Object.keys(this.templates).length;
      });
  }

  onSubmit() {

  }

}