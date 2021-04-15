import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminAttendancePage, NewPipe } from './admin-attendance';

@NgModule({
  declarations: [
    AdminAttendancePage,
    NewPipe
  ],
  imports: [
    IonicPageModule.forChild(AdminAttendancePage),
  ],
})
export class AdminAttendancePageModule {}
