import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, ParamMap } from '@angular/router';
import { PatientsService } from '../../patients.service';
import { Patient } from '../../patient.model';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css']
})
export class PatientHeaderComponent implements OnInit {
  patient: Patient;
  id: string;
  isLoading = false;

  constructor(private patientsService: PatientsService, private route: ActivatedRoute) {
   }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.id = paramMap.get("id");
        this.patientsService.getPatient(this.id).subscribe(patientData => {
          this.isLoading = false;
          this.patient = {
            id: patientData._id,
            name: patientData.name,
            taj: patientData.taj,
            dateOfBirth: patientData.dateOfBirth
          };
        });
      }
    });
  }

}
