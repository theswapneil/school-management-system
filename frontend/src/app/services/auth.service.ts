import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/auth';

  // Use signals for state management
  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<AuthUser | null>(this.getStoredUser());

  // Computed signals for UI state
  isLoggedIn = computed(() => this.tokenSignal() !== null);
  currentUser = computed(() => this.userSignal());
  userRole = computed(() => this.userSignal()?.role || null);

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token) this.tokenSignal.set(token);
    if (user) this.userSignal.set(JSON.parse(user));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUser(response.user);
      })
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, {
        email,
        password,
        firstName,
        lastName,
        role,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
        })
      );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setToken(token: string): void {
    this.tokenSignal.set(token);
    localStorage.setItem('auth_token', token);
  }

  private setUser(user: AuthUser): void {
    this.userSignal.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getStoredUser(): AuthUser | null {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }

  hasRole(role: string | string[]): boolean {
    const userRole = this.userRole();
    if (!userRole) return false;
    if (typeof role === 'string') return userRole === role;
    return role.includes(userRole);
  }
}
