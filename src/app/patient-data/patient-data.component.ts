import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { PatientsService } from '../patients.service';
import {MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import { Router } from '../../../node_modules/@angular/router';
// import { RouterModule, Routes,, Router } from '@angular/router';

import { Patient } from '../patient.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrls: ['./patient-data.component.css']
})
export class PatientDataComponent implements OnInit, OnDestroy {

  patients: Patient[] = [];
  private patientSub: Subscription;
  dataSource;
  displayedColumns: string[] = ['name', 'taj', 'dateOfBirth'];
  isLoading = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public patientsService: PatientsService, private router: Router) {}


  ngOnInit() {
    this.isLoading = true;
    this.patientsService.getP();
    this.patientSub =  this.patientsService.getPatientUpdateListener().subscribe((patients: Patient[]) => {
      this.patients=patients;
      console.log(this.patients);
      this.dataSource = new MatTableDataSource(this.patients);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.patientSub.unsubscribe();
  }

  onAddPatient(form: NgForm) {
    this.patientsService.addP(form.value.name, form.value.taj, form.value.dateOfBirth);
    form.resetForm();
  }

  onActiveData(row: any, event) {
    this.router.navigate(['/patienttable', row.id, 'pdfextract']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
