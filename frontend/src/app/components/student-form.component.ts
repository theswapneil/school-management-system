import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService, Student } from '../services/student.service';
import { ClassService, Class } from '../services/class.service';
import { AuthService } from '../services/auth.service';

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
  private classService = inject(ClassService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<StudentFormComponent>);
  data = inject(MAT_DIALOG_DATA);

  studentForm!: FormGroup;
  isEdit = false;
  classes = signal<Class[]>([]);
  emailCheckInProgress = false;

  ngOnInit(): void {
    this.loadClasses();
    this.initializeForm();
    if (this.data && this.data.student) {
      this.isEdit = true;
      this.studentForm.patchValue(this.data.student);
    }
  }

  loadClasses(): void {
    this.classService.getClasses().subscribe({
      next: (response) => {
        console.log('response.data', response.data);
        this.classes.set(response.data || []);
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.snackBar.open('Error loading classes', 'Close', { duration: 3000 });
      },
    });
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      registrationNumber: ['', Validators.required],
      dateOfBirth: [''],
      classId: ['', Validators.required],
      status: ['active'],
      phone: [''],
      address: [''],
      createdById: [this.authService.currentUser()?.id || ''],
    });
  }

  checkEmailExists(): void {
    const emailControl = this.studentForm.get('email');
    if (!emailControl || !emailControl.value || emailControl.hasError('email')) {
      return;
    }

    // Don't check if we're editing and the email hasn't changed
    if (this.isEdit && emailControl.value === this.data?.student?.user?.email) {
      return;
    }

    this.emailCheckInProgress = true;
    this.studentService.checkEmailExists(emailControl.value).subscribe({
      next: (response) => {
        this.emailCheckInProgress = false;
        if (response.data?.exists) {
          emailControl.setErrors({ 'emailExists': true });
        } else {
          // Clear the emailExists error if it exists, but keep other errors
          if (emailControl.hasError('emailExists')) {
            const errors = emailControl.errors;
            delete errors?.['emailExists'];
            if (Object.keys(errors || {}).length > 0) {
              emailControl.setErrors(errors);
            } else {
              emailControl.setErrors(null);
            }
          }
        }
      },
      error: (error) => {
        this.emailCheckInProgress = false;
        console.error('Error checking email:', error);
      },
    });
  }

  onSubmit(): void {
    console.log('Submitting form', this.studentForm.value);
    if (this.studentForm.invalid) return;

    const formData = this.studentForm.value;

    // Get userId from authenticated user
    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.id) {
      this.snackBar.open('User not authenticated', 'Close', { duration: 3000 });
      return;
    }

    // Add userId to formData
    const studentData = {
      ...formData,
      createdById: currentUser.id,
    };

    if (this.isEdit) {
      // When editing, remove password field and send only updated data
      const { password, ...updateData } = studentData;
      this.studentService.updateStudent(this.data.student.id, updateData).subscribe({
        next: () => {
          this.snackBar.open('Student updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error updating student: ' + (error.error?.message || error.message), 'Close', { duration: 5000 });
          console.error('Error:', error);
        },
      });
    } else {
      // When creating new student, backend will create user account and student record
      // Send all data including password, email, firstName, lastName
      this.studentService.createStudent(studentData).subscribe({
        next: () => {
          this.snackBar.open('Student added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error adding student: ' + (error.error?.message || error.message), 'Close', { duration: 5000 });
          console.error('Error:', error);
        },
      });
    }
  }
}
