import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomeTaxSetPage } from './income-tax-set';

@NgModule({
  declarations: [
    IncomeTaxSetPage,
  ],
  imports: [
    IonicPageModule.forChild(IncomeTaxSetPage),
  ],
})
export class IncomeTaxSetPageModule { }
