import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { TemplateListComponent } from './templateList.component'

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: TemplateListComponent },
            { path: 'add', component: AddEditComponent },
            { path: 'edit/:id', component: AddEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplatesRoutingModule { }