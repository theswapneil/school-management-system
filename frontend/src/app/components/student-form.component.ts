import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService, Student } from '../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<StudentFormComponent>);
  data = inject(MAT_DIALOG_DATA);

  studentForm!: FormGroup;
  isEdit = false;

  ngOnInit(): void {
    this.initializeForm();
    if (this.data && this.data.student) {
      this.isEdit = true;
      this.studentForm.patchValue(this.data.student);
    }
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registrationNumber: ['', Validators.required],
      dateOfBirth: [''],
      classId: ['', Validators.required],
      status: ['active'],
      phone: [''],
      address: [''],
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    const formData = this.studentForm.value;

    if (this.isEdit) {
      this.studentService.updateStudent(this.data.student.id, formData).subscribe({
        next: () => {
          this.snackBar.open('Student updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error updating student', 'Close', { duration: 3000 });
          console.error('Error:', error);
        },
      });
    } else {
      this.studentService.createStudent(formData).subscribe({
        next: () => {
          this.snackBar.open('Student added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error adding student', 'Close', { duration: 3000 });
          console.error('Error:', error);
        },
      });
    }
  }
}
