import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';;
import { NgForm } from '../../../../node_modules/@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PatientsService } from '../../patients.service';
import { DiagnosticReportsService } from '../../diagnosticReports.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { DiagnosticReport } from '../../diagnosticReport.model';
import { Patient } from '../../patient.model';
import { DatePipe } from '@angular/common';

interface PDF {
  id: string,
  name: string;
  uploaded: Date;
  comment: string;
  pdfURL: string;
  dataRecovered: ExaminationData[];
}

interface Template {
  id: string;
  name: string;
  uploaded: string;
  content: ExaminationData[];
}

interface ExaminationData {
  name: string;
  value: string;
  prob: string;
  unit: string;
  ref: string;
}

@Component({
  selector: 'app-pdf-extract',
  templateUrl: './pdf-extract.component.html',
  styleUrls: ['./pdf-extract.component.css']
})
export class PdfExtractComponent implements OnInit {
  examinationDataExample: { name: string, value: string, prob: string, unit: string, ref: string }[] = [];
  @ViewChild('f') pdfExtract: NgForm;
  selectedFile: File =null;
  form: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  taj: number;
  patient: Patient;
  isLoading = false;
  id: string;
  setContent: {};

  diagnosticReports: DiagnosticReport[] = [];
  private diagnosticReportSub: Subscription;
  dataSource;
  dataSource1;
  @ViewChild(MatSort) sort: MatSort;

  pdfs: PDF[] = [
  ];

  templates: Template[] = [];
  templates1: Template[] = [];

  displayedColumns: string[] = ['name', 'unit', 'ref'];
  displayedColumns1: string[] = ['name', 'unit', 'ref'];

  //activatedRoute kell a taj alapján a páciens megkapásához
  constructor(public dialog: MatDialog,
     private _formBuilder: FormBuilder, private route: ActivatedRoute,
     private diagnosticReportsService: DiagnosticReportsService) {
  }

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.id = paramMap.get("id");
      }
    });
    this.isLoading = true;
    this.diagnosticReportsService.getD(this.id);
    this.diagnosticReportSub =  this.diagnosticReportsService.
      getDiagnosticReportUpdateListener().
        subscribe((diagnosticReports: DiagnosticReport[]) => {
          this.diagnosticReports=diagnosticReports;
          // pdfs tömb üresítése a feltöltés miatt
          this.pdfs= [];
          this.templates = [];
          this.templates1 = [];

          for(let i=0;i<this.diagnosticReports.length;i++){
            let name= this.diagnosticReports[i].name;
            let filePath= this.diagnosticReports[i].filePath;
            let extractedData = this.diagnosticReports[i].content;
            let uploaded = this.diagnosticReports[i].uploaded;
            let id = this.diagnosticReports[i].id;
            let pdf: PDF =
              {
                id: id,
                name: name,
                uploaded: uploaded,
                comment: this.diagnosticReports[i].comment,
                pdfURL: filePath,
                dataRecovered: extractedData
              };
            this.pdfs.push(pdf);

          }
    this.sortByDate(this.pdfs);
    this.isLoading = false;
  });
  }

  sortByDate(pdfs: PDF[]){
    for(let k=0; pdfs.length>k; k++){
      for(let i=0; pdfs.length-1>i; i++){
        if(pdfs[i].uploaded>pdfs[i+1].uploaded){
          let temp = pdfs[i+1];
          pdfs[i+1]=pdfs[i];
          pdfs[i] = temp;
        }
      }
    }
  }

  onFileSelected(event){
    this.selectedFile=event.target.files[0];
  }

  onUpload() {
   this.isLoading = true;
   this.diagnosticReportsService.addD(this.id, this.firstFormGroup.value.firstCtrl, this.selectedFile, this.thirdFormGroup.value.thirdCtrl);
   this.resetPdf();
  }

  onDelete(dId: string) {
    this.isLoading = true;
    this.diagnosticReportsService.deleteD(dId);
  }

    resetPdf(){
    this.selectedFile=null;
  }
}
