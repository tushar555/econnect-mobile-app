import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserNotficationPage } from './user-notfication';

@NgModule({
  declarations: [
    UserNotficationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserNotficationPage),
  ],
})
export class UserNotficationPageModule {}
