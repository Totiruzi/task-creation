import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  api = 'https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Chris'
  apiDbJson = 'http://localhost:3000/tasks'
  tasks: [] = [];
  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    // return this.http.get(this.api)
    return this.http.get(this.apiDbJson)
  }

  addTask(data: any): Observable<any> {
    const taskData = {
      ...data,
      isEdited: false
    }
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    // return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Chris', data, { headers})
    return this.http.post(this.apiDbJson, taskData)
  }

  logAdminIn(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Chris', data, { headers})
    // return this.http.post(this.apiDbJson, data)
  }

  updateTask(id: number, data: any): Observable<any> {
    const taskData = {
      ...data,
      isEdited: true
    }
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    // return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Chris', data, { headers})
    return this.http.put(`${this.apiDbJson}/${id}`, taskData)
  }

}
