import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { GenerateComponent } from './generate.component';
import { ResultComponent } from './result.component'

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: GenerateComponent },
            { path: 'edit/:refId', component: GenerateComponent },
            { path: 'result/:refId', component: ResultComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenerateRoutingModule { }