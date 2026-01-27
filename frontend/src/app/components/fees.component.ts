import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentService, Student } from '../services/student.service';
import { ReceiptComponent } from './receipt.component';

export interface FeeTransaction {
  id?: string;
  studentId: number;
  academicYear: string;
  feeType: string;
  amount: number;
  status: 'pending' | 'partial' | 'paid';
  dueDate: string;
  paidDate?: string;
  remarks?: string;
}

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="fees-container">
      <div class="header-section">
        <h1>Fee Management</h1>
        <p>Manage student fee records and track payment status</p>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Add Fee Record</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="feeForm" class="fee-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Select Student</mat-label>
                <mat-select formControlName="studentId" required>
                  <mat-option value="">Choose a student</mat-option>
                  <mat-option *ngFor="let student of students()" [value]="student.id">
                    {{ student.user?.firstName }} {{ student.user?.lastName }} ({{ student.registrationNumber }})
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="feeForm.get('studentId')?.hasError('required')">
                  Student is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Academic Year</mat-label>
                <input matInput formControlName="academicYear" placeholder="2024-2025" required />
                <mat-error *ngIf="feeForm.get('academicYear')?.hasError('required')">
                  Academic year is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Fee Type</mat-label>
                <mat-select formControlName="feeType" required>
                  <mat-option value="">Select fee type</mat-option>
                  <mat-option value="tuition">Tuition Fee</mat-option>
                  <mat-option value="exam">Exam Fee</mat-option>
                  <mat-option value="sports">Sports Fee</mat-option>
                  <mat-option value="transport">Transport Fee</mat-option>
                  <mat-option value="misc">Miscellaneous</mat-option>
                </mat-select>
                <mat-error *ngIf="feeForm.get('feeType')?.hasError('required')">
                  Fee type is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Amount</mat-label>
                <input matInput formControlName="amount" type="number" min="0" required />
                <mat-error *ngIf="feeForm.get('amount')?.hasError('required')">
                  Amount is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="pending">Pending</mat-option>
                  <mat-option value="partial">Partial</mat-option>
                  <mat-option value="paid">Paid</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Due Date</mat-label>
                <input matInput formControlName="dueDate" type="date" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Remarks</mat-label>
              <textarea matInput formControlName="remarks" rows="2"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                (click)="onSubmit()"
                [disabled]="feeForm.invalid || isLoading()"
              >
                <mat-icon *ngIf="!isLoading()">add</mat-icon>
                <span *ngIf="!isLoading()">Add Fee Record</span>
                <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Fee Records</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="feeTransactions().length === 0" class="no-data">
            <mat-icon>receipt</mat-icon>
            <p>No fee records found</p>
          </div>

          <table mat-table [dataSource]="feeTransactions()" *ngIf="feeTransactions().length > 0" class="fees-table">
            <!-- Student Name Column -->
            <ng-container matColumnDef="studentName">
              <th mat-header-cell *matHeaderCellDef>Student Name</th>
              <td mat-cell *matCellDef="let element">{{ getStudentName(element.studentId) }}</td>
            </ng-container>

            <!-- Fee Type Column -->
            <ng-container matColumnDef="feeType">
              <th mat-header-cell *matHeaderCellDef>Fee Type</th>
              <td mat-cell *matCellDef="let element">{{ element.feeType }}</td>
            </ng-container>

            <!-- Amount Column -->
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let element">₹{{ element.amount }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let element">
                <span [ngClass]="'status-badge status-' + element.status">
                  {{ element.status | uppercase }}
                </span>
              </td>
            </ng-container>

            <!-- Due Date Column -->
            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef>Due Date</th>
              <td mat-cell *matCellDef="let element">
                {{ element.dueDate | date: 'MMM dd, yyyy' }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button (click)="printReceipt(element)" matTooltip="Print Receipt">
                  <mat-icon>print</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteRecord(element.id)" matTooltip="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .fees-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    .header-section {
      margin-bottom: 30px;
      color: #1976d2;
    }

    .header-section h1 {
      font-size: 32px;
      margin: 0 0 10px 0;
    }

    .header-section p {
      font-size: 16px;
      color: #666;
      margin: 0;
    }

    .form-card {
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    mat-card-title {
      font-size: 20px;
      color: #333;
    }

    .fee-form {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .form-field {
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      margin-top: 20px;
    }

    .table-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .fees-table {
      width: 100%;
    }

    .fees-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .fees-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-partial {
      background-color: #cfe2ff;
      color: #084298;
    }

    .status-paid {
      background-color: #d1e7dd;
      color: #0a3622;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #999;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 10px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `],
})
export class FeesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  feeForm!: FormGroup;
  students = signal<Student[]>([]);
  feeTransactions = signal<FeeTransaction[]>([]);
  isLoading = signal(false);
  displayedColumns = ['studentName', 'feeType', 'amount', 'status', 'dueDate', 'actions'];

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudents();
    this.loadFeeTransactions();
  }

  initializeForm(): void {
    this.feeForm = this.fb.group({
      studentId: ['', Validators.required],
      academicYear: [new Date().getFullYear() + '-' + (new Date().getFullYear() + 1), Validators.required],
      feeType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['pending'],
      dueDate: ['', Validators.required],
      remarks: [''],
    });
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (response) => {
        this.students.set(response.data || []);
      },
      error: (error) => {
        console.error('Error loading students:', error);
      },
    });
  }

  loadFeeTransactions(): void {
    // This would load from an API endpoint
    // For now, using sample data
    const sampleFees: FeeTransaction[] = [
      {
        id: '1',
        studentId: 1,
        academicYear: '2024-2025',
        feeType: 'tuition',
        amount: 50000,
        status: 'paid',
        dueDate: '2024-06-30',
        paidDate: '2024-06-25',
      },
      {
        id: '2',
        studentId: 2,
        academicYear: '2024-2025',
        feeType: 'exam',
        amount: 5000,
        status: 'pending',
        dueDate: '2024-07-15',
      },
    ];
    this.feeTransactions.set(sampleFees);
  }

  getStudentName(studentId: string | number): string {
    const student = this.students().find((s) => s.id == studentId);
    return student ? `${student.user?.firstName} ${student.user?.lastName}` : 'Unknown';
  }

  onSubmit(): void {
    if (this.feeForm.invalid) return;

    this.isLoading.set(true);
    const formData = this.feeForm.value;

    // Add fee transaction (would call API in production)
    const newFee: FeeTransaction = {
      id: Date.now().toString(),
      ...formData,
      paidDate: formData.status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
    };

    const currentFees = this.feeTransactions();
    this.feeTransactions.set([...currentFees, newFee]);

    setTimeout(() => {
      this.snackBar.open('Fee record added successfully', 'Close', { duration: 3000 });
      this.feeForm.reset({
        academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        status: 'pending',
      });
      this.isLoading.set(false);

      // Open receipt for printing if paid
      if (formData.status === 'paid') {
        this.printReceipt(newFee);
      }
    }, 500);
  }

  printReceipt(fee: FeeTransaction): void {
    const student = this.students().find((s) => s.id == fee.studentId);
    this.dialog.open(ReceiptComponent, {
      width: '800px',
      data: {
        fee,
        student,
      },
    });
  }

  deleteRecord(id?: string): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this record?')) {
      const updated = this.feeTransactions().filter((f) => f.id !== id);
      this.feeTransactions.set(updated);
      this.snackBar.open('Record deleted successfully', 'Close', { duration: 3000 });
    }
  }
}
