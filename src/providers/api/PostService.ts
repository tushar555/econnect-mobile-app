import { EventEmitter, Injectable, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs";
import {
  AlertController,
  Events,
  LoadingController,
  NavController,
  ToastController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { AuthProvider } from "../auth/auth";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class PostService {
  userEmail: any;
  userLocation: string;
  userName: string;

  @ViewChild("appNav") nav: NavController;
  //apiUrl="http://mfcslcif.cloudapp.net/MFCSL_Development2/api/";
  apiUrl = "https://mmfss-econnectweb.azurewebsites.net/api/"; //UAT
  //apiUrl = "https://mmfslweconnect.azurewebsites.net/api/"; //Production
  data: any = {};
  networkState: any;
  public loading: any;
  AttendanceCall: EventEmitter<number> = new EventEmitter();
  public detailValue: any;
  public messageSource = new BehaviorSubject<any>(this.detailValue);
  public networkmessageSource = new BehaviorSubject<any>(this.networkState);
  state: any;
  public tokenid: any;
  private locationName: any;

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private _storage: Storage,
    public auth: AuthProvider,
    public event: Events,
    public alertCtrl: AlertController
  ) {
    this.detailValue = this.messageSource.asObservable();
    this.networkState = this.networkmessageSource.asObservable();
    this.networkState.subscribe(data => {
      this.state = data;
    });
  }

  setUserDetails() {
    let promise = new Promise((resolve, reject) => {
      this._storage.get("username").then(data => {
        this.auth.decrypt(data).then((dt: any) => {
          dt = JSON.parse(dt);
          this.tokenid = dt.TokenId;
          this.userName = dt.FirstName + " " + dt.LastName;
          this.userLocation = dt.CompanyName + ", " + dt.LocationName;
          this.userEmail = dt.Email;
          this.locationName = dt.LocationName;
          resolve(true);
        });
      });
    });

    return promise;
  }

  getUserDetails() {
    let promise = new Promise(resolve => {
      this._storage.get("username").then(
        data => {
          if (data) {
            this.auth.decrypt(data).then(
              (dt: any) => {
                dt = JSON.parse(dt);
                resolve({
                  tokenid: dt.TokenId,
                  userName: dt.FirstName + " " + dt.LastName,
                  userLocation: dt.CompanyName + ", " + dt.LocationName,
                  userEmail: dt.userEmail,
                  JobTitle: dt.JobTitle,
                  authtoken: dt.authtoken,
                  isHOEmp: dt.isHOEmp,
                  companyName: dt.CompanyName,
                  locationName: dt.LocationName,
                  manager: dt.ModulesAdmin,
                  isCSR: dt.IsCSR,
                  CSRURL: dt.CSRURL,
                  IsGiftEligible: dt.IsGiftEligible
                });
              },
              err => {}
            );
          } else {
            resolve(null);
          }
        },
        err => {}
      );
    });
    return promise;
  }

  setPinStatus(pinStatus) {
    let promise = new Promise(resolve => {
      this._storage.set("pinStatus", pinStatus).then(() => {
        resolve(true);
      });
    });
    return promise;
  }

  getPinStatus() {
    let promise = new Promise((resolve, reject) => {
      this._storage.get("pinStatus").then(data => {
        resolve(data);
      });

      // this._storage.get("IsPinAvailable").then(resp => {
      //   debugger;

      // });
    });
    return promise;
  }

  getCurrentTime() {
    // if (this.state) {
    return new Promise((resolve, reject) => {
      this.getHeaders().then((authtoken: any) => {
        this.http
          .get(this.apiUrl + "/Attendance/GetServerDateTime", {
            headers: authtoken,
            observe: "response"
          })
          .subscribe(
            res => {
              resolve(res.body);
            },
            err => {
              if (err.status === 401) {
                this.event.publish("user:logout");
                reject("Your session has been expired! Please login again.");
              } else if (err.status == 500) {
                reject("Internal server error! Please try again later.");
              } else if (err.statusText === "Unknown Error") {
                reject("No Internet Connection!");
              } else {
                reject(
                  "We are facing some issues in processing your request. Please try again later."
                );
              }
              // this.dismissLoading();
            }
          );
      });
    });
    // } else {
    //   return new Promise((reject) => {
    //     throw new Error('No Internet Connection!');
    //   });
    // }
  }

  getData(postUrl, params) {
    return new Promise((resolve, reject) => {
      this.getHeaders()
        .then((authHeaders: any) => {
          this.http
            .post(this.apiUrl + "" + postUrl, params, {
              headers: authHeaders,
              observe: "response"
            })
            .timeout(30000)
            .subscribe(
              (res: any) => {
                if (res.body && postUrl !== "Account/CheckAppVersion") {
                  this.refreshToken(res.headers.get("authtoken"));
                }
                if (res.body) resolve(res.body);
                else {
                  reject("Internal server error! Please try again later.");
                }
              },
              err => {
                console.log(err);

                if (err.status === 401) {
                  this.event.publish("user:logout");
                  reject("Your session has expired. Please login again.");
                } else if (err.status == 500) {
                  reject("Internal server error! Please try again later.");
                } else if (err.statusText === "Unknown Error") {
                  reject("No Internet Connection!");
                } else {
                  reject(
                    "We are facing some issues in processing your request. Please try again later."
                  );
                }
                // this.dismissLoading();
              }
            );
        })
        .catch(err => {
          this.dismissLoading();
        });
    });
  }

  getHeaders() {
    let promise = new Promise(resolve => {
      this.getSecureToken().then(
        (dt: any) => {
          if (dt == null)
            resolve({ "Content-Type": "application/json", platform: "m" });
          else
            resolve({
              "Content-Type": "application/json",
              Authorization: "Bearer " + dt,
              platform: "m"
            });
        },
        err => {}
      );
    });
    return promise;
  }

  getSecureToken() {
    let promise = new Promise(resolve => {
      this._storage.get("username").then(
        userdata => {
          this.auth.decrypt(userdata).then(
            (dt: any) => {
              dt = JSON.parse(dt);
              resolve(dt.authtoken);
            },
            err => {
              resolve(null);
            }
          );
        },
        err => {
          resolve(null);
        }
      );
    });
    return promise;
  }

  presentAlert(title, message, text, successHandler) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: text,
          handler: successHandler
        }
      ]
    });
    alert.present();
  }

  presentConfirmAlert(ptitle, pmessage, ptext, cancelHandler, successHandler) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      message: pmessage,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: cancelHandler
        },
        {
          text: ptext,
          handler: successHandler
        }
      ]
    });
    alert.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "center"
    });
    toast.onDidDismiss(() => {});

    toast.present();
  }

  presentLoadingDefault() {
    console.log("in loading");
    // if (this.loading) {
    //     this.loading.dismiss();
    //     this.loading = null;
    // }

    this.loading = this.loadingCtrl.create({
      content: "Please Wait..."
      // dismissOnPageChange: true
    });
    this.loading.present();
    // this.loading = this.loadingCtrl.create({
    //   content: 'Please wait...',
    //   dismissOnPageChange: true
    // });
  }

  dismissLoading() {
    console.log("LLLLLLLLLLLL");

    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  emitAttendance() {
    this.AttendanceCall.emit();
  }

  refreshToken(arg: any): any {
    this._storage.get("username").then(userdata => {
      this.auth.decrypt(userdata).then((dt: any) => {
        dt = JSON.parse(dt);
        dt.authtoken = arg;
        dt = JSON.stringify(dt);
        this.auth.encrypt(dt).then(edt => {
          this._storage.set("username", edt);
        });
      });
    });
  }
}
