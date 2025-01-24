import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RegistrationComponent } from './registration/registration.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'register', component: RegistrationComponent }
    ]
  }
];