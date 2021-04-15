
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HolidayPage } from './holiday';
import { MyApp } from '../../app/app.component';

@NgModule({
  declarations: [
    HolidayPage,
  ],
  imports: [
    IonicPageModule.forChild(HolidayPage)
  ]
})
export class HolidayPageModule { }
