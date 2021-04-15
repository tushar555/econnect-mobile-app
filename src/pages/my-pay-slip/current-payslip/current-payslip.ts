import { Component, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  LoadingController,
  AlertController,
  ToastController
} from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import { PostService } from "../../../providers/api/PostService";
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
/*

install File, File Opener plugin and for pdf PDFMake library using npm
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
  selector: "page-current-payslip",
  templateUrl: "current-payslip.html"
})
export class CurrentPayslipPage {
  companyName: any;
  designation: any;
  pdfSrc: string;
  value3: any[];

  paymentData: any = [];

  pdfObj = null;
  loading: any;
  link: any;
  date = new Date();
  monthsArray: Array<any> = [];
  yearsArray = [];
  year: any;
  month: any;
  totalEarnings: number = 0;
  totalDeductions: number = 0;
  name: any;
  location: any;
  userToken: any;
  total: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public zone: NgZone,
    public http: HttpClient,
    public postService: PostService,
    public sanitize: DomSanitizer
  ) {
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
      // alert("compan:"+this.companyName);
    });
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
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
  }

  onChange(event) {
    if (event === this.date.getFullYear()) {
      let month = [];
      for (let i = 0; i <= this.date.getMonth() - 1; i++) {
        month.push(this.monthsArray[i]);
      }
      console.log("MONTHSSS", this.date.getMonth());

      this.monthsArray = month;
    } else {
      this.initializeMonths();
    }
  }

  ionViewDidLoad() {
    this.postService.presentLoadingDefault();
    this.postService
      .getCurrentTime()
      .then((newDate: any) => {
        this.postService.getUserDetails().then((data: any) => {
          this.date = new Date(newDate);
          this.year = this.date.getFullYear();
          this.month = this.date.getMonth();

          this.name = data.userName;
          this.location = data.userLocation;
          this.userToken = data.tokenid;
          this.designation = data.JobTitle;

          for (let i = 0; i <= 2; i++) {
            this.yearsArray.push(this.date.getFullYear() - i);
          }
          this.postService.loading.dismiss();

          this.initializeMonths();
          this.onChange(this.date.getFullYear());
        });
      })
      .catch(error => {
        this.postService.loading.dismiss();
        this.navCtrl.pop();
        this.postService.presentToast(error);
      });
  }

  // Create Pdf File object
  downloadPdf2(month) {
    console.log("datadata", month);

    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      let data = {
        tokenId: user.tokenid,
        year: this.year,
        month: this.monthsArray.indexOf(month) + 1
      };
      console.log("datadata", data, this.monthsArray.indexOf(month));
      this.postService
        .getData("SalaryCard/getSalarySlip", data)
        .then((respdata: any) => {
          if (respdata.Message === "Success" || respdata.Message === null) {
            this.postService.loading.dismiss();
            if (respdata.data.length > 0) {
              this.postService.loading.dismiss();
              this.navCtrl.push("PaySlipDocumentsPage", {
                data: respdata.data
              });
            } else {
              // this.postService.loading.dismiss();
              this.postService.presentToast(
                "No payslip available for this month."
              );
            }
          } else {
            this.postService.loading.dismiss();
            this.postService.presentToast("Sorry Data is Not Present!");
          }
        })
        .catch(error => {
          this.postService.loading.dismiss();
          this.postService.presentToast(error);
        });
    });
  }
}
