import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditTaskComponent } from './create-edit-task/create-edit-task.component';
import { TaskService } from './services/task.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CoreService } from './core/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  tasks: any[] = [];
  loginForm: FormGroup;
  isEdited: boolean = false;
  isAdmin: boolean = true;
  showLoginForm: boolean = false;

  displayedColumns: string[] = ['username', 'email', 'text', 'status', 'edited', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,
    private taskService: TaskService,
    private coreService: CoreService,
    private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    }

  ngOnInit(): void {
    this.getTaskList();
  }

  getTaskList() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => {
        this.tasks = data
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {

      }
    })
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
      }
    })
  }

  openEditTaskForm(data: any) {
    const dialogRef = this.dialog.open(CreateEditTaskComponent, {
      data: [{...data, originalData: data}]
    });
    dialogRef.componentInstance.id = data.id

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.coreService.openSnackBar('Task Updated', 'done')
          this.getTaskList();
        }
      }
    })

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
    this.taskService.logAdminIn(this.loginForm.value).subscribe({
      next: (res) => {
        console.log("🚀 ~ file: app.component.ts:117 ~ AppComponent ~ this.taskService.logAdminIn ~ res:", res)
      },
      error: (error) => {
        console.log("🚀 ~ file: app.component.ts:120 ~ AppComponent ~ this.taskService.logAdminIn ~ error:", error)
      }
    })
    this.showLoginForm = false;
   }

}
