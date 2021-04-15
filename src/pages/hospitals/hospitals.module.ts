import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HospitalsPage } from './hospitals';
import { FilterPipe } from "../../pipes/filter/filter";

@NgModule({
  declarations: [
    HospitalsPage,
    FilterPipe
  ],
  imports: [
    IonicPageModule.forChild(HospitalsPage),
  ],
})
export class HospitalsPageModule {}
