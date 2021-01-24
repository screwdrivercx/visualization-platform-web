import { Injectable, NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VgenService{
    constructor(
        private router: Router,
        private http: HttpClient){}

    generate(TemplateName,files){
        return this.http.post(`${environment.apiUrl}/api/vgenerate/${TemplateName}`, files);
    }
    
}