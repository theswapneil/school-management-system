import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService, Student } from '../services/student.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Students List</h1>
        <button mat-raised-button color="primary" *ngIf="canCreateStudent()">
          Add New Student
        </button>
      </div>

      <mat-card class="table-container">
        <mat-spinner *ngIf="isLoading()" diameter="50"></mat-spinner>

        <table mat-table [dataSource]="students()" class="student-table" *ngIf="!isLoading()">
          <!-- Registration Number Column -->
          <ng-container matColumnDef="registrationNumber">
            <th mat-header-cell *matHeaderCellDef>Registration #</th>
            <td mat-cell *matCellDef="let element">{{ element.registrationNumber }}</td>
          </ng-container>

          <!-- Student Name Column -->
          <ng-container matColumnDef="studentName">
            <th mat-header-cell *matHeaderCellDef>Student Name</th>
            <td mat-cell *matCellDef="let element">
              {{ element.user?.firstName }} {{ element.user?.lastName }}
            </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">{{ element.user?.email }}</td>
          </ng-container>

          <!-- Class Column -->
          <ng-container matColumnDef="class">
            <th mat-header-cell *matHeaderCellDef>Class</th>
            <td mat-cell *matCellDef="let element">
              {{ element.class?.name }} ({{ element.class?.grade }})
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element">
              <span [ngClass]="'status-' + element.status">
                {{ element.status | titlecase }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <button
                mat-icon-button
                [disabled]="!canEditStudent()"
                (click)="editStudent(element.id)"
              >
                Edit
              </button>
              <button
                mat-icon-button
                color="warn"
                [disabled]="!canDeleteStudent()"
                (click)="deleteStudent(element.id)"
              >
                Delete
              </button>
            </td>
          </ng-container>

          <!-- Table -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <div class="no-data" *ngIf="!isLoading() && students().length === 0">
          <p>No students found.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: `
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-container {
      padding: 20px;
      position: relative;
      min-height: 400px;
    }

    .student-table {
      width: 100%;
      border-collapse: collapse;
    }

    .student-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      padding: 12px;
      text-align: left;
    }

    .student-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .status-active {
      color: green;
      font-weight: 600;
    }

    .status-inactive {
      color: orange;
      font-weight: 600;
    }

    .status-graduated {
      color: blue;
      font-weight: 600;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    mat-spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  `,
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  students = signal<Student[]>([]);
  isLoading = signal(false);
  displayedColumns = ['registrationNumber', 'studentName', 'email', 'class', 'status', 'actions'];

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading.set(true);
    this.studentService.getStudents().subscribe({
      next: (response) => {
        this.students.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Error loading students', 'Close', { duration: 3000 });
        console.error('Error:', error);
        this.isLoading.set(false);
      },
    });
  }

  editStudent(id: number): void {
    // Navigate to edit page
    console.log('Edit student:', id);
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 });
          this.loadStudents();
        },
        error: (error) => {
          this.snackBar.open('Error deleting student', 'Close', { duration: 3000 });
          console.error('Error:', error);
        },
      });
    }
  }

  canCreateStudent(): boolean {
    return this.authService.hasRole('admin');
  }

  canEditStudent(): boolean {
    return this.authService.hasRole(['admin', 'teacher']);
  }

  canDeleteStudent(): boolean {
    return this.authService.hasRole('admin');
  }
}
