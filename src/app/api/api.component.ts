import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {

  constructor(private router : Router) { }

  handleChange(){
    this.router.navigate(['/api-th']);
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }


  ngOnInit(): void {
  }

}
