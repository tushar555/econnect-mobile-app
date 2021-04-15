import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalaryCardPage, NewPipe } from './salary-card';

@NgModule({
  declarations: [
    SalaryCardPage,
    NewPipe
  ],
  imports: [

    IonicPageModule.forChild(SalaryCardPage),
  ],
})
export class SalaryCardPageModule { }
