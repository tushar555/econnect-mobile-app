import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendanceDetailsPage } from './attendance-details';
import { MyApp } from '../../../app/app.component';
import { IonicApp } from 'ionic-angular/components/app/app-root';

@NgModule({
  declarations: [
    AttendanceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendanceDetailsPage),
  ]
})
export class AttendanceDetailsPageModule {}
