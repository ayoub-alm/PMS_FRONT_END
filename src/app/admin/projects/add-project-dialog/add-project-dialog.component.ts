import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ProjectService} from "../../../services/project.service";
import {CreateProjectRequestDto} from "../../../dtos/request/CreateProjectRequestDto";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.css',
  providers:[ProjectService, HttpClient]
})
export class AddProjectDialogComponent implements OnInit {
    projectForm: FormGroup;
    constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
                private projectService: ProjectService, private _fb: FormBuilder, private snackBar: MatSnackBar) {
      this.projectForm = this._fb.group({
        projectName:['', Validators.required, Validators.maxLength(50), Validators.minLength(2)],
      })
    }

    ngOnInit() {
      console.log(this.data.companyId)
    }

  /**
   * this function create a project
   */
  createProject(){
        const project = new CreateProjectRequestDto(this.projectForm.get('projectName')?.value,this.data.companyId)
        this.projectService.createProject(project).subscribe({
          next:(project)=>{
            this.dialogRef.close(project)
          },
          error:(error)=>{
            this.snackBar.open(error,"Ok",{duration:3000});
            // this.dialogRef.close(error)
          }
        })
    }
}
