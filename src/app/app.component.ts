import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditTaskComponent } from './create-edit-task/create-edit-task.component';
import { TaskService } from './services/task.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ITask } from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  initialTaskLists: any[] = [];
  tasks: ITask[] = [];
  loginForm: FormGroup;
  isEdited: boolean = false;
  isAdmin: boolean = false;
  showLoginForm: boolean = false;
  tasks$: BehaviorSubject<ITask[]> = new BehaviorSubject<any[]>([]);
  totalTasks: number = 0;

  displayedColumns: string[] = [
    'username',
    'email',
    'text',
    // 'status',
    // 'state',
    'completed',
    // 'edited',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.isAuthenticated();
    this.getTaskList();
  }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;

    this.paginator.page.subscribe((pageEvent) => {
      // if (this.paginator) {
        //  }
        // Call getTaskList with the new page index
        this.getTaskList(pageEvent.pageIndex + 1);
      });
    this.dataSource.paginator = this.paginator;

    this.usernameInput.nativeElement.focus();
  }

  getTaskList(page: number = 1) {
    this.taskService.getTasks(page).subscribe({
      next: (data: any) => {
        this.tasks = data.message.tasks;
        this.totalTasks = parseInt(data.message.total_task_count, 10);

        // Retrieve the state of all checkboxes from the local storage
        const checkboxes = JSON.parse(
          localStorage.getItem('checkboxes') || '[]'
        );
        this.tasks = this.tasks.map((task) => {
          const checkbox = checkboxes.find(
            (cb: CheckboxState) => cb.id === task.id
          );
          return checkbox ? { ...task, completed: checkbox.completed } : task;
        });

        // Add a lastUpdated property to each task
        this.taskService.setTasks(this.tasks);
        this.initialTaskLists = [...this.tasks];
        this.tasks$.next(this.tasks);

        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        // Update the MatPaginator
        this.paginator.length = this.totalTasks;
        this.paginator.pageIndex = page - 1;
        // setTimeout(() => {
        //   this.paginator.pageIndex = page - 1;
        // }, 0);
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
    const dialogRef = this.dialog.open(CreateEditTaskComponent, {
      data: { currentPage: this.paginator.pageIndex + 1 },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTaskList();
        }
      },
    });
  }

  openEditTaskForm(data: ITask) {
    const dialogRef = this.dialog.open(CreateEditTaskComponent, {
      data: [{ ...data, originalData: data }],
    });
    dialogRef.componentInstance.id = data.id;

    dialogRef.afterClosed().subscribe({
      next: (editedTask: ITask) => {
        if (editedTask) {
          this.coreService.openSnackBar('Task Updated', 'done');
          this.getTaskList();
        }
      },
    });
  }

  getCompletedText(task: any): SafeHtml {
    if (['10', '11'].includes(String(task.status))) {
      const result = this.sanitizer.bypassSecurityTrustHtml(
        '<span>Completed</span>'
      );
      return result;
    }
    return 'Inprogress';
  }

  toggleCompleted(row: any) {
    row.completed = !row.completed;
    // Save the state of all checkboxes to the local storage
    localStorage.setItem(
      'checkboxes',
      JSON.stringify(
        this.tasks.map((task) => ({ id: task.id, completed: task.completed }))
      )
    );
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
      password: this.loginForm.get('password')?.value,
    };
    this.taskService.logAdminIn({ credentials }).subscribe({
      next: (res) => {
        if (res['status'] === 'ok') {
          // Store the token in local storage
          const token = res['message']['token'];
          localStorage.setItem('token', token);
          // Store the current time in local storage
          localStorage.setItem('login-time', Date.now().toString());
          this.isAdmin = true;
          this.loginForm.reset();
          this.showLoginForm = false;
          this.coreService.openSnackBar('Logged in', 'OK');
        } else {
          this.coreService.openSnackBar('Login fail', 'ERROR');
        }
      },
      error: (error) => {
        console.log(error);
        this.coreService.openSnackBar('Login fail', 'ERROR');
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

interface CheckboxState {
  id: number;
  completed: boolean;
}
