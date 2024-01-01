import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditTaskComponent } from './create-edit-task/create-edit-task.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'task-manager';
  tasks: any[] = [];

  constructor(private dialog: MatDialog,
    private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data
      console.log("🚀 ~ file: create-edit-task.component.ts:26 ~ CreateEditTaskComponent ~ this.taskService.getTask ~ this.tasks:", this.tasks)
    })
  }

  openCreateEditTaskForm() {
    this.dialog.open(CreateEditTaskComponent)
  }
}
