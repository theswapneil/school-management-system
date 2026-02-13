import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  userId: number;
  registrationNumber: string;
  classId: number;
  parentId: number;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  class?: {
    id: number;
    name: string;
    grade: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/students';

  getStudents(filters?: { status?: string; classId?: number }): Observable<ApiResponse<Student[]>> {
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.classId) {
      params = params.set('classId', filters.classId.toString());
    }

    return this.http.get<ApiResponse<Student[]>>(this.apiUrl, { params });
  }

  getStudentById(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Omit<Student, 'id'>): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(this.apiUrl, student);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.http.patch<ApiResponse<Student>>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  checkEmailExists(email: string): Observable<ApiResponse<{ exists: boolean }>> {
    return this.http.post<ApiResponse<{ exists: boolean }>>(`${this.apiUrl}/check-email`, { email });
  }
}
