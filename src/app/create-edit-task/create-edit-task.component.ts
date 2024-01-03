import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-create-edit-task',
  templateUrl: './create-edit-task.component.html',
  styleUrls: ['./create-edit-task.component.scss'],
})
export class CreateEditTaskComponent implements AfterViewInit {
  taskForm: FormGroup;
  tasks: any[] = [];
  initialValues: any = {};
  id?: number;
  isEdited: boolean = false;

  constructor(
    private taskFormBuilder: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<CreateEditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
  ) {
    const dataObject = data && data.length > 0 ? data[0] : {};
    const originalData = dataObject.originalData || {};
    this.taskForm = this.taskFormBuilder.group({
      username: [originalData.username || '', Validators.required],
      email: [originalData.email || '', [Validators.required, Validators.email]],
      text: [originalData.text ||  '', Validators.required],
      status: [originalData.status || ''],
      isEdited: [false],
    });
  }
  ngAfterViewInit(): void {
    this.taskForm.patchValue(this.data?.originalData);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = {
        username: this.taskForm.get('username')?.value,
        email: this.taskForm.get('email')?.value,
        text: this.taskForm.get('text')?.value,
        status: this.taskForm.get('status')?.value,
        isEdited: JSON.stringify(this.taskForm.value) !== JSON.stringify(this.initialValues)
      };
      if (this.id) {
        this.taskForm.get('isEdited')?.setValue(true);
        this.taskService.updateTask(this.id, taskData).subscribe({
          next: (data: any) => {
            this.coreService.openSnackBar('Task updated')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
          },
        });
      } else {
        this.taskService.addTask({taskData}).subscribe({
          next: (data: any) => {
            this.coreService.openSnackBar('Task added successfully', 'Done')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
          },
        });
      }
    }
  }
}
