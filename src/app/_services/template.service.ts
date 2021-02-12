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

    getById(id){
        return this.http.get(`${environment.apiUrl}/api/manageTemplate/${id}`);
    }

    create(formData){
        return this.http.post(`${environment.apiUrl}/api/manageTemplate`, formData);
    }

    update(formData){
        return this.http.put(`${environment.apiUrl}/api/manageTemplate`, formData);
    }

    delete(id){
        return this.http.delete(`${environment.apiUrl}/api/manageTemplate/${id}`)
    }
}