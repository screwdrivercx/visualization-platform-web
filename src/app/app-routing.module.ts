import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiComponent } from './api/api.component';
import { HomeComponent } from './home';
import { MainComponent } from './main/main.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/user.module').then(x => x.UsersModule);
const generateModule = () => import('./generate/generate.module').then(x => x.GenerateModule);

const routes: Routes = [
    { path: '', component: MainComponent},
    { path: 'tutorial', component: TutorialComponent},
    { path: 'api', component: ApiComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'generate', loadChildren: generateModule, canActivate: [AuthGuard], data:{role : ['user','designer']}},
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard], data: {role: 'admin'}},
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }