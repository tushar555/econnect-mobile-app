import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPaySlipPage } from './my-pay-slip';

@NgModule({
  declarations: [
    MyPaySlipPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPaySlipPage),
  ],
})
export class MyPaySlipPageModule {}
