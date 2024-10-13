import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatCompanyDialogComponent } from './creat-company-dialog.component';

describe('CreatCompanyDialogComponent', () => {
  let component: CreatCompanyDialogComponent;
  let fixture: ComponentFixture<CreatCompanyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatCompanyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
