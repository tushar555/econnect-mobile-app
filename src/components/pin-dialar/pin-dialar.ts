import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ViewController, Events, NavParams, Platform } from "ionic-angular";

/**
 * Generated class for the PinDialarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "pin-dialar",
  templateUrl: "pin-dialar.html"
})
export class PinDialarComponent {
  @Input() pagetitle: String = "Enter Pin";

  pin: string = "";

  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  flag: any;

  constructor(
    public viewCtrl: ViewController,
    public event: Events,
    public navParam: NavParams,
    platform: Platform
  ) {
    this.flag = navParam.get("flag");
    platform.registerBackButtonAction(() => {});
  }

  emitEvent() {
    if (this.pin != "") {
      this.event.publish("pin", { pin: this.pin, flag: this.flag });
      this.close();
      // this.change.emit(this.pin);
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  handleInput(pin: string) {
    if (pin === "clear") {
      this.pin = "";
      return;
    }

    if (this.pin.length === 4) {
      return;
    }
    this.pin += pin;
  }
}
