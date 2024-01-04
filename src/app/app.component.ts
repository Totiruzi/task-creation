import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditTaskComponent } from './create-edit-task/create-edit-task.component';
import { TaskService } from './services/task.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  tasks: any[] = [];
  loginForm: FormGroup;
  isEdited: boolean = false;
  isAdmin: boolean = false;
  showLoginForm: boolean = false;

  displayedColumns: string[] = [
    'username',
    'email',
    'text',
    'status',
    'edited',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getTaskList();
  }

  getTaskList() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => {
        this.tasks = data.message.tasks;
        console.log("🚀 ~ file: app.component.ts:59 ~ AppComponent ~ this.taskService.getTasks ~ data.message.tasks:", data.message.tasks)

        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {},
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateTaskForm() {
    const dialogRef = this.dialog.open(CreateEditTaskComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTaskList();
        }
      },
    });
  }

  openEditTaskForm(data: any) {
    const dialogRef = this.dialog.open(CreateEditTaskComponent, {
      data: [{ ...data, originalData: data }],
    });
    dialogRef.componentInstance.id = data.id;

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.coreService.openSnackBar('Task Updated', 'done');
          this.getTaskList();
        }
      },
    });
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    if (this.showLoginForm) {
      setTimeout(() => {
        const usernameField = document.getElementById('username');
        if (usernameField) {
          usernameField.focus();
        }
      }, 0);
    }
  }

  onLogin() {
    const credentials = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.taskService.logAdminIn({credentials}).subscribe({
      next: (res) => {
        // Store the current time in local storage
        localStorage.setItem('login-time', Date.now().toString());
        this.isAdmin = true;
        this.loginForm.reset();
        this.showLoginForm = false;
      },
      error: (error) => {
        console.log(error)
      },
    });
    this.showLoginForm = false;
  }

  isAuthenticated(): boolean {
    const loginTime = Number(localStorage.getItem('login-time'));
    // Check if the login time exists and if more than 24 hours have passed since the login time
    if (loginTime && Date.now() - loginTime > 24 * 60 * 60 * 1000) {
      // More than 24 hours have passed, remove the token from local storage
      localStorage.removeItem('token');
      return false;
    }
    return !!localStorage.getItem('token');
  }

  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('login-time');
    this.isAdmin = false;
  }
}
