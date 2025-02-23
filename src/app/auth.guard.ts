import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../app/auth/data-access/auth.service'; // Importa tu servicio de autenticación
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      map(user => !!user),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/index']); // Redirige al login
        }
      }),
      take(1)
    );
  }
}