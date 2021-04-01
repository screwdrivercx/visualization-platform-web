import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { TemplateService, AlertService } from '../_services';

@Component({ templateUrl: 'templateList.component.html' })
export class TemplateListComponent implements OnInit {
  myForm: FormGroup;
  refId: string;
  isEditMode: boolean;
  templates = null;
  apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute,
    private templateService: TemplateService,
    private alertService: AlertService) { }

  changeActivate(id: Number, status: string, templateName: string) {
    let confirm_text = "Are you sure to " + status == "active" ? "deactivate" : "activate" + " template " + templateName + " ? This change will affect all users."
    if (confirm(confirm_text)) {
      const template = this.templates.find(x => x.id === id);
      template.isDeleting = true;
      this.templateService.updateActivate(id, status)
        .pipe(first())
        .subscribe(() => {
          this.templateService.getOwn()
            .pipe(first())
            .subscribe(templates => {
              this.templates = templates;
              this.templates.forEach(template => {
                let enc = new TextDecoder("utf-8");
                template.description = enc.decode(new Uint8Array(template.description.data))
            });
            });
        });
    }
    this.alertService.success("Update Template status Successfully", { keepAfterRouteChange: true, autoClose: true });
  }

  deleteTemplate(id: Number, templateName: string) {
    let confirm_text = "Are you sure to delete template " + templateName + " ? The template will be deleted permanently."
    if (confirm(confirm_text)) {
      const template = this.templates.find(x => x.id === id);
      template.isDeleting = true;
      this.templateService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.templates = this.templates.filter(x => x.id !== id);
          this.templates.forEach(template => {
            let enc = new TextDecoder("utf-8");
            template.description = enc.decode(new Uint8Array(template.description.data))
        });
        });
    }
  }

  ngOnInit() {
    this.refId = this.route.snapshot.params['refId'];
    this.isEditMode = this.refId ? true : false;

    this.templateService.getOwn()
      .pipe(first())
      .subscribe(templates => {
        this.templates = templates;
        this.templates.forEach(template => {
            let enc = new TextDecoder("utf-8");
            template.description = enc.decode(new Uint8Array(template.description.data))
        });
      });
  }

  onSubmit() {

  }

}
