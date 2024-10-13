import {AfterViewInit, Component, inject, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {
  MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, StepperOrientation
} from "@angular/material/stepper";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {BehaviorSubject, map, Observable, Subscription} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TitleResponseDto} from "../../../dtos/init_data/response/title.response.dto";
import {TitleService} from "../../../services/data/Title.service";
import {MatOption, MatSelect} from "@angular/material/select";
import {HttpClientModule} from "@angular/common/http";
import {CompanySizeResponseDto} from "../../../dtos/init_data/response/company.size.response.dt";
import {CompanySizeService} from "../../../services/data/company.size.service";
import {JobTitleService} from "../../../services/data/job.title.service";
import {JobTitleResponseDto} from "../../../dtos/init_data/response/job.title.response.dto";
import {ProprietaryStructureService} from "../../../services/data/proprietary.structure.service";
import {ProprietaryStructureDto} from "../../../dtos/init_data/response/proprietary.structure.dto";
import {CityResponseDto} from "../../../dtos/init_data/response/city.response.dt";
import {CityService} from "../../../services/data/city.service";
import {CountryService} from "../../../services/data/country.service";
import {CountryResponseDto} from "../../../dtos/init_data/response/country.response.dto";
import {IndustryResponseDto} from "../../../dtos/init_data/response/industry.response.dt";
import {IndustryService} from "../../../services/data/industry.service";
import {CourtService} from "../../../services/data/court.service";
import {CourtResponseDto} from "../../../dtos/init_data/response/court.response.dto";
import {LegalStatusService} from "../../../services/data/legal.status.service.dto";
import {LegalStatusDto} from "../../../dtos/init_data/response/legal.status.dto";
import {CreateCompanyRequest} from "../../../dtos/request/CreateCompanyDto";
import {CompanyService} from "../../../services/company.service";

@Component({
  selector: 'app-create-company-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatButton, MatFormField, MatStep, ReactiveFormsModule, MatStepLabel, MatStepper, MatStepperPrevious, MatStepperNext, MatInput, MatLabel, AsyncPipe, MatSelect, MatOption, NgForOf, HttpClientModule, NgIf, MatError],
  templateUrl: './creat-company-dialog.component.html',
  styleUrl: './creat-company-dialog.component.css',
  providers: [TitleService, CompanySizeService, JobTitleService, ProprietaryStructureService, CityService, CountryService, IndustryService, CourtService, LegalStatusService, CompanyService]
})
export class CreateCompanyDialogComponent implements OnInit, AfterViewInit {
  // Define the form groups
  companyDetailsFormGroup: FormGroup;
  contactInfoFormGroup: FormGroup;
  legalInfoFormGroup: FormGroup;
  businessDescriptionFormGroup: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;

  blankCompany = {} as CreateCompanyRequest;
  company: CreateCompanyRequest = this.blankCompany
  titles: BehaviorSubject<TitleResponseDto[]> = new BehaviorSubject<TitleResponseDto[]>([]);
  companySizes: BehaviorSubject<CompanySizeResponseDto[]> = new BehaviorSubject<CompanySizeResponseDto[]>([]);
  jobTitles: BehaviorSubject<JobTitleResponseDto[]> = new BehaviorSubject<JobTitleResponseDto[]>([]);
  proprietaryStructures: BehaviorSubject<ProprietaryStructureDto[]> = new BehaviorSubject<ProprietaryStructureDto[]>([]);
  cities: BehaviorSubject<CityResponseDto[]> = new BehaviorSubject<CityResponseDto[]>([]);
  countries: BehaviorSubject<CountryResponseDto[]> = new BehaviorSubject<CountryResponseDto[]>([]);
  industries: BehaviorSubject<IndustryResponseDto[]> = new BehaviorSubject<IndustryResponseDto[]>([]);
  courts: BehaviorSubject<CourtResponseDto[]> = new BehaviorSubject<CourtResponseDto[]>([]);
  legalStatuses: BehaviorSubject<LegalStatusDto[]> = new BehaviorSubject<LegalStatusDto[]>([]);
  subscriptions: Subscription[] = [];
  private _formBuilder = inject(FormBuilder);

  constructor(private dialogRef: MatDialogRef<CreateCompanyDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any, private titleService: TitleService, private companySizesService: CompanySizeService, private jobTitleService: JobTitleService, private proprietaryStructureService: ProprietaryStructureService, private cityService: CityService, private countryService: CountryService, private industryService: IndustryService, private courtService: CourtService, private legalStatusService: LegalStatusService, private companyService: CompanyService) {
    // Define the form groups
    this.companyDetailsFormGroup = this._formBuilder.group({
      companyName: ['', Validators.required],
      sigle: [''],
      logo: ['', Validators.required],
      capital: ['', [Validators.required, Validators.min(0)]],
      headOffice: ['', Validators.required],
      proprietaryStructure: ['', Validators.required],
      yearOfCreation: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      companySize: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      industry: ['', Validators.required]
    });

    this.contactInfoFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      fax: [''],
      whatsapp: ['' ],
      website: ['',Validators.pattern('https?://.+')],
      linkedin: ['', Validators.pattern('https?://.+')]
    });

    this.legalInfoFormGroup = this._formBuilder.group({
      ice: ['', Validators.required],
      rc: ['', Validators.required],
      ifm: ['', Validators.required],
      patent: [''],
      cnss: [''],
      certificationText: [''],
      legalRepresentative: ['', Validators.required],
      legalRepresentativeTitle: ['', Validators.required],
      legalRepresentativeJobTitle: ['', Validators.required],
      court: ['', Validators.required],
      legalStatus: ['', Validators.required]
    });

    this.businessDescriptionFormGroup = this._formBuilder.group({
      businessDescription: ['', Validators.required],
    });

    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

  }


  ngOnInit() {
    // Load data for select inputs
    this.titleService.getAllTitles().subscribe(titles => this.titles.next(titles));
    this.companySizesService.getAllCompaniesSizes().subscribe(sizes => this.companySizes.next(sizes));
    this.jobTitleService.getAllJobTitles().subscribe(jobTitles => this.jobTitles.next(jobTitles));
    this.proprietaryStructureService.getAllProprietaryStructure().subscribe(proprietaryStructures => this.proprietaryStructures.next(proprietaryStructures));
    this.cityService.getAllCities().subscribe(cities => this.cities.next(cities));
    this.countryService.getAllCountries().subscribe(countries => this.countries.next(countries));
    this.industryService.getAllIndustries().subscribe(industries => this.industries.next(industries));
    this.courtService.getAllCourt().subscribe(courts => this.courts.next(courts));
    this.legalStatusService.getAllLegalStatus().subscribe(legalStatuses => this.legalStatuses.next(legalStatuses));
  }

  ngAfterViewInit() {
    // Subscribe to form control changes for select elements and update the company object
    this.companyDetailsFormGroup.get('companySize')?.valueChanges.subscribe(value => this.company.companySize = this.companySizes.getValue().find(size => size.id === value)!);
    this.companyDetailsFormGroup.get('proprietaryStructure')?.valueChanges.subscribe(value => this.company.proprietaryStructure = this.proprietaryStructures.getValue().find(structure => structure.id === value)!);
    this.companyDetailsFormGroup.get('city')?.valueChanges.subscribe(value => this.company.city = this.cities.getValue().find(city => city.id === value)!);
    this.companyDetailsFormGroup.get('country')?.valueChanges.subscribe(value => this.company.country = this.countries.getValue().find(country => country.id === value)!);
    this.companyDetailsFormGroup.get('industry')?.valueChanges.subscribe(value => this.company.industry = this.industries.getValue().find(industry => industry.id === value)!);
    this.legalInfoFormGroup.get('legalStatus')?.valueChanges.subscribe(value => this.company.legalStatus = this.legalStatuses.getValue().find(status => status.id === value)!);
    this.legalInfoFormGroup.get('court')?.valueChanges.subscribe(value => this.company.court = this.courts.getValue().find(court => court.id === value)!);
    this.legalInfoFormGroup.get('legalRepresentativeJobTitle')?.valueChanges.subscribe(value => this.company.reprosentaveJobTitle = this.jobTitles.getValue().find(jobTitle => jobTitle.id === value)!);
    this.legalInfoFormGroup.get('legalRepresentativeTitle')?.valueChanges.subscribe(value => this.company.title = this.titles.getValue().find(title => title.id === value)!);

  }

  /**
   * This function allows us to create company
   */
  createCompany() {
    // Collect data from form groups
    const companyDetails = this.companyDetailsFormGroup.value;
    const legalInfo = this.legalInfoFormGroup.value;
    const contactInfo = this.contactInfoFormGroup.value;
    const businessDescription = this.businessDescriptionFormGroup.value;

    // Create a new CreateCompanyRequest object
    const newCompany: CreateCompanyRequest = new CreateCompanyRequest(companyDetails.logo, companyDetails.companyName, companyDetails.sigle, companyDetails.capital, companyDetails.headOffice, legalInfo.legalRepresentative, companyDetails.yearOfCreation, new Date().toISOString(), // Use a specific date if available
      contactInfo.email, contactInfo.phone, contactInfo.fax, contactInfo.whatsapp, contactInfo.website, contactInfo.linkedin, legalInfo.ice, legalInfo.rc, legalInfo.ifm, legalInfo.patent, legalInfo.cnss, legalInfo.certificationText, businessDescription.businessDescription,

      this.company.legalStatus, this.company.city, this.company.court, this.company.companySize, this.company.industry, this.company.country, this.company.proprietaryStructure, this.company.title, this.company.reprosentaveJobTitle);

    // Call the service to create the company
    this.companyService.createCompany(newCompany).subscribe({
      next: (response) => {
        // Handle success
        console.log('Company created successfully:', response);
        // Close the dialog or navigate as needed
        this.dialogRef.close(response);
      }, error: (error) => {
        // Handle error
        console.error('Error creating company:', error);
      }
    });
  }

  /**
   *
   * @param event
   */
  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // Set the base64-encoded image in the company object
        this.company.logo = reader.result as string; // You store the base64 string here
        this.companyDetailsFormGroup.patchValue({logo: this.company.logo});
      };
      reader.readAsDataURL(file); // Read file as base64
    }
  }

  isEnabledToCreateCompany(): boolean {
    return this.companyDetailsFormGroup.valid && this.contactInfoFormGroup.valid && this.legalInfoFormGroup.valid && this.businessDescriptionFormGroup.valid;
  }

  get website() {
    return this.contactInfoFormGroup.get('website');
  }

  get linkedin() {
    return this.contactInfoFormGroup.get('linkedin');
  }
}
