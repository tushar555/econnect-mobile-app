import {
  Component,
  NgZone,
  ViewChild,
 // Output,
  //EventEmitter
} from "@angular/core";
import {
 // IonicPage,
  Navbar,
  NavController,
  NavParams,
  ViewController,
  ModalController,
  Events
} from "ionic-angular";
import { PostService } from "../../providers/api/PostService";
// import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Storage } from "@ionic/storage";
import { FormBuilder, Validators } from "@angular/forms";
import { PinDialarComponent } from "../pin-dialar/pin-dialar";

/**
 * Generated class for the PinSetFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "pin-set-form",
  templateUrl: "pin-set-form.html"
})
export class PinSetFormComponent {
  @ViewChild(Navbar) navBar: Navbar;

  pinForm: any;
  tokenId: any;
  companyName: any;
  // private secureStorage: SecureStorage,
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _service: PostService,
    public storage: Storage,
    public zone: NgZone,
    public viewCtrl: ViewController,
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public event: Events
  ) {
    this._service.getUserDetails().then(userToken => {
      this.tokenId = userToken["tokenid"];
      this.companyName = userToken["companyName"];

      // alert("compan:"+this.companyName);
    });

    this.pinForm = this._fb.group({
      tokenid: [null, Validators.required],
      password: [null, Validators.required],
      pin: [null, Validators.required],
      reenterPin: [null]
    });

    event.subscribe("pin", newPin => {
      console.log("PINNNNNNNN", newPin);

      if (newPin.flag == "pin") {
        this.pinForm.patchValue({ pin: newPin.pin });
      }
      if (newPin.flag == "reenterpin") {
        this.pinForm.patchValue({ reenterPin: newPin.pin });
      }
    });

    setTimeout(() => {
      this.pinForm.patchValue({ tokenid: this.tokenId });
    }, 1000);
  }

  openPinDialar(flag) {
    let pinModal = this.modalCtrl.create(PinDialarComponent, {
      flag: flag
    });
    pinModal.present();
  }

  close() {
    this.viewCtrl.dismiss({ flag: "Successs" });
  }

  onSubmit() {
    if (this.pinForm.invalid) {
      this._service.presentToast("Please fill required fields.");
      return false;
    }
    if (this.pinForm.value.pin !== this.pinForm.value.reenterPin) {
      this._service.presentToast("Password Missmatch");
      return false;
    }

    this._service.presentLoadingDefault();
    let data = this.pinForm.value;

    this._service
      .getData("/Account/SetPin", data)
      .then((data: any) => {
        this._service.loading.dismiss();
        if (data.ResponseData === "Success") {
          this._service.presentToast("Your pin set successfully!");
          this.navCtrl.pop({
            animate: true,
            animation: "ios-transition",
            duration: 1000,
            direction: "back"
          });
          this.event.publish("Response", { message: "Success" });
        } else if (data.ResponseData === "Fail") {
          this._service.presentToast("Wrong SAP code or password.");
        } else if (data.ResponseData === "PasswordAlreadyExist") {
          this._service.presentToast(
            "This is your current Pin, Please try with another one."
          );
        }
      })
      .catch(error => {
        this._service.loading.dismiss();
        console.log("ERROR", error);
      });

    //console.log('ITEm', data);
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.pop({
        animate: true,
        animation: "ios-transition",
        duration: 1000,
        direction: "back"
      });
    };
  }
}
