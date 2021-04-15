import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GiftAcknowledgementPage } from "./gift-acknowledgement";
// import { DateTimeFormatPipe } from '../../pipes/date-time-format/date-time-format';

@NgModule({
  declarations: [
    GiftAcknowledgementPage
    //DateTimeFormatPipe
  ],
  imports: [IonicPageModule.forChild(GiftAcknowledgementPage)]
})
export class GiftAcknowledgementPageModule {}
