import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  AlertController,
  IonicPage,
  NavController,
  Events
} from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleMaps } from "@ionic-native/google-maps";
import { PostService } from "../../../providers/api/PostService";
import { DatePipe } from "@angular/common";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Storage } from "@ionic/storage";
import * as moment from "moment";
import { AuthProvider } from "../../../providers/auth/auth";
import { Constant } from "../../../providers/constant";
import { DomSanitizer } from "@angular/platform-browser";
// declare var google
@IonicPage()
@Component({
  selector: "page-mark-attendance",
  templateUrl: "mark-attendance.html",
  providers: [GoogleMaps, DatePipe]
})
export class MarkAttendancePage {
  @ViewChild("map") mapElement: ElementRef;
  map;
  currentTime;
  private latitude: any;
  private longitude: any;
  private loginStatus: any = "I";
  private loginStatusDesc: string = "Punch In";
  private currentParamTime;
  companyName: any;
  mapSrc: any;
  constructor(
    private geolocation: Geolocation,
    public navCtrl: NavController,
    public storage: Storage,
    private alertCtrl: AlertController,
    private locationAccuracy: LocationAccuracy,
    private postService: PostService,
    public sanitizer: DomSanitizer,
    public datepipe: DatePipe,
    public event: Events,
    public auth: AuthProvider
  ) {
    console.log("MAP", this.mapSrc);

    // this.storage.get('username').then((val) => {
    //   this.userToken = val.TokenId;
    // });
    this.checkMarkAttendanceType();
    this.loadMap();
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
    });
  }

  ionViewDidLoad() {}

  pad(n) {
    return n < 10 ? "0" + n : n;
  }
  markAttendance() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(() => {
        this.postService.presentLoadingDefault();
        console.log("Request successful");
        console.log("in loadMap");
        this.geolocation
          .getCurrentPosition({ maximumAge: 60000, enableHighAccuracy: true })
          .then(resp => {
            console.log("resp data: ");
            console.log(resp);
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
            console.log("latitude: " + this.latitude);

            let dateObj = new Date(this.currentParamTime);
            let attendanceDate =
              dateObj.getFullYear() +
              "-" +
              this.pad(dateObj.getMonth() + 1) +
              "-" +
              this.pad(dateObj.getDate());
            console.log("attendanceDate: " + attendanceDate);
            this.postService.getUserDetails().then((user: any) => {
              /*let params = {
            "lst": [
              {
                "TokenNo": user.tokenid,
                "AttendanceDate": attendanceDate,
                "AttendanceTime": this.currentParamTime,
                "TimeType": this.loginStatus,
                "MachineID": "",
                "Lat": this.latitude,
                "Long": this.longitude,
                "Source": 2,
                "CreatedBy": this.postService.tokenid
              }
            ],
            "tokenid": user.tokenid
          };*/

              /*let params = {
            "TimeType": this.loginStatus,
            "MachineID": "",
            "Lat": this.latitude,
            "Long": this.longitude,
            "Source": 2,
            "tokenid": user.tokenid
          };
          console.log("AttendancePunchRequestList: ", params);*/
              this.auth.encrypt(this.latitude.toString()).then(lat => {
                console.log("encrypted lat: ", lat);
                this.auth.encrypt(this.longitude.toString()).then(long => {
                  console.log("encrypted long: ", long);
                  let params = {
                    TimeType: this.loginStatus,
                    MachineID: "",
                    Lat: lat,
                    Long: long,
                    Source: 2,
                    tokenid: user.tokenid
                  };
                  console.log("/Attendance/AttendenceAppPunch after: ", params);
                  // PunchAttendanceApp
                  this.postService
                    .getData("/Attendance/AttendenceAppPunch", params)
                    .then(response => {
                      console.log("response", JSON.stringify(response));
                      this.postService.dismissLoading();
                      let alert = this.alertCtrl.create({
                        subTitle:
                          this.loginStatusDesc +
                          " was successful" +
                          " on " +
                          moment(response["PunchedTime"]).format("HH:mm"),
                        buttons: [
                          {
                            text: "Ok",
                            cssClass: "btn-alert-ok btn-alert-full-width",
                            handler: () => {
                              alert.dismiss().then(() => {
                                this.postService.emitAttendance();
                                // this.event.publish('reload:Attendance', "1");
                                this.checkMarkAttendanceType();
                                this.navCtrl.pop();
                              });
                              return false;
                            }
                          }
                        ]
                      });
                      alert.present();
                    });
                });
              });
            });
          })
          .catch(error => {
            if (error.message === "Illegal Access") {
              this.presentAlert(
                "You need to enable location from app settings.",
                0
              );
            }
            this.postService.dismissLoading();
          });
      })
      .catch(error => {
        this.postService.dismissLoading();
        console.log("Error requesting location permissions", error);
        this.presentAlert(
          "You need to switch on your location to mark your attendance.",
          1
        );
      });
  }

  checkMarkAttendanceType() {
    this.postService.presentLoadingDefault();
    this.postService.getCurrentTime().then(response => {
      console.log("response: ", response);
      this.currentTime = response;
      this.currentParamTime = response;
      this.postService.getUserDetails().then((user: any) => {
        const params = JSON.stringify({
          tokenid: user.tokenid,
          AttendanceDate: this.currentTime
        });
        this.postService
          .getData("/Attendance/getPunchData", params)
          .then((response: any) => {
            console.log("GetDayAttendance response", JSON.stringify(response));

            if (response.TimeType == null) {
              this.loginStatusDesc = "Punch In";
              this.loginStatus = "I";
            }
            if (response.TimeType == "I") {
              this.loginStatusDesc = "Punch Out";
              this.loginStatus = "O";
            }
            if (response.TimeType == "O") {
              this.loginStatusDesc = "Punch Out";
              this.loginStatus = "O";
            }

            console.log("Login Status", this.loginStatus);
            console.log("Login Status DESC ", this.loginStatusDesc);
          });
      });
    });
  }
  loadMap() {
    /*    let param = {
      "TimeType":"I",
      "MachineID":"",
      "Lat":19.2007077,
      "Long":72.8682075,
      "Source":2,
      "tokenid":"23141713"
    };
    console.log("/Attendance/AttendenceAppPunch before: ",param);
    this.auth.encrypt("19.2007077").then((dt)=>{
      this.auth.encrypt("72.868207").then((dt1)=>{
        let param = {
          "TimeType":"I",
          "MachineID":"",
          "Lat":dt,
          "Long":dt1,
          "Source":2,
          "tokenid":"23141713"
        };
        console.log("/Attendance/AttendenceAppPunch after: ",param);
      });
    });*/
    console.log("in loadmap before accuracy");
    // this.postService.dismissLoading();
    /*this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {*/
    // the accuracy option will be ignored by iOS
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          console.log("Request successful");
          console.log("in loadMap");
          this.geolocation
            .getCurrentPosition({ maximumAge: 60000, enableHighAccuracy: true })
            .then(resp => {
              console.log("resp data: ");
              console.log(resp);
              this.latitude = resp.coords.latitude;
              this.longitude = resp.coords.longitude;
              console.log("latitude: " + this.latitude);
              /*let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: this.latitude,
              lng: this.longitude
            },
            zoom: 18,
            tilt: 30
          },
          gestures: {
            zoom: true,
            scroll: true,
            rotate: true,
            tilt: false
          },
          controls: {
            zoom: true,
            compass: true,
            indoorPicker: false,
            mapToolbar: false,
            myLocationButton: true
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };*/
              console.log(this.mapSrc, "this.mapSrc");

              this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
                Constant.mapUrl + this.latitude + "," + this.longitude
              );
              console.log(this.mapSrc, "this.mapSrc");
              // let mapOptions= {
              //   zoom: 18,
              //   center: latLng,
              //   mapTypeControl: false,
              //   draggable: true,
              //   scaleControl: false,
              //   navigationControl: false,
              //   zoomControl : false,
              //   disableDefaultUI: true,
              //   streetViewControl: false,
              //   fullscreenControl: true,
              //   panControl: false,
              //   clickableIcons: false,
              //   mapTypeId: google.maps.MapTypeId.ROADMAP,
              // };
              //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
              // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
              // console.log("after create");
              // if(this.mapSrc)
              if (this.mapSrc !== undefined) this.postService.dismissLoading();
              /*this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          this.postService.loading.dismiss();
          this.map.setMyLocationEnabled(true);
          console.log('Map is ready!');
        })
        .catch((error) => {
          console.log('Error in one', error);
          this.postService.loading.dismiss();
        });*/
              // var cityCircle = new google.maps.Circle({
              //   strokeColor: '#113bdd',
              //   strokeOpacity: 0.5,
              //   strokeWeight: 1,
              //   fillColor: '#113bdd',
              //   fillOpacity: 0.30,
              //   map: this.map,
              //   center: latLng,
              //   radius: 50
              // });
              // let marker = new google.maps.Marker({
              //   map: this.map,
              //   animation: google.maps.Animation.DROP,
              //   position: this.map.getCenter()
              // });
              // var self = this;
              // google.maps.event.addDomListener(this.map, 'idle', function() {
              //  var recenterButton = document.querySelector("#resetButtom");
              //   recenterButton.addEventListener("click", function() {
              //     //this.map.setCenter(marker.getPosition());
              //     //moveToLocation(myLat, myLng);
              //     self.map.panTo(myLocation);
              //   });
              // });
              // let content = "";

              // let infoWindow = new google.maps.InfoWindow({
              //   content: content
              // });
              // google.maps.event.addListener(marker, 'click', () => {
              //   infoWindow.open(this.map, marker);
              // });
            })
            .catch(error => {
              if (error.message === "Illegal Access") {
                this.presentAlert(
                  "You need to enable location from app settings.",
                  0
                );
              }
              this.postService.dismissLoading();
            });
        },
        error => {
          this.postService.dismissLoading();
          console.log("Error requesting location permissions", error);
          this.presentAlert(
            "You need to switch on your location to mark your attendance.",
            1
          );
        }
      )
      .catch(error => {
        this.postService.dismissLoading();
        console.log("Error requesting location permissions", error);
        this.presentAlert(
          "You need to switch on your location to mark your attendance.",
          1
        );
      });
    //}
    //});
  }
  /*  presentLoadingDefault() {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }*/
  presentAlert(message, flag) {
    let locationAlert = this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: "OK",
          handler: () => {
            if (flag === 1) this.loadMap();
            else this.navCtrl.pop();
          }
        }
      ]
    });
    locationAlert.present();
  }

  formatDate(date, format) {
    return moment(date).format(format);
  }
}
