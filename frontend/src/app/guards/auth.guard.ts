import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      // Check if route requires specific roles
      // const requiredRoles = route.data['roles'] as string[];
      // if (requiredRoles && !this.authService.hasRole(requiredRoles)) {
      //   this.router.navigate(['/dashboard']);
      //   return false;
      // }
      return true;
    }

    // Store the attempted URL for redirecting after login
    sessionStorage.setItem('redirectUrl', state.url);
    this.router.navigate(['/login']);
    return false;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const guard = inject(AuthGuard);
  return guard.canActivate(route, state);
};
