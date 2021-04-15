import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlexiPage } from './flexi';

@NgModule({
  declarations: [
    FlexiPage,
  ],
  imports: [
    IonicPageModule.forChild(FlexiPage),
  ],
})
export class FlexiPageModule {}
