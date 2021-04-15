import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendancePolicyPage } from './attendance-policy';

@NgModule({
  declarations: [
    AttendancePolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendancePolicyPage),
  ],
})
export class AttendancePolicyPageModule {}
