import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {BankModel} from "../../../models/bank.model";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {BankService} from "../../../services/data/bank.service";
import {of} from "rxjs";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-bank-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,HttpClientModule,
    MatButton,MatError,
    MatFormField,
    MatIcon, MatLabel, FormsModule, FormsModule, ReactiveFormsModule, ReactiveFormsModule,
    MatInput, MatHint, MatDialogClose, NgIf
  ],
  providers: [BankService],
  templateUrl: './bank-dialog.component.html',
  styleUrl: './bank-dialog.component.css'
})
export class BankDialogComponent {
  bank!: BankModel;
  bankForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<BankDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: BankModel,
              private bankService: BankService,
              fb: FormBuilder) {
    this.bankForm = fb.group({
      name: ['', [Validators.required]],
    })
  }


  onNoClick(): void {
  this.dialogRef.close(); // Close the dialog
  }

  createBank() {
    if(this.bankForm.valid) {
      const bank = new BankModel(0,new Date(),new Date(),"ayoub",this.bankForm.get('name')?.value,true)
      this.bankService.createBank(bank).subscribe(
        {next:(data)=>{
            this.dialogRef.close(data);
          },
          error:()=>{
            of(null)
          }
        }
      )
    }
  }
}
