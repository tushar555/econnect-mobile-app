import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftFormPage } from './gift-form';

@NgModule({
  declarations: [
    GiftFormPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftFormPage),
  ],
})
export class GiftFormPageModule {}
