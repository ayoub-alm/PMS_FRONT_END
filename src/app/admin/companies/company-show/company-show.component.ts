import {AfterViewInit, Component, OnInit, viewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { CompanyService } from "../../../services/company.service";
import { CompanyResponseDto } from "../../../dtos/response/CompanyResponseDto";
import { BehaviorSubject, EMPTY, catchError, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import {environment} from "../../../../environments/environment";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {AsyncPipe, NgClass, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddProjectDialogComponent} from "../../projects/add-project-dialog/add-project-dialog.component";
import {ProjectDto} from "../../../dtos/response/ProjectDto";
import {ProjectService} from "../../../services/project.service";
import {MatPseudoCheckbox} from "@angular/material/core";

@Component({
  selector: 'app-company-show',
  standalone: true,
  templateUrl: './company-show.component.html',
  styleUrls: ['./company-show.component.css'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatTabGroup,
    MatTab,
    RouterLink,
    NgClass,
    MatIcon,
    MatTabLabel,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatFormField,
    MatInput,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    AsyncPipe,
    NgForOf,
    MatPseudoCheckbox,
  ],
  providers: [CompanyService, ProjectService] // Removed ActivatedRouteSnapshot and Router
})
export class CompanyShowComponent implements AfterViewInit, OnInit {
  company: BehaviorSubject<CompanyResponseDto>;
  companyProjects: BehaviorSubject<ProjectDto[]> = new BehaviorSubject<ProjectDto[]>([]);
  protected readonly environment = environment;
  accordion = viewChild.required(MatAccordion);

  constructor(
    private dialogRef: MatDialog,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    const blankCompany: CompanyResponseDto = {} as CompanyResponseDto;
    this.company = new BehaviorSubject<CompanyResponseDto>(blankCompany);
  }


  ngOnInit() {
    const companyId = this.activatedRoute.snapshot.paramMap.get('id');
    if (companyId) {
      this.companyService.getCompanyById(parseInt(companyId)).pipe(
        tap(company => {
          this.company.next(company);
        }),
        catchError((error) => {
          this.snackBar.open(error.message, "Ok", { duration: 3000 });
          return EMPTY; // Ensures the observable completes
        })
      ).subscribe();

      // get projects
      this.projectService.getProjectsByCompanyId(parseInt(companyId)).pipe(
        tap(projects => {
          this.companyProjects.next(projects);
        }),
        catchError((error) => {
          this.snackBar.open(error.message, "Ok", { duration: 3000 });
          return EMPTY; // Ensures the observable completes
        })
      ).subscribe()
    } else {
      this.snackBar.open("Invalid company ID", "Ok", { duration: 3000 });
    }



  }

  ngAfterViewInit() {
    // Any additional logic after view initialization can go here
  }

  /**
   * this function show add new project dialog
   */
  showAddNewProjectDialog() {
    const dialogRef = this.dialogRef.open(AddProjectDialogComponent,{
      width:'50%',
      data: {
        companyId: this.company.getValue().id,
      },
    })

    dialogRef.afterClosed().pipe(
      tap(project => {
        if (project != null) {
          this.companyProjects.next([...this.companyProjects.getValue(),project])
        }
      })
    ).subscribe()
  }
}
