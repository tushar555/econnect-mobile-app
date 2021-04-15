import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentPayslipPage, NewPipe } from './current-payslip';
@NgModule({
  declarations: [
    CurrentPayslipPage,
    NewPipe,
  ],
  imports: [
    IonicPageModule.forChild(CurrentPayslipPage)
  ],
})
export class CurrentPayslipPageModule { }
