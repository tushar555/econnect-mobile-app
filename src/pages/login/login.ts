import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController,
  ModalController,
  Events
} from "ionic-angular";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { Storage } from "@ionic/storage";
import { HomePage } from "../home/home";
import { PostService } from "../../providers/api/PostService";
import { PinDialarComponent } from "../../components/pin-dialar/pin-dialar";
import { Observable } from "rxjs";

//import { SecureStorage } from '@ionic-native/secure-storage';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  passwordType = "password";
  // passwordShown: boolean = false;
  showFooter: boolean = true;
  loginForm: any;
  loading: any;
  loginType: any;
  showPassword: any;
  responseDetails: any;
  alreadyClick = false;
  constructor(
   // private _http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _fd: FormBuilder,
    public auth: AuthProvider,
    private _storage: Storage,
    //private platform: Platform,
   // private app: App,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public postService: PostService,
    public event: Events
  ) {
    this.initializeLoginForm();
    // this.loginType = "normal";
    this.setloginType("normal");
    this.showFooter = true;
    event.subscribe("pin", newPin => {
      this.loginForm.patchValue({ pin: newPin.pin });
    });
  }

  Pin: String = "";
  ShowPin: Boolean = false;

  eventCapture(event) {
    this.ShowPin = false;
    this.Pin = event;
    console.log("PINN", this.Pin);
  }

  initializeLoginForm() {
    this.loginForm = this._fd.group({
      username: [null, Validators.required],
      password: [null, []],
      pin: [null, []]
    });
  }

  showPin() {
    this.ShowPin = !this.ShowPin;
  }
  setloginType(flag) {
    this.loginType = flag;
    console.log("************", this.loginType);
    this.initializeLoginForm();
    //  this.loginForm.controls.password.setValidator([Validators.required]);
    // this.loginForm.controls["password"].setValidators([Validators.minLength(1), Validators.maxLength(30)]);
    if (this.loginType == "normal") {
      this.loginForm.controls["pin"].setValidators([]);
      this.loginForm.controls["password"].setValidators([Validators.required]);
      this.loginForm.controls["pin"].updateValueAndValidity();
      this.loginForm.controls["password"].updateValueAndValidity();
    } else if (this.loginType == "with_pin") {
      this.loginForm.controls["password"].setValidators([]);
      this.loginForm.controls["pin"].setValidators([Validators.required]);
      this.loginForm.controls["password"].updateValueAndValidity();
      this.loginForm.controls["pin"].updateValueAndValidity();
    }

    // this.loginForm.patchValue({
    //   password: null,
    //   pin: null
    // });

    console.log(" this.loginForm. this.loginForm.", this.loginForm);
  }

  onForgotClick() {
    this.openAlertBox(
      "",
      "Please login with password and reset Pin from profile section."
    );
  }

  doLogin(overwriteSession?) {
    if (this.postService.networkState) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait..."
      });

      this.loading.present();

      let data = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        pin: this.loginForm.value.pin
      };
      this.auth
        .checkLogin(data, overwriteSession)
        .then((data: any) => {
          this.alreadyClick = false;
          this.loading.dismiss();
          if (data.isUserValid) {
            let storedata = JSON.stringify(data);
            //   debugger;
            this.auth.encrypt(storedata).then(dt => {
              this._storage.set("username", dt).then(resp => {
                this.postService.refreshToken(data.authtoken);
                this.postService.setUserDetails().then(res => {
                  //    debugger;

                  this.responseDetails;
                  this.postService
                    .setPinStatus(this.responseDetails)
                    .then(resp => {
                      //      debugger;
                      console.log("resp", resp);
                      this.navCtrl.setRoot(HomePage, { flag: "fromLogin" });
                    });
                });
                //  debugger;
              });
            });

            // let profileModal = this.modalCtrl.create("SfProfilePage", {
            //   isModal: true
            // });
            // profileModal.present();
            // profileModal.onDidDismiss(data => {
            //   console.log(data);
            //   this.navCtrl.setRoot(HomePage);
            // });
          } else {
            //this.presentToast('Please enter valid credentials');
            let alert = this.alertCtrl.create({
              title: "",
              message: "Please enter valid credentials",
              buttons: [
                {
                  text: "Ok",
                  role: "ok",
                  handler: () => {}
                }
              ]
            });
            alert.present();
          }
        })
        .catch(error => {
          console.log(error);
          this.alreadyClick = false;
          this.loading.dismiss();
          if (error.status === 409) {
            let alert = this.alertCtrl.create({
              title: "",
              message:
                "Seems like you have already logged in from another device. Are you sure you want to continue?",
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel",
                  handler: () => {}
                },
                {
                  text: "Continue",
                  handler: () => {
                    this.doLogin(true);
                    /*this.auth.checkLogin(data, true).then((data: any) => {
                  if (data.isUserValid) {
                    let storedata = JSON.stringify(data);
                    this.auth.encrypt(storedata).then((dt) => {
                      this._storage.set('username', dt).then(() => {
                        this.postService.refreshToken(data.authtoken);
                        this.postService.setUserDetails();
                      });
                    });
                    this.navCtrl.setRoot(HomePage);
                    this.loading.dismiss();
                  } else {
                    this.presentToast('Please enter valid credentials');
                  }
                });*/
                  }
                }
              ]
            });
            alert.present();
          } else if (error.status === 500) {
            this.loading.dismiss();
            this.presentToast("Internal Server Error. Please try again later");
          } else {
            this.loading.dismiss();
            this.presentToast("No Internet Connection!");
          }
        });
    } else {
      this.loading.dismiss();
      this.presentToast("No Internet Connection!");
    }
  }

  loginAction() {
    this.alreadyClick = true;
    // this.checkPinStatus().subscribe(
    //   success => {
    //     console.log("SUCCESS", success);
    this.doLogin();
    //   },
    //   error => {
    //     console.log("Error", error);
    //   }
    // );
  }

  checkPinStatus(): Observable<boolean> {
    function onSuccess(obs) {
      obs.next();
      obs.complete();
    }
    return new Observable(observer => {
      let data = {
        tokenid: this.loginForm.value.username
      };

      this.auth.checkPinStatus(data).then((resp: any) => {
        this.responseDetails = resp.ResponseData;

        console.log("********______________****", this.loginType);

        if (this.loginType === "with_pin") {
          this.alreadyClick = false;
          if (this.responseDetails.IsPinAvailable == "false") {
            this.openAlertBox(
              "Warning",
              "Seems like you have not set pin. Please set your Pin."
            );
            observer.error();
            observer.complete();
          } else if (this.responseDetails.IsPasswordChange == "true") {
            this.openAlertBox(
              "Warning",
              "Your pin is disabled, kindly reset it from profile section."
            );

            observer.error();
            observer.complete();
          } else if (this.responseDetails.isPinExpired) {
            this.openAlertBox(
              "Warning",
              "Your pin has been expired. kindly reset it from profile section."
            );
            observer.error();
            observer.complete();
          } else {
            onSuccess(observer);
          }
        } else {
          onSuccess(observer);
        }
      });
    });
  }
  openAlertBox(paramtitle, paramMessage) {
    let alert = this.alertCtrl.create({
      title: paramtitle,
      message: paramMessage,
      buttons: [
        {
          text: "Ok",
          role: "ok",
          handler: () => {
            //this.loginType = "normal";
          }
        }
      ]
    });
    alert.present();
  }

  openPinDialar() {
    let pinModal = this.modalCtrl.create(PinDialarComponent, {
      userId: 8675309
    });
    pinModal.present();
  }

  ionviewWillLeave() {
    this.loading.dismiss();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
    this.loading.dismiss();
  }

  footerToggle(type) {
    if (type == "hide") {
      this.showFooter = false;
    } else if (type == "show") {
      this.showFooter = true;
    } else {
      this.showFooter = true;
    }
  }
}
