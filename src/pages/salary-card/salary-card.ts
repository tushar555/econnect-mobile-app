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
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { HttpClient } from "@angular/common/http";
import { PostService } from "../../providers/api/PostService";
import { Storage } from "@ionic/storage";
import { Pipe, PipeTransform } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var window;

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
  selector: "page-salary-card",
  templateUrl: "salary-card.html"
})
export class SalaryCardPage {
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _plt: Platform,
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
      // window.screen.orientation.lock('landscape');
      window.screen.orientation.lock("landscape-primary");
    });
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
    });
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

  ionViewDidLoad() {
    this.postService.presentLoadingDefault();

    this.postService
      .getCurrentTime()
      .then((newdate: any) => {
        this.postService.getUserDetails().then((user: any) => {
          this.date = new Date(newdate);
          this.year = this.date.getFullYear();
          this.month = this.date.getMonth();

          this.name = user.userName;
          this.location = user.userLocation;
          this.userToken = user.tokenid;
          this.designation = user.JobTitle;
          console.log("xcvxcvxcv", this.designation);

          for (let i = 0; i <= 2; i++) {
            console.log(this.date.getFullYear() - i);
            this.yearsArray.push(this.date.getFullYear() - i);
          }

          this.initializeMonths();
          this.initializeArray();
          this.postService.loading.dismiss();
          this.onChange(this.date.getFullYear());
        });
      })
      .catch(error => {
        this.postService.loading.dismiss();
        this.navCtrl.pop();
        this.postService.presentToast(error);
      });
    this.SalaryCardHeight = document.getElementById("userData").offsetHeight;
    this.SalaryCardHeight =
      this.platform.height() - this.SalaryCardHeight - 210;
    console.dir(this.SalaryCardHeight);
  }

  // Create Pdf File object

  getSalarycardDetails() {
    this.initializeArray();
    this.total = 0;
    this.postService.presentLoadingDefault();
    this.zone.run(() => {
      this.postService.getUserDetails().then((user: any) => {
        const details = { tokenId: user.tokenid, year: parseInt(this.year) };

        this.postService
          .getData("SalaryCard/getSalaryCard", details)
          .then((data: any) => {
            this.totalArr = [];
            this.responseArr = data.Months;

            for (let i = 0; i < this.responseArr.length; i++) {
              let total = this.responseArr[i].Data.reduce(
                (sum, item) => sum + item.Amount,
                0
              );
              console.log("total", total);
              this.totalArr.push(total);
            }
            console.log("totalArr: ", this.totalArr);
            this.postService.loading.dismiss();
          });
      });
    });
  }

  countElement(arr, key) {
    return arr.reduce((n, x) => n + (x.WageType === key), 0);
    // return arr.reduce(this.abcd);
  }

  getTotalAmountByID(nameKey, tempArray: Array<{ any }>) {
    let sum = 0;

    tempArray
      .map(function(e: any) {
        return { Wage: e.WageType, Amount: e.Amount };
      })
      .forEach(item => {
        if (item.Wage === nameKey) sum += item.Amount;
      });
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

  createPDF() {
    this.postService.presentLoadingDefault();
    var docDefinition = {
      content: [
        { text: "Pay Slip", style: "header" },
        { text: new Date().toTimeString(), alignment: "right" },

        { text: "For the Date", style: "subheader" },
        { text: this.year },

        { text: "Amount ₹", style: "subheader" },
        (this.totalEarnings - this.totalDeductions).toLocaleString(),

        { text: "Employee Details", style: "subheader" },
        {
          ul: [
            "Name       :" + this.name,
            "ID         :" + this.userToken,
            "Designation :" + this.designation,
            "Location   :" + this.location
          ],
          margin: [0, 0, 0, 15]
        },

        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 2,
            widths: ["*", "*", "*"],
            style: "table",
            body: this.gettable()
          }
        },
        {
          text:
            "Total Net Pay " +
            (this.totalEarnings - this.totalDeductions).toLocaleString(),
          style: "amount"
        }
        // { text: 'One Lakh three thousand one hundred and fifty', style: "amount_word" }
      ],
      styles: {
        amount_word: {
          fontSize: 10,
          alignment: "center",
          margin: [0, 5, 0, 0]
        },
        amount: {
          fontSize: 15,
          bold: true,
          alignment: "center",
          margin: [0, 10, 0, 0]
        },
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: "center",
          width: "50%"
        },
        table: {
          margin: [10, 10, 10, 10]
        }
      }
    };
    // this is the pdf file object which is important for all.
    this.pdfObj = pdfMake.createPdf(docDefinition);
    if (this.pdfObj !== null) {
      this.downloadPDF();
    }
  }

  downloadPDF() {
    if (this._plt.is("cordova")) {
      //  alert("Hello " + this.file.dataDirectory);
      this.pdfObj.getBuffer(
        buffer => {
          var blob = new Blob([buffer], { type: "application/pdf" });

          // Save the PDF to the data Directory of App
          this.file
            .writeFile(this.file.dataDirectory, "Payslip.pdf", blob, {
              replace: true
            })
            .then(fileEntry => {
              // Open the PDf
              this.postService.dismissLoading();
              this.fileOpener.open(
                this.file.dataDirectory + "Payslip.pdf",
                "application/pdf"
              );
              // this.postService.loading.dismiss();
            })
            .catch(error => {
              this.postService.dismissLoading();
              this.postService.presentToast("Something went wrong!");

              //this.postService.loading.dismiss();
            });
        },
        (error: Error) => {
          this.postService.presentToast("Something went wrong!");
          this.postService.dismissLoading();
          //this.postService.loading.dismiss();
        }
      );
    } else {
      // On a browser directly download!
      this.pdfObj.open();
      //  this.loading.dismiss();
      this.postService.dismissLoading();
      //this.postService.loading.dismiss();
    }
  }

  check(wageIdentifier: string) {
    if (wageIdentifier.indexOf("EARNING") > -1) return "earn";
    else if (wageIdentifier.indexOf("DEDUCTION") > -1) return "deduct";
  }

  gettable() {
    var tempObj = [];
    var bodyData = [];
    tempObj.push(
      { text: "Descriptions", bold: true, fillColor: "#CCCCCC" },
      { text: "Earnings", bold: true, fillColor: "#CCCCCC" },
      { text: "Deductions", bold: true, fillColor: "#CCCCCC" }
    );

    bodyData.push(tempObj);
    tempObj = [];
    for (let i = 0; i < this.paymentData.length; i++) {
      var tempArr = [];

      tempArr.push(this.paymentData[i].description);
      if (this.check(this.paymentData[i].wageIdentifier) === "earn") {
        tempArr.push(this.paymentData[i].amount.toLocaleString());
        tempArr.push(" ");
      }
      if (this.check(this.paymentData[i].wageIdentifier) === "deduct") {
        tempArr.push(" ");
        tempArr.push(this.paymentData[i].amount.toLocaleString());
      }

      bodyData.push(tempArr);
    }

    tempObj.push(
      { text: "Total", bold: true, fillColor: "#CCCCCC" },
      {
        text: this.totalEarnings.toLocaleString(),
        bold: true,
        fillColor: "#CCCCCC"
      },
      {
        text: this.totalDeductions.toLocaleString(),
        bold: true,
        fillColor: "#CCCCCC"
      }
    );
    bodyData.push(tempObj);

    return bodyData;
  }
  ionViewDidLeave() {
    console.log("in leave");
    window.screen.orientation.lock("portrait");
  }
}
