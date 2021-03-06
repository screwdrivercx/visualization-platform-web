import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiComponent } from './api/api.component';
import { ApiThComponent } from './api-th/api-th.component';
import { HomeComponent } from './home';
import { MainComponent } from './main/main.component';
import { TutorialThComponent } from './tutorial-th/tutorial-th.component'
import { AuthGuard } from './_helpers';
import { LogsComponent } from './logs/logs.component';


const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/user.module').then(x => x.UsersModule);
const generateModule = () => import('./generate/generate.module').then(x => x.GenerateModule);
const templatesModule = () => import('./templates/template.module').then(x => x.TemplatesModule);
const tutorialModule = () => import('./tutorial/tutorial.module').then(x => x.TutorialModule);
const announcementModule = () => import('./announcement/announcement.module').then(x => x.AnnouncementModule)

const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'tutorial', loadChildren: tutorialModule },
    { path: 'tutorial-th', component: TutorialThComponent },
    { path: 'api', component: ApiComponent },
    { path: 'api-th', component: ApiThComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data:{ role: ['user','designer','admin','superadmin']} },
    { path: 'generate', loadChildren: generateModule, canActivate: [AuthGuard], data:{role : ['user','designer']} },
    { path: 'templates', loadChildren: templatesModule, canActivate: [AuthGuard], data:{role : 'designer'} },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard], data: {role: ['admin','superadmin']} },
    { path: 'logs' , component: LogsComponent, canActivate : [AuthGuard], data: {role : ['admin','superadmin']}},
    { path: 'account', loadChildren: accountModule },
    { path: 'announcement', loadChildren: announcementModule, canActivate: [AuthGuard], data: {role: ['user','designer']} },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
