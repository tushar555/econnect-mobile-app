import { HeaderPageModule } from './../header/header.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveTravelAllowancePage } from './leave-travel-allowance';

@NgModule({
  declarations: [
    LeaveTravelAllowancePage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveTravelAllowancePage),
    HeaderPageModule
  ],
})
export class LeaveTravelAllowancePageModule { }
