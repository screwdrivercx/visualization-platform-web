import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { TutorialComponent } from './tutorial.component';
import { TemplateComponent } from './template.component'

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: TutorialComponent },
            { path: 'details/:id', component: TemplateComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TutorialRoutingModule { }