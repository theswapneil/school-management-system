import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="receipt-container">
      <div class="receipt-content" #receiptContent>
        <div class="receipt-header">
          <div class="school-logo">🏫</div>
          <h1>SCHOOL MANAGEMENT SYSTEM</h1>
          <p>Fee Receipt</p>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-section">
          <div class="section-title">Receipt Details</div>
          <div class="details-grid">
            <div class="detail-row">
              <span class="detail-label">Receipt No.:</span>
              <span class="detail-value">REC-{{ fee.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ today | date: 'MMM dd, yyyy' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Academic Year:</span>
              <span class="detail-value">{{ fee.academicYear }}</span>
            </div>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-section">
          <div class="section-title">Student Information</div>
          <div class="details-grid">
            <div class="detail-row">
              <span class="detail-label">Student Name:</span>
              <span class="detail-value">{{ student?.user?.firstName }} {{ student?.user?.lastName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registration No.:</span>
              <span class="detail-value">{{ student?.registrationNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ student?.user?.email }}</span>
            </div>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-section">
          <div class="section-title">Fee Information</div>
          <div class="fee-details">
            <table class="fee-table">
              <tr>
                <td class="label">Fee Type:</td>
                <td class="value">{{ fee.feeType | uppercase }}</td>
              </tr>
              <tr>
                <td class="label">Amount:</td>
                <td class="value amount">₹{{ fee.amount | number: '1.2-2' }}</td>
              </tr>
              <tr>
                <td class="label">Due Date:</td>
                <td class="value">{{ fee.dueDate | date: 'MMM dd, yyyy' }}</td>
              </tr>
              <tr *ngIf="fee.paidDate">
                <td class="label">Paid Date:</td>
                <td class="value">{{ fee.paidDate | date: 'MMM dd, yyyy' }}</td>
              </tr>
              <tr>
                <td class="label">Status:</td>
                <td class="value">
                  <span [ngClass]="'status-badge status-' + fee.status">
                    {{ fee.status | uppercase }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-section" *ngIf="fee.remarks">
          <div class="section-title">Remarks</div>
          <p class="remarks-text">{{ fee.remarks }}</p>
        </div>

        <div class="receipt-footer">
          <p>Thank you for your payment</p>
          <p class="small-text">This is an auto-generated receipt. Please keep it for your records.</p>
        </div>
      </div>

      <div class="receipt-actions">
        <button mat-raised-button color="primary" (click)="printReceipt()">
          <mat-icon>print</mat-icon>
          Print Receipt
        </button>
        <button mat-button (click)="dialogRef.close()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .receipt-container {
      padding: 20px;
    }

    .receipt-content {
      background: white;
      padding: 40px;
      border: 2px solid #333;
      margin-bottom: 20px;
      max-height: 700px;
      overflow-y: auto;
      font-family: Arial, sans-serif;
    }

    .receipt-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .school-logo {
      font-size: 48px;
      margin-bottom: 10px;
    }

    .receipt-header h1 {
      margin: 10px 0;
      font-size: 22px;
      color: #1976d2;
      font-weight: bold;
    }

    .receipt-header p {
      margin: 5px 0;
      font-size: 18px;
      color: #666;
    }

    .receipt-divider {
      border-top: 2px dashed #999;
      margin: 20px 0;
    }

    .receipt-section {
      margin-bottom: 15px;
    }

    .section-title {
      font-weight: bold;
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
      text-transform: uppercase;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      line-height: 1.8;
    }

    .detail-label {
      font-weight: 600;
      color: #555;
    }

    .detail-value {
      color: #333;
      text-align: right;
    }

    .fee-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .fee-table tr {
      border-bottom: 1px solid #eee;
    }

    .fee-table tr:last-child {
      border-bottom: none;
    }

    .fee-table td {
      padding: 8px 0;
    }

    .fee-table .label {
      font-weight: 600;
      color: #555;
    }

    .fee-table .value {
      text-align: right;
      color: #333;
    }

    .fee-table .amount {
      font-weight: bold;
      font-size: 16px;
      color: #1976d2;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
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

    .remarks-text {
      font-size: 13px;
      color: #555;
      line-height: 1.6;
    }

    .receipt-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px dashed #999;
      font-size: 12px;
      color: #666;
    }

    .receipt-footer p {
      margin: 5px 0;
    }

    .small-text {
      font-size: 10px;
      color: #999;
    }

    .receipt-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 20px 0;
      border-top: 1px solid #e0e0e0;
    }

    @media print {
      .receipt-actions {
        display: none;
      }

      .receipt-content {
        border: none;
        padding: 0;
        max-height: none;
        overflow: visible;
      }
    }
  `],
})
export class ReceiptComponent {
  today = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiptComponent>
  ) {}

  get fee() {
    return this.data.fee;
  }

  get student() {
    return this.data.student;
  }

  printReceipt(): void {
    window.print();
  }
}
