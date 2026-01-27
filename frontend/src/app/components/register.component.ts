import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Register to School Management System</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- First Name -->
            <mat-form-field class="full-width">
              <mat-label>First Name</mat-label>
              <input
                matInput
                formControlName="firstName"
                placeholder="Enter first name"
                [disabled]="isLoading()"
              />
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                First name is required
              </mat-error>
            </mat-form-field>

            <!-- Last Name -->
            <mat-form-field class="full-width">
              <mat-label>Last Name</mat-label>
              <input
                matInput
                formControlName="lastName"
                placeholder="Enter last name"
                [disabled]="isLoading()"
              />
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                Last name is required
              </mat-error>
            </mat-form-field>

            <!-- Email -->
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                formControlName="email"
                type="email"
                placeholder="Enter email"
                [disabled]="isLoading()"
              />
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <!-- Password -->
            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                formControlName="password"
                [type]="showPassword() ? 'text' : 'password'"
                placeholder="Enter password"
                [disabled]="isLoading()"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="showPassword.set(!showPassword())"
                type="button"
              >
                {{ showPassword() ? '🙈 Hide' : '👁️ Show' }}
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <!-- Role Selection -->
            <mat-form-field class="full-width">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" [disabled]="isLoading()">
                <mat-option value="student">Student</mat-option>
                <mat-option value="parent">Parent</mat-option>
                <mat-option value="teacher">Teacher</mat-option>
              </mat-select>
              <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                Role is required
              </mat-error>
            </mat-form-field>

            <!-- Register Button -->
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="register-button"
              [disabled]="isLoading() || registerForm.invalid"
            >
              <span *ngIf="!isLoading()">Register</span>
              <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
            </button>
          </form>

          <!-- Login Link -->
          <div class="login-section">
            <p>
              Already have an account?
              <a href="#" (click)="onLoginClick($event)" class="login-link">
                Login here
              </a>
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 450px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    }

    mat-card-header {
      margin-bottom: 30px;
      text-align: center;
    }

    mat-card-title {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    mat-card-subtitle {
      color: #999;
      font-size: 14px;
    }

    mat-card-content {
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .full-width {
      width: 100%;
    }

    .register-button {
      height: 45px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-section {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .login-section p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .login-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link:hover {
      text-decoration: underline;
    }

    mat-spinner {
      margin: 0 auto;
    }
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { email, password, firstName, lastName, role } = this.registerForm.value;

    this.authService.register(email, password, firstName, lastName, role).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.snackBar.open(`Welcome, ${response.user.firstName}!`, 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        console.error('Registration error:', error);
      },
    });
  }

  onLoginClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
