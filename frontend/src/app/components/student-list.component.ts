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
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
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
