import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalaryStatementPage } from './salary-statement';

@NgModule({
  declarations: [
    SalaryStatementPage,
  ],
  imports: [
    IonicPageModule.forChild(SalaryStatementPage),
  ],
})
export class SalaryStatementPageModule {}
