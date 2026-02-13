import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Class {
  _id: string;
  name: string;
  section?: string;
  grade: string;
  classTeacherId?: string;
  academicYear?: string;
  capacity?: number;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/classes';

  getClasses(): Observable<ApiResponse<Class[]>> {
    return this.http.get<ApiResponse<Class[]>>(this.apiUrl);
  }

  getClassById(id: string): Observable<ApiResponse<Class>> {
    return this.http.get<ApiResponse<Class>>(`${this.apiUrl}/${id}`);
  }

  createClass(classData: Omit<Class, '_id'>): Observable<ApiResponse<Class>> {
    return this.http.post<ApiResponse<Class>>(this.apiUrl, classData);
  }

  updateClass(id: string, classData: Partial<Class>): Observable<ApiResponse<Class>> {
    return this.http.patch<ApiResponse<Class>>(`${this.apiUrl}/${id}`, classData);
  }

  deleteClass(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
