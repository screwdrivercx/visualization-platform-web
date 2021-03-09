import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularEditorModule } from '@kolkov/angular-editor'
import { AnnouncementComponent } from './announcement.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AnnouncementRoutingModule,
        MatButtonModule,
        MatIconModule,
        AngularEditorModule,
        MDBBootstrapModule
    ],
    declarations: [
        LayoutComponent,
        AnnouncementComponent,
        AddEditComponent
    ]
})
export class AnnouncementModule { }