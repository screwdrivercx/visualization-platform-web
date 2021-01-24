import { Component, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TemplateService } from '../_services'

@Component({ templateUrl: 'detail.component.html' })
export class DetailComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  templates = null;
  
  constructor(private TemplateService : TemplateService) { }

  ngOnInit(): void {
  }

  onSubmit(){

  }
}
