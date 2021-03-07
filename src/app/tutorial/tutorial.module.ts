import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { TutorialRoutingModule } from './tutorial-routing.module'
import { TutorialComponent } from './tutorial.component';
import { TemplateComponent } from './template.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TutorialRoutingModule
    ],
    declarations: [
        LayoutComponent,
        TutorialComponent,
        TemplateComponent
    ]
})
export class TutorialModule { }