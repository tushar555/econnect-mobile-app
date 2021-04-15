import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayDetailsPage } from './day-details';

@NgModule({
  declarations: [
    DayDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DayDetailsPage),
  ],
})
export class DayDetailsPageModule {}
