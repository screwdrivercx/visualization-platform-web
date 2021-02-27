import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VgenService } from '../_services';

@Component({ templateUrl: 'result.component.html' })
export class ResultComponent implements OnInit {
    loading = false;
    file: File;
    tryDoctype: any;
    pptUrl: string;
    refId: String;
    apiUrl = environment.apiUrl;

    constructor(
        private actRoute: ActivatedRoute,
        private vgenService: VgenService,
        private sanitizer: DomSanitizer
    ) { }

    public blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;

        //Cast to a File() type
        return <File>theBlob;
    }

    ngOnInit(): void {
        this.refId = this.actRoute.snapshot.params.refId;

        this.pptUrl = this.vgenService.getPptUrl(this.refId);
        //this.src = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.apiUrl}/api/vgenerate/d3/${this.actRoute.snapshot.params.refId}`);
        this.vgenService.getByRefId(this.refId)
            .subscribe(src => {
                this.file = this.blobToFile(src, "tmp.html");
                let fileUrl = URL.createObjectURL(this.file);
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
            })

    }

    onSubmit() {
    }
}

