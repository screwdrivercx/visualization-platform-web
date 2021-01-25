import { Injectable, NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class VgenService{
    constructor(
        private router: Router,
        private http: HttpClient){}

    generate(TemplateName,files){
        return this.http.post(`${environment.apiUrl}/api/vgenerate/${TemplateName}`, files);
    }
    
    getByRefId(refId):Observable<Blob>{
        return this.http.get(`${environment.apiUrl}/api/vgenerate/d3/${refId}`,{ responseType: 'blob' });
    }
}