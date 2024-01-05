import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { IAdmin, ITask } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  api = 'https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Chris';
  token!: string;
  tasks: any[] = [];

  setTasks(tasks: any[]) {
    tasks = tasks
  }
  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      this.token = localStorage.getItem('token') || '';
    }

   }

  getTasks(): Observable<ITask> {
    return this.http.get<ITask>(this.api)
  }

  addTask(data: { taskData: ITask }): Observable<ITask> {
    const formData = new FormData();
    Object.keys(data.taskData).forEach((key) => {
      formData.append(key, data.taskData[key]);
  });
    return this.http.post<ITask>('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Chris', formData);
  }

  logAdminIn(data: { credentials: IAdmin }): Observable<IAdmin> {
    const formData = new FormData();
    Object.keys(data.credentials).forEach((key) => {
      formData.append(key, data.credentials[key]);
  });
    return this.http.post('https://uxcandy.com/~shapoval/test-task-backend/v2/login/?developer=Chris', formData).pipe(
      tap((response: any) => {
        if (response.message.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  updateTask(id: number, data:{taskData: ITask}): Observable<ITask> {
    const formData = new FormData();
    Object.keys(data.taskData).forEach((key) => {
    formData.append(key, data.taskData[key]);
    });
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const token = localStorage.getItem('token') as string;
    if (!token) {
     return EMPTY; // Returns an Observable that immediately completes without emitting any values
    }
    formData.append('token', token); // Append the token as a POST parameter
    return this.http.post(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${id}?developer=Chris`, formData).pipe(
      map((updatedTask: any) => {
        // Update the lastUpdated property of the task
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].lastUpdated = Date.now();
          // Replace the old task with the updated task
          this.tasks[taskIndex] = updatedTask;
          console.log("🚀 ~ file: task.service.ts:68 ~ TaskService ~ map ~ updated Task:", updatedTask)
        }
        return updatedTask;
      })
    );
    }
    return EMPTY; // Returns an Observable that immediately completes without emitting any values
   }

}
