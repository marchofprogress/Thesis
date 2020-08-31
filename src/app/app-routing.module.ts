import { Routes, RouterModule } from "../../node_modules/@angular/router";
import { NgModule } from "../../node_modules/@angular/core";

import { PatientDataComponent } from './patient-data/patient-data.component';
import { MedicalRecordsComponent } from './patient-data/medical-records/medical-records.component';
import { MedicalChartsComponent } from './patient-data/medical-charts/medical-charts.component';
import { PdfExtractComponent } from './patient-data/pdf-extract/pdf-extract.component';

const appRoutes: Routes = [
    { path: '', component: PatientDataComponent},
    { path: 'patienttable', component: PatientDataComponent},
    { path: 'patienttable/:id/medicalrecords', component: MedicalRecordsComponent },
    { path: 'patienttable/:id/pdfextract', component: PdfExtractComponent },
    { path: 'patienttable/:id/medicalcharts', component: MedicalChartsComponent }
  ];

  @NgModule({
      imports: [RouterModule.forRoot(appRoutes)],
      exports: [RouterModule]
  })
  export class AppRoutingModule {}