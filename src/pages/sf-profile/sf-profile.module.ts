import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SfProfilePage } from "./sf-profile";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [SfProfilePage],
  imports: [IonicPageModule.forChild(SfProfilePage), ComponentsModule]
})
export class SfProfilePageModule {}
