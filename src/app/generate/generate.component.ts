import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){

  }
}
