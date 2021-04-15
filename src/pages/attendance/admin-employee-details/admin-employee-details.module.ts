import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AdminEmployeeDetailsPage } from "./admin-employee-details";
// import { DateTimeFormatPipe } from '../../../pipes/date-time-format/date-time-format';

import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminEmployeeDetailsPage
    // DateTimeFormatPipe
  ],
  imports: [IonicPageModule.forChild(AdminEmployeeDetailsPage), PipesModule]
})
export class AdminEmployeeDetailsPageModule {}
