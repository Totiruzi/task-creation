import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-create-edit-task',
  templateUrl: './create-edit-task.component.html',
  styleUrls: ['./create-edit-task.component.scss'],
})
export class CreateEditTaskComponent {
  taskForm: FormGroup;
  tasks: any[] = [];

  constructor(private taskFormBuilder: FormBuilder,
    private taskService: TaskService,
    private dialogRef: DialogRef<CreateEditTaskComponent>) {
    this.taskForm = this.taskFormBuilder.group({
      username: '',
      email: '',
      text: '',
      status: false,
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      console.log(
        '🚀 ~ file: create-edit-task.component.ts:24 ~ CreateEditTaskComponent ~ onSubmit ~ this.taskForm:',
        this.taskForm.value
      );

      const taskData = {
        username: this.taskForm.get('username')?.value,
        email: this.taskForm.get('email')?.value,
        text: this.taskForm.get('text')?.value,
      };
      this.taskService.addTask(taskData).subscribe({
        next: (data: any) => {
          console.log("🚀 ~ file: create-edit-task.component.ts:41 ~ CreateEditTaskComponent ~ this.taskService.addTask ~ data:", data)
          alert('Task added successfully');
          this.dialogRef.close();
        },
        error: (err: any) => {
          console.log("🚀 ~ file: create-edit-task.component.ts:36 ~ CreateEditTaskComponent ~ this.taskService.addTask ~ err:", err)
        }
      })
    }
  }
}
