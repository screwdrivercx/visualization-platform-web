import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-api-th',
  templateUrl: './api-th.component.html',
  styleUrls: ['./api-th.component.css']
})
export class ApiThComponent implements OnInit {

  constructor(private router : Router) { }

  handleChange(){
    this.router.navigate(['/api']);
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  ngOnInit(): void {
  }

}
