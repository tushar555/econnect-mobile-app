import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserEmergencyContactPage } from './user-emergency-contact';

@NgModule({
  declarations: [
    UserEmergencyContactPage,
  ],
  imports: [
    IonicPageModule.forChild(UserEmergencyContactPage),
  ],
})
export class UserEmergencyContactPageModule {}
