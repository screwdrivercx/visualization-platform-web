import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
    constructor(
        private router: Router,
        private http: HttpClient
    ){

    }

    getAll(){
        return this.http.get(`${environment.apiUrl}/api/announcement/getAll`);
    }

    getLatest(){
        return this.http.get(`${environment.apiUrl}/api/announcement/latest`);
    }

    getById(id){
        return this.http.get(`${environment.apiUrl}/api/announcement/id/${id}`);
    }

    create(params){
        return this.http.post(`${environment.apiUrl}/api/announcement`, params);
    }

    update(id, params){
        return this.http.put(`${environment.apiUrl}/api/announcement/${id}`, params);
    }


    delete(id){
        return this.http.delete(`${environment.apiUrl}/api/announcement/${id}`)
    }
}