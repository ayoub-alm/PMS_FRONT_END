import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {catchError, of, Subscription, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {CreateCompanyDialogComponent} from "./creat-company-dialog/creat-company-dialog.component";
import {CompanyService} from "../../services/company.service";
import {CompanySizeResponseDto} from "../../dtos/init_data/response/company.size.response.dt";
import {CompanyResponseDto} from "../../dtos/response/CompanyResponseDto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [DatePipe, MatCell, MatCellDef, MatCheckbox, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow,
    MatHeaderRowDef, MatIcon, MatInput, MatMenu, MatMenuItem, MatPaginator, MatRow, MatRowDef, MatSort, MatTable,
    MatSortHeader, MatMenuTrigger],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  providers: [DatePipe, CompanyService, HttpClient]
})
export class CompaniesComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'img', 'name', 'status', 'createdBy', 'created_at', 'updated_at'];
  dataSource: MatTableDataSource<CompanyResponseDto>;
  selectedRow: CompanyResponseDto | null = null;
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly environment = environment;

  constructor(private companyService: CompanyService, private sb: MatSnackBar, private dialog: MatDialog, private router: Router) {
    this.dataSource = new MatTableDataSource<CompanyResponseDto>([]);
    this.loadCompanies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Apply filter to the data source */
  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after filtering
    }
  }

  /** Toggle row selection */
  toggleRow(row: CompanyResponseDto) {
    this.selectedRow = this.selectedRow === row ? null : row; // Toggle selection
  }

  /** Check if the row is selected */
  isRowSelected(row: CompanyResponseDto): boolean {
    return this.selectedRow === row; // Check if the row is selected
  }

  /** Get checkbox label */
  checkboxLabel(row: CompanyResponseDto): string {
    return `${this.isRowSelected(row) ? 'deselect' : 'select'} row ${row ? row.name : ''}`;
  }

  /** Open dialog to create a new company */
  openDialog() {
    const dialogRef = this.dialog.open(CreateCompanyDialogComponent, {width: '90%'});
    this.subscriptions.push(dialogRef.afterClosed().subscribe({
      next: (data: CompanyResponseDto | null) => {
        if (data) {
          this.dataSource.data = [...this.dataSource.data, data];
          this.paginator.firstPage(); // Reset to the first page
          this.sb.open(`${data.name} créé avec succès`, "Ok", {duration: 3000});
        }
      }, error: (err) => {
        this.sb.open(`Erreur: ${err}`, "Ok", {duration: 3000});
      }
    }));
  }

  /** Delete selected bank (currently commented out) */
  deleteCompany() {
    if (this.selectedRow) {
      this.companyService.deleteCompanyById(this.selectedRow.id).pipe(
        tap(() => {
          this.dataSource.data = this.dataSource.data.filter(company => company.id !== this.selectedRow?.id);
          this.sb.open(`Entreprise supprimée avec succès !`, "Ok", { duration: 3000 });
          this.selectedRow = null;
        }),
        catchError(err => {
          this.sb.open(`Erreur lors de la suppression de la Entreprise: ${err.message}`, "Ok", { duration: 3000 });
          return of(null);
        })
      ).subscribe();
    } else {
      this.sb.open(`Aucune Entreprise sélectionnée pour la suppression`, "Ok", { duration: 3000 });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /** Fetch all companies and assign to dataSource */
  private loadCompanies() {
    this.companyService.getAllCompanies().pipe(tap(value => this.dataSource.data = value), catchError(err => {
      this.sb.open(`Error fetching companies: ${err.message}`, "Ok", {duration: 3000});
      return of([]); // Return an empty array on error
    })).subscribe();
  }

  showCompany(row: CompanyResponseDto) {
    this.router.navigateByUrl(`admin/companies/${row.id}`)
  }
}
