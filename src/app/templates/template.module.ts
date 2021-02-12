import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { TemplateListComponent } from './templateList.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TemplatesRoutingModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        LayoutComponent,
        TemplateListComponent,
        AddEditComponent
    ]
})
export class TemplatesModule { }