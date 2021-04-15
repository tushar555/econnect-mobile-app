import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaySlipDocumentsPage } from './pay-slip-documents';

@NgModule({
  declarations: [
    PaySlipDocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaySlipDocumentsPage),
  ],
})
export class PaySlipDocumentsPageModule {}
