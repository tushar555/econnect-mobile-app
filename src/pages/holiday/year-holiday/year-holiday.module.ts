import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearHolidayPage } from './year-holiday';

@NgModule({
  declarations: [
    YearHolidayPage,
  ],
  imports: [
    IonicPageModule.forChild(YearHolidayPage),
  ],
})
export class YearHolidayPageModule {}
