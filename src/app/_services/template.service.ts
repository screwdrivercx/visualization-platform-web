import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TemplateService {
    constructor(
        private router: Router,
        private http: HttpClient
    ){

    }

    getAll(){
        return this.http.get(`${environment.apiUrl}/api/manageTemplate/getAll`);
    }
}