import { Patient } from "./patient.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

@Injectable()
export class PatientsService {

  constructor(private http: HttpClient) {}

  private patients: Patient[] =[];
  private patientsUpdates = new Subject<Patient[]>();

  getP(){
    this.http.get<{patients: any}>('http://localhost:3000/api/patients')
    // id átalakítására használjuk, mert db-ben _id, angularban id
    .pipe(map((patientData) => {
      return patientData.patients.map(patient => {
        return {
          name: patient.name,
          taj: patient.taj,
          dateOfBirth: patient.dateOfBirth,
          id: patient._id
        };
      });
    }))
    .subscribe((transformedPatients) => {
      this.patients = transformedPatients;
      this.patientsUpdates.next(this.patients);
    });
  }
  getPatientUpdateListener(){
    return this.patientsUpdates.asObservable();
  }
  addP(name: string, taj: number, dateOfBirth: Date){
    const patient: Patient = {id:null, name: name, taj: taj, dateOfBirth: dateOfBirth};
    this.http.post<{message: string, patientId: string}>("http://localhost:3000/api/patients", patient)
    .subscribe(patientAddData => {
      const pId = patientAddData.patientId;
      patient.id = pId;
      this.patients.push(patient);
      this.patientsUpdates.next(this.patients);

    });
  }
  getPatient(id: string) {
    return this.http.get<{ _id: string, name: string, taj: number, dateOfBirth: Date }>(
      "http://localhost:3000/api/patients/" + id
    );
  }

}
