import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  AlertController
} from "ionic-angular";
import { GoogleMap } from "@ionic-native/google-maps";
import { PostService } from "../../../providers/api/PostService";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";
import { Constant } from "../../../providers/constant";

/**
 * Generated class for the AdminEmployeeDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// declare var google: any;
// declare var google;
declare var google: any;

@IonicPage()
@Component({
  selector: "page-admin-employee-details",
  templateUrl: "admin-employee-details.html"
})
export class AdminEmployeeDetailsPage {
  @ViewChild("logoutMap") mapLogoutElement: ElementRef;
  @ViewChild("loginMap") mapLoginElement: ElementRef;
  map;

  private empData: any;
  mapIn: GoogleMap;
  mapOut: GoogleMap;
  private latitudeIn: any;
  private longitudeIn: any;
  private latitudeOut: any;
  private longitudeOut: any;
  showLoginMap: boolean;
  attendanceData = [];
  showMapflag: any;
  selectAll: boolean = false;
  localUser: any;
  remarks: string;
  CountAprrovedReject: number;
  showFooterflag: boolean;
  mapSrc: any;
  loginMapSrc: any;
  logoutMapSrc: any;

  constructor(
    public navCtrl: NavController,
    public sanitizer: DomSanitizer,
    public navParams: NavParams,
    public platform: Platform,
    public postService: PostService,
    public alertCtrl: AlertController
  ) {
    // platform.ready().then((readySource) => {
    //   window.screen.orientation.lock('landscape');
    // })
    this.empData = {};
    this.empData.WeekStartDate = "";
    this.empData.WeekEndDate = "";
    this.empData = this.navParams.get("empData");
    this.postService.getUserDetails().then(userToken => {
      this.localUser = userToken;
      this.getAttendanceData();
    });
  }

  ionViewWillEnter() {
    console.log("ionViewDidLoad AdminEmployeeDetailsPage");
    this.platform.ready().then(readySource => {
      // alert('new');
      // window.screen.orientation.lock('landscape');
    });
  }

  // ionViewDidEnter() {
  //   this.platform.ready().then((readySource) => {
  //     window.screen.orientation.lock('landscape');
  //   })
  // }
  ionViewDidLeave() {
    //   window.screen.orientation.lock('portrait');
  }

  getAttendanceData() {
    console.log(this.empData, this.localUser);
    this.showFooterflag = true;
    // this.postService.presentLoadingDefault();
    let params = {
      tokenid: this.localUser.tokenid,
      emptokenid: this.empData.TokenID,
      year: moment(this.empData.curWeek.WeekEndDate).get("year"),
      month: moment(this.empData.curWeek.WeekEndDate).get("month") + 1,
      WeekDesc: this.empData.curWeek.WeekNo,
      WeekStartDate: this.empData.curWeek.WeekStartDate,
      WeekEndDate: this.empData.curWeek.WeekEndDate
    };
    console.log(params);
    this.postService
      .getData("Attendance/getEmpAttendanceWeekly", params)
      .then((resp: any) => {
        console.log(resp);
        this.attendanceData = resp.data;

        // this.postService.loading.dismiss();
        // this.attendanceData = [
        //   { check: true, AttendanceDate: '07-Apr-2019', TimeIn: '07-Apr-2019', TimeOut: '07-Apr-2019', LatLongIn: '17.23;82.092', LatLongOut: '79.93;82.092' },
        //   { check: false, AttendanceDate: '07-Apr-2019', TimeIn: '07-Apr-2019', TimeOut: '07-Apr-2019', LatLongIn: '17.23;82.092', LatLongOut: '79.93;82.092' },
        //   { check: true, AttendanceDate: '07-Apr-2019', TimeIn: '07-Apr-2019', TimeOut: '07-Apr-2019', LatLongIn: '17.23;82.092', LatLongOut: '79.93;82.092' },
        //   { check: false, AttendanceDate: '07-Apr-2019', TimeIn: '07-Apr-2019', TimeOut: '07-Apr-2019', LatLongIn: '17.23;82.092', LatLongOut: '79.93;82.092' }
        // ]
        if (this.attendanceData.length == 0) return false;
        this.empData.Department = this.attendanceData[0]["Department"];
        this.empData.LocationName = this.attendanceData[0]["LocationName"];
        this.CountAprrovedReject = 0;
        for (let i = 0; i <= this.attendanceData.length - 1; i++) {
          console.dir(this.attendanceData[i]["ApprovalStatus"]);
          if (
            this.attendanceData[i]["ApprovalStatus"] == "approved" ||
            this.attendanceData[i]["ApprovalStatus"] == "rejected"
          ) {
            this.CountAprrovedReject++;
            if (this.CountAprrovedReject == this.attendanceData.length) {
              this.showFooterflag = false;
            }
          }
        }
        console.dir(this.CountAprrovedReject);
        this.attendanceData.forEach((o, i, a) => {
          if (o["ApprovalStatus"] === null || o["ApprovalStatus"] === "pending")
            a[i]["IsChecked"] = false;
        });
      });
  }

  checkboxChange() {
    this.selectAll = !this.selectAll;
    this.attendanceData.forEach((o, i, a) => {
      if (o["ApprovalStatus"] === null || o["ApprovalStatus"] === "pending")
        a[i]["IsChecked"] = this.selectAll;
    });
  }

  takeRemarks(status) {
    let data = this.attendanceData.filter(
      book => book["IsChecked"] == true && book["ApprovalStatus"] === null
    );
    if (data.length > 0) {
      console.dir(this.attendanceData);
    } else {
      console.dir("not single selected");
      this.postService.presentToast("Please select any one of the above");
      return false;
    }

    let type =
      status === "approved"
        ? "Approve"
        : status === "rejected"
        ? "*Reject"
        : null;
    const prompt = this.alertCtrl.create({
      title: type + " Remarks",
      message: "",
      inputs: [
        {
          name: "remarks",
          placeholder: "Remarks",
          checked: false,
          id: "remarks12"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Submit",
          handler: data => {
            console.log(status, data);
            if (status === "rejected" && data.remarks === "") {
              this.postService.presentToast("Remarks is mandatory to reject.");
              return false;
            } else {
              console.log("call api");
              this.remarks = data.remarks;
              this.submit(status);
            }
          }
        }
      ]
    });
    prompt.present().then(() => {
      setTimeout(() => {
        console.log("blur");
        document.getElementById("remarks12").blur();
      }, 2);
    });
  }

  submit(status) {
    this.postService.presentLoadingDefault();
    let data = [];
    this.attendanceData.forEach((o, i, a) => {
      if (
        (o["ApprovalStatus"] === null || o["ApprovalStatus"] === "pending") &&
        o["IsChecked"] === true
      ) {
        a[i]["ApprovalStatus"] = status;
        data.push(o);
      }
    });
    let params = {
      TokenId: this.localUser.tokenid,
      EmpTokenId: this.empData.TokenID,
      Remarks: this.remarks,
      data: data
    };
    console.log(params);
    this.postService
      .getData("Attendance/ManagerApproveReject", params)
      .then(resp => {
        this.postService.loading.dismiss();
        console.log(resp);
        this.getAttendanceData();
      });
  }

  showMap(data) {
    // alert('sd');

    console.log(data);
    // if (data.latitudeIn || data.longitudeIn) {
    // this.showMapflag=true;
    // }
    if (
      data.LatLongIn === "0:0" ||
      data.LatLongOut === "0:0" ||
      data.LatLongIn === null ||
      data.LatLongOut === null
    ) {
      this.postService.presentToast("No map data available");
      return false;
    }

    this.showMapflag = true;
    this.empData.LatitudeIn = data.LatLongIn
      ? data.LatLongIn.split(":")[0]
      : "";
    this.empData.LongitudeIn = data.LatLongIn
      ? data.LatLongIn.split(":")[1]
      : "";
    this.empData.LatitudeOut = data.LatLongOut
      ? data.LatLongOut.split(":")[0]
      : "";
    this.empData.LongitudeOut = data.LatLongOut
      ? data.LatLongOut.split(":")[1]
      : "";

    setTimeout(() => {
      console.log("mapLoginElementmapLoginElement", this.mapLoginElement);
      this.latitudeIn = this.empData.LatitudeIn;
      this.longitudeIn = this.empData.LongitudeIn;
      this.latitudeOut = this.empData.LatitudeOut;
      this.longitudeOut = this.empData.LongitudeOut;
      console.log(
        "this.latitudeIn: " +
          this.latitudeIn +
          "|this.longitudeIn: " +
          this.longitudeIn +
          "|this.latitudeOut: " +
          this.latitudeOut +
          "|this.longitudeOut: " +
          this.longitudeOut
      );
      this.loadInMap();
    }, 500);
  }

  hideMap() {
    this.showMapflag = false;
  }
  loadInMap() {
    this.showLoginMap = true;
    this.loginMapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      Constant.mapUrl + this.latitudeIn + "," + this.longitudeIn
    );
    // let latLng = new google.maps.LatLng(this.latitudeIn, this.longitudeIn);
    // let mapOptions = {
    //   zoom: 18,
    //   center: latLng,
    //   mapTypeControl: false,
    //   draggable: true,
    //   scaleControl: false,
    //   navigationControl: false,
    //   zoomControl: false,
    //   disableDefaultUI: true,
    //   streetViewControl: false,
    //   fullscreenControl: false,
    //   panControl: false,
    //   clickableIcons: false,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    // };
    //debugger;
    //this.map = new google.maps.Map(this.mapLoginElement.nativeElement, mapOptions);
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

    // console.log("in loadMap");
  }

  loadOutMap() {
    this.showLoginMap = false;
    // @ViewChild('logoutMap') mapLogoutElement: ElementRef;
    console.log("out loadMap");
    this.logoutMapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      Constant.mapUrl + this.latitudeOut + "," + this.longitudeOut
    );

    // let latLng = new google.maps.LatLng(this.latitudeOut, this.longitudeOut);
    // let mapOptions = {
    //   zoom: 18,
    //   center: latLng,
    //   mapTypeControl: false,
    //   draggable: true,
    //   scaleControl: false,
    //   navigationControl: false,
    //   zoomControl: false,
    //   disableDefaultUI: true,
    //   streetViewControl: false,
    //   fullscreenControl: false,
    //   panControl: false,
    //   clickableIcons: false,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    // };
    // this.map = new google.maps.Map(this.mapLogoutElement.nativeElement, mapOptions);
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
  }

  getHours(timeOut, timeIn) {
    let totalMins = moment(timeOut).diff(moment(timeIn), "minutes");
    let hrs = Math.floor(totalMins / 60);
    let min = totalMins % 60;
    return (hrs < 10 ? "0" + hrs : hrs) + ":" + (min < 10 ? "0" + min : min);
  }
}
