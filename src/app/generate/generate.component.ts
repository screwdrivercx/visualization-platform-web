import { Component, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TemplateService } from '../_services'

@Component({ templateUrl: 'generate.component.html' })
export class GenerateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  templates = null;
  
  constructor(private TemplateService : TemplateService) { }

  ngOnInit(): void {
    this.TemplateService.getAll()
      .pipe(first())
      .subscribe(templates => this.templates = templates);
  }

  onSubmit(){

  }
}
