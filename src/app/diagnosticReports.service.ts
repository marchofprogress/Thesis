import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

import { DiagnosticReport } from "./diagnosticReport.model";

@Injectable()
export class DiagnosticReportsService {

  constructor(private http: HttpClient) {}
  private diagnosticReports : DiagnosticReport[] = [];
  private diagnosticReportsUpdates = new Subject<DiagnosticReport[]>();

addD(
    patientId: string,
    name: string, file: File, comment: string
  ){
    const diagnosticReportData = new FormData();
    diagnosticReportData.append("name", name);
    diagnosticReportData.append("comment", comment);
    diagnosticReportData.append("file", file, name);
    this.http
      .post<{message: string, diagnosticReport: DiagnosticReport}>(
        "http://localhost:3000/api/patients/" + patientId + "/diagnosticReports",
        diagnosticReportData
      )
      .subscribe(diagnocticReportAddData => {
        const diagnosticReport: DiagnosticReport =
          {
            id: diagnocticReportAddData.diagnosticReport.id,
            name: name,
            filePath: diagnocticReportAddData.diagnosticReport.filePath,
            comment: comment,
            uploaded: diagnocticReportAddData.diagnosticReport.uploaded,
            content: diagnocticReportAddData.diagnosticReport.content
          };
        this.diagnosticReports.push(diagnosticReport);
        this.diagnosticReportsUpdates.next(this.diagnosticReports);
    });
  }

  getD(id: string){
    this.http.get<{diagnosticReports: any}>("http://localhost:3000/api/patients/" + id + "/diagnosticReports")
    // id átalakítására használjuk, mert db-ben _id, frontenden id
    .pipe(map((diagnosticReportData) => {
      return diagnosticReportData.diagnosticReports.map(diagnosicReport => {
        return {
          name: diagnosicReport.name,
          uploaded: diagnosicReport.uploaded,
          filePath: diagnosicReport.filePath,
          comment: diagnosicReport.comment,
          content: diagnosicReport.content,
          id: diagnosicReport._id
        };
      });
    }))
    .subscribe((transformedDiagnosticReports) => {
      this.diagnosticReports = transformedDiagnosticReports;
      this.diagnosticReportsUpdates.next(this.diagnosticReports);
      console.log(this.diagnosticReports);
    });
  }

  deleteD(dId: string){
    this.http.delete("http://localhost:3000/api/patients/diagnosticReports/" + dId).subscribe(()=>{
      const updatedDiagnosticReports = this.diagnosticReports.filter(diagnosticReport => diagnosticReport.id !== dId);
      this.diagnosticReports = updatedDiagnosticReports;
      this.diagnosticReportsUpdates.next(this.diagnosticReports);
    });
  }

  getDiagnosticReportUpdateListener(){
    return this.diagnosticReportsUpdates.asObservable();
  }

}