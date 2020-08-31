import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '../../../../node_modules/@angular/material';
import { NgForm } from '../../../../node_modules/@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PatientsService } from '../../patients.service';
import { DiagnosticReportsService } from '../../diagnosticReports.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { DiagnosticReport } from '../../diagnosticReport.model';
import { Patient } from '../../patient.model';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';

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
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent implements OnInit {
  examinationDataExample: { name: string, value: string, prob: string, unit: string, ref: string }[] = [];
  @ViewChild('f') pdfExtract: NgForm;
  selectedFile: File =null;
  form: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  taj: number;
/*   patient: {name: string, taj: number, dateOfBirth: Date}; */
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
  //két kategória tömb
  templates: Template[] =[];
  templates1: Template[] = [];

  @ViewChild('first') private demoCanvas;
  private demoChart: Chart; // a demoChart egy Chart típusú objektum

  va = [
    'Fehérvérsejt szám',
    'Neutrophil gran.',
    'Neutrophil gran. %',
    'Lymphocyta',
    'Lymphocyta %',
    'Monocyta',
    'Monocyta %',
    'Eosinophil',
    'Eosinophil %',
    'Basophil',
    'Basophil %',
    'Vörösvértestszám',
    'Haemoglobin',
    'Hematokrit',
    'MCV',
    'MCH',
    'MCHC',
    'RDW-CV',
    'Thrombocyta szám',
    'MPV'
  ]

  generalNames = [
    'Nátrium',
    'Kálium',
    'Klorid',
    'Bikarbonát',
    'Kalcium',
    'Korrigált Kalcium',
    'Magnézium',
    'Foszfát',
    'Glükóz',
    'Haemoglobin A1C',
    'Összfehérje',
    'Albumin',
    'Koleszterin',
    'Triglicerid',
    'HDL-koleszterin',
    'LDL-koleszterin',
    'Szenzitív C-reaktív protein',
    'Aszpartát-aminotranszferáz (GOT)',
    'Alanin-aminotranszferáz (GPT)',
    'Alkalikus foszfatáz (ALP)',
    'Gamma-glutamil transzferáz (GGT)',
    'Össz bilirubin',
    'Alfa-amiláz',
    'Karbamid (Urea)',
    'Kreatinin',
    'Vizelet kreatinin',
  //  'eGFR-EPI',
    'Húgysav',
    'Vizelet összfehérje',
  //  'Vizelet albumin'

  ]

  displayedColumns: string[] = ['name', 'unit', 'ref'];
  displayedColumns1: string[] = ['name', 'unit', 'ref'];

  //activatedRoute kell a taj alapján a páciens megkapásához
  constructor(public dialog: MatDialog,
     private route: ActivatedRoute,
     private datePipe: DatePipe, private diagnosticReportsService: DiagnosticReportsService) {
  }

  ngOnInit() {

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
            console.log(this.pdfs);

            // Értékeke kinyerése 1 templatebe
          let needNew = true;
            for(let i =0; i< this.va.length; i++ ){
              for(let j = 0; j< pdf.dataRecovered.length; j++){
                if(this.va[i]== pdf.dataRecovered[j].name){
                  if(needNew){
                    this.createNewAutoVerkep(pdf.uploaded, pdf.id);
                  }
                  this.templates[this.templates.length-1].content[i] = pdf.dataRecovered[j];
                  needNew = false;
                }
              }
            }
            needNew = true;
            for(let i =0; i< this.generalNames.length; i++ ){
              for(let j = 0; j< pdf.dataRecovered.length; j++){
                if(this.generalNames[i]== pdf.dataRecovered[j].name){
                  if(needNew){
                    this.createNewAltalanos(pdf.uploaded, pdf.id);
                  }
                  this.templates1[this.templates1.length-1].content[i] = pdf.dataRecovered[j];
                  needNew = false;
                }
              }
            }
          }

          this.sortByDate(this.templates);
          this.sortByDate(this.templates1);

        let ar = [];
        let ar1 = [];
        ar = this.firstTemplateInit(this.templates, this.displayedColumns );
        ar1 = this.firstTemplateInit(this.templates1, this.displayedColumns1 );


          for(let i =0; i< this.templates.length-1; i++ ){
            if(i==0){
              ar = this.createNewObjectSchema(this.templates[i].content, this.templates[i+1], this.displayedColumns);
            }
            else{
              ar = this.createNewObjectSchema(ar, this.templates[i+1], this.displayedColumns);
            }
          }
          for(let i =0; i< this.templates1.length-1; i++ ){
            if(i==0){
              ar1 = this.createNewObjectSchema(this.templates1[i].content, this.templates1[i+1], this.displayedColumns1);
            }
            else{
              ar1 = this.createNewObjectSchema(ar1, this.templates1[i+1], this.displayedColumns1);
            }
          }

    this.dataSource = new MatTableDataSource(ar);
    this.dataSource.sort = this.sort;
    this.dataSource1 = new MatTableDataSource(ar1);
    this.dataSource1.sort = this.sort;
    this.isLoading = false;
  });

  }

  firstTemplateInit(template, disp){
    let ar: any[];
    if(template.length>=1){
      ar= template[0].content;
      let newContentDateString = this.datePipe.transform(template[0].uploaded, 'y, MMM d, hh:mm');
      disp.push(newContentDateString);
      for(let i =0; i< template[0].content.length; i++ ){
        template[0].content[i][newContentDateString]=template[0].content[i].value;
      }
    }
    return ar;
  }

  sortByDate(templates: Template[]){
    if(templates.length>1){
      for(let k=0; k<templates.length; k++){
        for(let i=0; i<templates.length-1; i++){
          if(templates[i].uploaded>templates[i+1].uploaded){
            let temp = templates[i+1];
            templates[i+1] = templates[i];
            templates[i] = temp;
          }
        }
      }
    }
  }

  getStyle(row, element, column, templates){
    for(let i = 0; i < templates.length; i++){
      let convertedTime = this.datePipe.transform(templates[i].uploaded, 'y, MMM d, hh:mm');
      for(let j = 0; j < templates[i].content.length; j++){
       if(column==convertedTime && templates[i].content[row].value==element && templates[i].content[row].prob!=""){
        return "red";
        }
      }
    }
  }
  // bemenet lesz a this.templates[0] és az új template
  createNewObjectSchema(oldContent: any[], newContent: Template, displayedColumns: any[]){

    let newContentDateString = this.datePipe.transform(newContent.uploaded, 'y, MMM d, hh:mm');
    let newContentName = newContentDateString;
    displayedColumns.push(newContentName);
    let arr = [];
    for(let i = 0; i < oldContent.length; i++){
      let newObj: any= {};

      let objectArr = Object.keys(oldContent[i]);
      for(let j = 0; j< objectArr.length; j++){
        //id-re itt nincs szükségünk
        if(objectArr[j]!='_id'){
          newObj[objectArr[j]]=oldContent[i][objectArr[j]];
        }
      }      
      for(let j = 0; j < newContent.content.length; j++){
        if(oldContent[i].name == newContent.content[j].name){
          newObj[newContentName] = newContent.content[j].value;
          if(newObj.prob== null)
          newObj.prob = newContent.content[j].prob;
          if(newObj.unit== null)
          newObj.unit = newContent.content[j].unit;
          if(newObj.ref== null)
          newObj.ref = newContent.content[j].ref;
        }
      }
      arr.push(newObj);
    }
    return arr;
  }

  createNewAutoVerkep(uploaded, id){
    let AutoVerkep: Template = {
      id : id,
      name: 'Vérkép automatával',
      uploaded: null,
      content: []
    };
  
    for(let i =0; i< this.va.length; i++){
      let setContent: ExaminationData = {
        name: this.va[i],
        value: null,
        prob: null,
        unit: null,
        ref: null
      }
      AutoVerkep.content.push(setContent);
      AutoVerkep.uploaded = uploaded;
    }
    this.templates.push(AutoVerkep);
  }

  createNewAltalanos(uploaded, id){
    let Altalanos: Template = {
      id : id,
      name: 'Általános vizsgálat',
      uploaded: null,
      content: []
    };
  
    for(let i =0; i< this.generalNames.length; i++){
      let setContent: ExaminationData = {
        name: this.generalNames[i],
        value: null,
        prob: null,
        unit: null,
        ref: null
      }
      Altalanos.content.push(setContent);
      Altalanos.uploaded = uploaded;
    }
    this.templates1.push(Altalanos);
  }

}
