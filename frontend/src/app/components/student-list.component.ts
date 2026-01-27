import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StudentService, Student } from '../services/student.service';
import { AuthService } from '../services/auth.service';
import { StudentFormComponent } from './student-form.component';

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
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  students = signal<Student[]>([]);
  isLoading = signal(false);
  displayedColumns = ['registrationNumber', 'studentName', 'email', 'class', 'status', 'actions'];
  userRole = this.authService.userRole;

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

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '600px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  openEditStudentDialog(student: Student): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '600px',
      disableClose: false,
      data: { student },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  deleteStudent(student: Student): void {
    if (confirm(`Are you sure you want to delete ${student.user?.firstName} ${student.user?.lastName}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'graduated':
        return 'info';
      default:
        return '';
    }
  }

  isAdminOrTeacher(): boolean {
    const role = this.userRole();
    return role === 'admin' || role === 'teacher';
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
