import { PostService } from "../../../providers/api/PostService";
import { Component, NgZone, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  LoadingController,
  AlertController,
  ToastController,
  Searchbar
} from "ionic-angular";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import { AdminEmployeeDetailsPage } from "../admin-employee-details/admin-employee-details";
declare var window;

/**
 * Generated class for the AdminAttendancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Pipe({ name: "inrFormat" })
export class NewPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return 0;
    else return value.toLocaleString();
    //else return value.toLocaleString("hi-IN");
  }
}

@IonicPage()
@Component({
  selector: "page-admin-attendance",
  templateUrl: "admin-attendance.html"
})
export class AdminAttendancePage {
  @ViewChild('mySearchbar') searchbar: Searchbar;
  companyName: any;
  totalArr: any = [];
  monthArr: any = [];
  amountArr: any = [];
  salaryCardList: any = [];
  responseArr: any;
  designation: any;
  value3: any[];

  paymentData: any = [];

  pdfObj = null;
  loading: any;
  link: any;
  date: any;
  monthsArray: any = [];
  yearsArray = [];
  year: any;
  month: any;
  totalEarnings: number = 0;
  totalDeductions: number = 0;
  name: any;
  location: any;
  userToken: any;
  total: any;
  counter = [];
  SalaryCardHeight: any;
  ionDTmd: string;
  ionDTmdMax: string;
  private ionDTMin: string;
  today: string;
  weeks: any;
  public openFooter: boolean = false;
  FlexiAll: any;
  responseArrAll: any;
  searchItem: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileOpener: FileOpener,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public zone: NgZone,
    public http: HttpClient,
    public postService: PostService,
    public storage: Storage,
    public platform: Platform
  ) {
    platform.ready().then(readySource => {
      //window.screen.orientation.lock("landscape");
      window.screen.orientation.lock("landscape-primary");
    });
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
    });
    console.dir("attendance contructor");
    this.ionDTmd = moment().toISOString();
    this.today = moment(new Date().toString()).format();
    this.date = new Date(moment(new Date().toString()).format());
    this.ionDTMin = moment(new Date())
      .subtract(2, "years")
      .toISOString();
    this.ionDTmdMax = moment(new Date().toString()).toISOString();
  }
  initializeArray() {
    this.paymentData = [];
  }

  initializeMonths() {
    this.monthsArray = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Augast",
      "September",
      "October",
      "November",
      "December"
    ];
  }
  ionDateTimeChange() {
    // alert(123);
    this.date = moment(this.ionDTmd).toDate();
    this.getSalarycardDetails();
    console.log(this.date);
  }
  onChange(event) {
    if (event === this.date.getFullYear()) {
      let month = [];
      for (let i = 0; i < this.date.getMonth(); i++) {
        month.push(this.monthsArray[i]);
      }
      this.monthsArray = month;
    } else {
      this.initializeMonths();
    }
    this.getSalarycardDetails();
  }

  ionViewDidEnter() {
    console.dir("did load");
    // this.postService.presentLoadingDefault();

    this.getSalarycardDetails();
  }

  // Create Pdf File object

  getSalarycardDetails() {

    this.initializeArray();
    this.total = 0;
    //  this.postService.presentLoadingDefault();
    this.postService.presentLoadingDefault();

    this.zone.run(() => {
      this.postService.getUserDetails().then((user: any) => {
        // const details = { 'tokenId': user.tokenid, 'year': parseInt(this.year) };
        // console.dir(moment(this.date).get('month')+1, moment(this.date).get('year'));
        const details = {
          tokenid: user.tokenid,
          emptokenid: null,
          year: moment(this.date).get("year"),
          month: moment(this.date).get("month") + 1
        };
        this.postService
          .getData("Attendance/getEmpAttendanceMonthWeek", details)
          .then((resp: any) => {
            this.totalArr = [];
            this.responseArr = resp.data;
            this.responseArrAll=resp.data;
            this.weeks = this.responseArr[0].Weeks;

             if(this.searchItem !== undefined && this.searchItem!==''){
              this.searchbar.clearInput(null);
              this.searchItem='';
             }
            console.log("totalArr: ", this.responseArr);
            // this.postService.loading.dismiss();
            this.postService.dismissLoading();
          });
      });
    });
  }
  searchFn(ev: any) {

    this.responseArr = [];
    console.dir(ev.target.value);
     this.searchItem=ev.target.value;
    for (var i = 0; i < this.responseArrAll.length; i++) {
      console.dir(
          this.responseArrAll[i].EmployeeName.indexOf(this.searchItem) >= 0
      );

      if (this.responseArrAll[i].TokenID.indexOf(this.searchItem) >= 0 ||
        this.responseArrAll[i].EmployeeName.toLowerCase().indexOf(
          this.searchItem.toLowerCase()
        ) >= 0
      ) {
        this.responseArr.push(this.responseArrAll[i]);
      }
      if (this.responseArrAll.length >= 1) {
     //   this.showCross = true;
      } else {
     //   this.showCross = false;
      }
    }

  }

  reset(ev:any) {
    this.responseArr=this.responseArrAll;
    console.log("reset");
  }

  setEndDatePickerClass() {
    //this.endDatePicker._elementRef.nativeElement.className
  }
  countElement(arr, key) {
    return arr.reduce((n, x) => n + (x.WageType === key), 0);
    // return arr.reduce(this.abcd);
  }
  // console.log(countInArray([1,2,3,4,4,4,3], 4)); // 3

  getTotalAmountByID(nameKey, tempArray: Array<{ any }>) {
    let sum = 0;

    tempArray
      .map(function(e: any) {
        return { Wage: e.WageType, Amount: e.Amount };
      })
      .forEach(item => {
        if (item.Wage === nameKey) sum += item.Amount;
      });

    // for (var i = 0; i < tempArray.length; i++) {
    //   if (tempArray[i].WageType === nameKey) {
    //     sum += tempArray[i].Amount;
    //   }
    // }

    return sum;
  }

  createToast(error) {
    //alert(error);
    let message =
      error === false ? "No Network Connection.." : "Something Went Wrong..";
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

  check(wageIdentifier: string) {
    if (wageIdentifier.indexOf("EARNING") > -1) return "earn";
    else if (wageIdentifier.indexOf("DEDUCTION") > -1) return "deduct";
  }

  ionViewDidLeave() {
    // alert(window.location.href);
    console.dir(this.navCtrl.getActive().name);
    if (this.navCtrl.getActive().component !== AdminEmployeeDetailsPage) {
      window.screen.orientation.lock("portrait");
    }
  }
  employeeDetails(data, data1) {
    if (data1.WeeklyHours == null) {
      this.postService.presentToast("No week data available");
      return false;
    }
    console.dir(data);
    data["curWeek"] = data1;
    this.navCtrl.push("AdminEmployeeDetailsPage", { empData: data });
  }
}
