import { NgModule } from "../../node_modules/@angular/core";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule, MatSortModule, MatDialogModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule, MatNativeDateModule, MatPaginatorModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';


@NgModule({
    //az import automatikus
    exports: [
        MatExpansionModule,
        MatButtonModule,
        MatListModule,
        MatMenuModule,
        MatTabsModule,
        MatGridListModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatSortModule,
        MatIconModule,
        MatDialogModule,
        MatCheckboxModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatNativeDateModule,
        MatPaginatorModule
    ]
})
export class AngularMaterialModule {}