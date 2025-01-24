import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'landing', loadChildren: () => import('./landing/landing.routes').then(m => m.LANDING_ROUTES)},
    
];
