import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalChartsComponent } from './medical-charts.component';

describe('MedicalChartsComponent', () => {
  let component: MedicalChartsComponent;
  let fixture: ComponentFixture<MedicalChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
