import { NgModule } from "@angular/core";
import { PinDialarComponent } from "./pin-dialar/pin-dialar";
import { IonicModule } from "ionic-angular";
import { PinSetFormComponent } from "./pin-set-form/pin-set-form";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [PinDialarComponent, PinSetFormComponent],
  imports: [IonicModule, FormsModule, ReactiveFormsModule],
  exports: [PinDialarComponent, PinSetFormComponent],
  entryComponents: [PinDialarComponent, PinSetFormComponent]
})
export class ComponentsModule {}
