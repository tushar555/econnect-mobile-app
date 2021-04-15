import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LoginPage } from "./login";
import { ComponentsModule } from "../../components/components.module";
import { PinDialarComponent } from "../../components/pin-dialar/pin-dialar";
//import { PinDialarComponent } from "../../components/pin-dialar/pin-dialar";
//import { PinDialarComponent } from "../../components/pin-dialar/pin-dialar";

@NgModule({
  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage), ComponentsModule]
})
export class LoginPageModule {}
