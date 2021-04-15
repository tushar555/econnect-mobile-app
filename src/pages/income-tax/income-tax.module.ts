import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomeTaxPage, NewPipe } from './income-tax';

@NgModule({
  declarations: [
    IncomeTaxPage,
    NewPipe
  ],
  imports: [
    IonicPageModule.forChild(IncomeTaxPage),
  ],
})
export class IncomeTaxPageModule { }
