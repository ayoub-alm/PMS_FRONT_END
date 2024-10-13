import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BankModel } from '../../models/bank.model';
import { BankService } from '../../services/data/bank.service';
import {HttpClientModule} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {BankDialogComponent} from "./bank-dialog/bank-dialog.component";
import {catchError, of, Subscription, tap} from "rxjs";
import {Event} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatChip} from "@angular/material/chips";

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [MatFormFieldModule, HttpClientModule, MatInputModule, MatTable, MatPaginator, MatColumnDef, MatHeaderCell,
    MatCell, MatCellDef, MatRowDef, MatHeaderRow, MatRow, MatHeaderCellDef, MatHeaderRowDef, MatNoDataRow, MatSort,
    DatePipe, MatCheckbox, MatSortHeader, MatIcon, MatMenuTrigger, MatMenu, MatMenuItem, MatIconButton, MatMiniFabButton, MatChip, MatButton],
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
  providers: [BankService],
})
export class BankComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id','name','status','createdBy','created_at', 'updated_at'];
  dataSource: MatTableDataSource<BankModel>;
  selectedRow: BankModel | null = null;
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private bankService: BankService,private sb: MatSnackBar,
              private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<BankModel>([]);
    // Fetch all banks and assign to dataSource
    this.bankService.getAllBanks().pipe(
      tap(value => {
        this.dataSource.data = value;
      })
    ).subscribe();
  }

  /**
   *
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Assign paginator
    this.dataSource.sort = this.sort; // Assign sort
  }

  /**
   *
   * @param event
   */
  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after filtering
    }
  }

  /**
   *
   * @param row
   */
  toggleRow(row: BankModel) {
    this.selectedRow = this.selectedRow === row ? null : row; // Toggle selection
  }

  /**
   *
   * @param row
   */
  isRowSelected(row: BankModel): boolean {
    return this.selectedRow === row; // Check if the row is selected
  }

  /**
   *
   * @param row
   */
  checkboxLabel(row: BankModel): string {
    return `${this.isRowSelected(row) ? 'deselect' : 'select'} row ${row ? row.name : ''}`;
  }

  /**
   *
   */
  openDialog() {
    const dialogRef = this.dialog.open(BankDialogComponent, { width: '30%' });
    this.subscriptions.push(
      // listen to dialog close show the result depends on result
      dialogRef.afterClosed().subscribe({
        next: (data: BankModel | null) => {
          if (data) {
            this.dataSource.data = [...this.dataSource.data, data];
            if (this.paginator) {
              this.paginator.firstPage(); // Optional: reset to the first page
            }
            this.sb.open(`${data.name} créé avec succès`,"Ok",{duration:3000});
          }
        },
        error: (err) => {
          this.sb.open(`${err} `,"Ok",{duration:3000});
        }
      })
    )
  }

  deleteBank() {
    if (this.selectedRow) {
      this.bankService.deleteBank(this.selectedRow).pipe(
        tap(() => {
          // Optionally, you can perform some action after successful deletion
          this.dataSource.data = this.dataSource.data.filter(bank => bank.id !== this.selectedRow?.id); // Update the data source
          this.sb.open(`Banque supprimée avec succès !`, "Ok", { duration: 3000 });
          this.selectedRow = null;
        }),
        catchError(err => {
          this.sb.open(`Erreur lors de la suppression de la banque : ${err.message}`, "Ok", { duration: 3000 });
          return of(null); // Return an empty observable to handle the error
        })
      ).subscribe();
    } else {
      this.sb.open(`Aucune banque sélectionnée pour la suppression`, "Ok", { duration: 3000 });
    }
  }


  /**
   *
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe()
    })
  }

}
