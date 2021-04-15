import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrpoliciesPage } from './hrpolicies';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    HrpoliciesPage,
  ],
  imports: [
    IonicPageModule.forChild(HrpoliciesPage),
  ],
  providers: [Geolocation]
})
export class HrpoliciesPageModule { }
