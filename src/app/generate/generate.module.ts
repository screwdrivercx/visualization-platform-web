import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { GenerateComponent } from './generate.component';
import { GenerateRoutingModule } from './generate-routing.module'
import { ResultComponent } from './result.component'
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GenerateRoutingModule,
        MatStepperModule,
        MatButtonModule,
        MatIconModule,
        ClipboardModule
    ],
    declarations: [
        LayoutComponent,
        GenerateComponent,
        ResultComponent
    ]
})
export class GenerateModule { }