import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  api = 'https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Chris'
  tasks: [] = [];
  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get(this.api)
  }

  addTask(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Chris', data, { headers})
  }
}