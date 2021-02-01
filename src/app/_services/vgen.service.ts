import { Injectable, NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { config, Observable } from "rxjs";
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class VgenService{
    constructor(
        private router: Router,
        private http: HttpClient,
        private accountService : AccountService){}

    generate(TemplateName,formData){
        return this.http.post(`${environment.apiUrl}/api/vgenerate/${TemplateName}`, formData);
    }
    
    getAll(){
        return this.http.get(`${environment.apiUrl}/api/vgenerate/d3`);
    }

    getByRefId(refId):Observable<Blob>{
        return this.http.get(`${environment.apiUrl}/api/vgenerate/d3/${refId}`,{ responseType: 'blob' });
    }

    getPptUrl(refId){
        let user = this.accountService.userValue;
        return `${environment.apiUrl}/api/vgenerate/d3/ppt/q?token=${user.token}&refId=${refId}`;
    }

    getPreconfig(refId){
        return this.http.get(`${environment.apiUrl}/api/vgenerate/preconfig/${refId}`);
    }

    update(refId,vname,formData){
        return this.http.put(`${environment.apiUrl}/api/vgenerate/${refId}/${vname}`, formData)
    }
}