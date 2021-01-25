import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { GenerateComponent } from './generate.component';
import { GenerateRoutingModule } from './generate-routing.module'
import { DetailComponent } from './detail.component';
import { ResultComponent } from './result.component'

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GenerateRoutingModule
    ],
    declarations: [
        LayoutComponent,
        GenerateComponent,
        DetailComponent,
        ResultComponent
    ]
})
export class GenerateModule { }