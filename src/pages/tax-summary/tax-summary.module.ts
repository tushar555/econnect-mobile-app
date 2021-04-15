import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxSummaryPage, NewPipe } from './tax-summary';

@NgModule({
  declarations: [
    TaxSummaryPage,
    NewPipe
  ],
  imports: [
    IonicPageModule.forChild(TaxSummaryPage),
  ],
})
export class TaxSummaryPageModule { }
