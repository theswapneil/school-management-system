import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { DashboardComponent } from './components/dashboard.component';
import { StudentListComponent } from './components/student-list.component';
import { FeesComponent } from './components/fees.component';
import { Routes } from '@angular/router';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: StudentListComponent },
      { path: 'students', component: StudentListComponent, data: { roles: ['admin', 'teacher'] } },
      { path: 'fees', component: FeesComponent, data: { roles: ['admin', 'teacher', 'parent'] } },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideExperimentalZonelessChangeDetection(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
