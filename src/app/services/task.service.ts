import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  api = 'https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Chris';
  token!: string;
  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      this.token = localStorage.getItem('token') || '';
    }

   }

  getTasks(): Observable<any> {
    return this.http.get(this.api)
  }

  addTask(data: { taskData: any }): Observable<any> {
    const formData = new FormData();
    Object.keys(data.taskData).forEach((key) => {
      formData.append(key, data.taskData[key]);
  });
    return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Chris', formData);
  }

  logAdminIn(data: { credentials: any }): Observable<any> {
    const formData = new FormData();
    Object.keys(data.credentials).forEach((key) => {
      formData.append(key, data.credentials[key]);
  });
    return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Chris', formData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  updateTask(id: number, data:{taskData: any}): Observable<any> {
    const formData = new FormData();
    Object.keys(data.taskData).forEach((key) => {
      formData.append(key, data.taskData[key]);
  });
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const token = localStorage.getItem('token') as string;
    formData.append('token', token);
  }

    return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/create/?developer=Chris', formData)
  }

}
