import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs'; // Importa 'of'
import { authGuard } from './auth.guard';
import { AuthService } from '../app/auth/data-access/auth.service'; // Importa tu AuthService

describe('authGuard', () => {
  let executeGuard: CanActivateFn;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Importa RouterTestingModule
      providers: [
        {
          provide: AuthService,
          useValue: { // Mock del AuthService
            user$: of(null), // Inicialmente, simula que no hay usuario
          },
        },
      ],
    });

    executeGuard = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should not allow access when user is not authenticated', () => {
    spyOn(router, 'navigate'); // Espía el método navigate del router

    expect(executeGuard(null, { url: '/protected' } as any)).toBeFalsy(); // Simula acceso a ruta protegida
    expect(router.navigate).toHaveBeenCalledWith(['/index']); // Verifica que se redirige al login
  });

  it('should allow access when user is authenticated', () => {
    authService.user$ = of({ uid: '123' } as any); // Simula usuario autenticado (con uid)

    expect(executeGuard(null, { url: '/protected' } as any)).toBeTruthy(); // Simula acceso a ruta protegida
  });

  it('should allow access to login route', () => {
      expect(executeGuard(null, { url: '/index' } as any)).toBeTruthy();
  });
});