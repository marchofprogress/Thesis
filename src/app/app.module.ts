import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '../../node_modules/@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '../../node_modules/@angular/material/core';

import { AppComponent } from './app.component';
import { PatientDataComponent } from './patient-data/patient-data.component';
import { MedicalRecordsComponent } from './patient-data/medical-records/medical-records.component';
import { HeaderComponent } from './header/header.component';
import { PatientHeaderComponent } from './patient-data/patient-header/patient-header.component';
import { MedicalChartsComponent } from './patient-data/medical-charts/medical-charts.component';
import { PdfExtractComponent } from './patient-data/pdf-extract/pdf-extract.component';


import { PatientsService } from './patients.service';
import { DiagnosticReportsService } from './diagnosticReports.service';
import { AppRoutingModule } from './app-routing.module';

import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    PatientDataComponent,
    MedicalRecordsComponent,
    PdfExtractComponent,
    HeaderComponent,
    PatientHeaderComponent,
    MedicalChartsComponent,
 ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // reactive kell a stepperhez
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [PatientsService, DiagnosticReportsService, DatePipe,
  { provide: MAT_DATE_LOCALE, useValue: 'hun-HU'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
