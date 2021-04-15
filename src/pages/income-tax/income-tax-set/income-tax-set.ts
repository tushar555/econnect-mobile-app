import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PostService } from "../../../providers/api/PostService";
import { Storage } from "@ionic/storage";
import { FileOpener } from "@ionic-native/file-opener";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";

/**

 * Generated class for the IncomeTaxSetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.

 */

@IonicPage()
@Component({
  selector: "page-income-tax-set",
  templateUrl: "income-tax-set.html"
})
export class IncomeTaxSetPage {
  basic_salary: any = 0;
  net_salary: any = 0;
  setType: any;
  isMenuOpen: any;
  isMenuClosed: any;
  year: any;
  finalAmount: number = 0;
  public salary: number;
  public serverResponse: any;
  public setList: any;

  companyName: any;
  monthsArray: any = [];
  date: any;
  year1: any;
  name: any;
  location: any;
  userToken: any;
  total: any;
  designation: any;
  yearsArray = [];
  Calculator: any = "form16";

  constructor(
    public navCtrl: NavController,
    public fileOpener: FileOpener,
    public transfer: FileTransfer,
    public file: File,
    public navParams: NavParams,
    private postService: PostService,
    public _storage: Storage
  ) {
    // this.getDetails();
  }

  ionViewDidLoad() {
    this.postService.presentLoadingDefault();
    this.postService
      .getCurrentTime()
      .then((newDate: any) => {
        this.postService.getUserDetails().then((data: any) => {
          this.date = new Date(newDate);
          let currentYear = this.date
            .getFullYear()
            .toString()
            .substring(2);
          // this.year = this.date.getFullYear();

          for (let i = 0; i <= 2; i++) {
            // this.yearsArray.push(this.date.getFullYear() - i);
            this.yearsArray.push(
              this.date.getFullYear() -
                (i + 1) +
                "-" +
                (parseInt(currentYear) - i)
            );
          }
          this.postService.loading.dismiss();
        });
      })
      .catch(error => {
        this.postService.loading.dismiss();
        this.navCtrl.pop();
        this.postService.presentToast(error);
      });
  }

  loadCalendarView() {
    this.postService.presentToast("Coming Soon");

    //this.Calculator = 'calculator';
  }

  loadListView(value) {
    if (value == "taxsheet") {
      this.postService.presentToast("Coming Soon");

      // this.Calculator = 'taxsheet';
    } else if (value == "form16") {
      this.Calculator = "form16";
    }
  }

  getDetails() {
    this.postService.presentLoadingDefault();
    this.postService.getCurrentTime().then((time: any) => {
      let date = new Date(time);
      this.year = date.getFullYear() + 1;
      console.log("Year", this.year);
      this.postService.loading.dismiss();
      //this.postService.presentLoadingDefault();

      this.postService.getUserDetails().then((getdata: any) => {
        let data = {
          tokenid: getdata.tokenid,
          fiscal_year: this.year
        };
        console.log("DATA", data);

        this.postService
          .getData("IncomeTax/getNewIncomeTaxData", data)
          .then((data: any) => {
            console.log("Get", data);
            this.serverResponse = data;
            this.setList = data.DeclarationSets;
            console.log("Datata", data.DeclarationSets);

            this.postService.loading.dismiss();
            //  this.incomeSummary = data.Schemes; // this Array is for the sidemenu. Contains all Section's array
            // this.responseArray = data.Schemes; // for Searching purpose we have to reintitialize original array
            //this.fixedincomeSummary = data.Schemes;

            //this.basic_salary = data.Taxable;
            // this.net_salary = data.Taxable; // for calculation of the tax we need original basic salary

            // this.initializedeclarationSetArray(data.DeclarationSets);
            // this.initializeSectionArray(data.Schemes);
            // let tempArray = this.initializeIncomeSummaryArray(data.Schemes);
            // this.initializeAddedFieldArray(tempArray);
          })
          .catch(error => {
            this.postService.loading.dismiss();
          });
      });
    });
  }

  // Download function to Preview and Download Pdf
  downloadPdf(year) {
    console.log(year);
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      let data = {
        TokenId: user.tokenid,
        FinancialYear: year
      };

      this.postService
        .getData("DMS/GetTaxProjectionDocument", data)
        .then((respdata: any) => {
          console.log("TokenId", data.TokenId);
          console.log("year", data.FinancialYear);

          if (respdata.Message === "Success") {
            console.log("respdata", respdata);
            let path = null;
            console.log("Log", respdata.Base64File);
            var binaryString = window.atob(respdata.Base64File);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++) {
              var ascii = binaryString.charCodeAt(i);
              bytes[i] = ascii;
            }

            let blob = new Blob([bytes], { type: "application/pdf" });

            let fileName =
              respdata.FileName === undefined
                ? "Mypayslip.pdf"
                : respdata.FileName;
            this.file
              .writeFile(this.file.dataDirectory, fileName, blob, {
                replace: true
              })
              .then(fileEntry => {
                //   // Open the PDf
                this.fileOpener.open(
                  this.file.dataDirectory + fileName,
                  "application/pdf"
                );
                //  this.fileOpener.open(data.Base64File, 'application/pdf');

                // var binaryString = window.atob(respdata.Base64File);
                // var binaryLen = binaryString.length;
                // var bytes = new Uint8Array(binaryLen);
                // for (var i = 0; i < binaryLen; i++) {
                //   var ascii = binaryString.charCodeAt(i);
                //   bytes[i] = ascii;
                // }

                // let blob = new Blob([bytes], { type: 'application/pdf' });

                // let fileName = respdata.FileName === undefined ? 'Mypayslip.pdf' : respdata.FileName
                // this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true }).then(fileEntry => {
                //   //   // Open the PDf

                //   this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf');
                //  this.fileOpener.open(data.Base64File, 'application/pdf');
                this.postService.loading.dismiss();
              })
              .catch(error => {
                console.log("Error", error);

                this.postService.presentToast("Something went wrong!");
                this.postService.loading.dismiss();
              });
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

  // Download function to Preview and Download Pdf
  downloadPdfForm16(year) {
    console.log(year);
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      let data = {
        TokenId: user.tokenid,
        FinancialYear: year
      };

      this.postService
        .getData("SalarySlip/GetForm16", data)
        .then((respdata: any) => {
          console.log("TokenId", data.TokenId);
          console.log("year", data.FinancialYear);

          if (respdata.Message === "Success") {
            console.log("respdata", respdata);
            let path = null;
            console.log("Log", respdata.Base64File);
            var binaryString = window.atob(respdata.Base64File);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++) {
              var ascii = binaryString.charCodeAt(i);
              bytes[i] = ascii;
            }

            let blob = new Blob([bytes], { type: "application/pdf" });

            let fileName =
              respdata.FileName === undefined
                ? "Mypayslip.pdf"
                : respdata.FileName;
            this.file
              .writeFile(this.file.dataDirectory, fileName, blob, {
                replace: true
              })
              .then(fileEntry => {
                //   // Open the PDf

                this.fileOpener.open(
                  this.file.dataDirectory + fileName,
                  "application/pdf"
                );
                //  this.fileOpener.open(data.Base64File, 'application/pdf');
                this.postService.loading.dismiss();
              })
              .catch(error => {
                console.log("Error", error);

                this.postService.presentToast("Something went wrong!");
                this.postService.loading.dismiss();
              });
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

  gotoSection(flag) {
    this.navCtrl.push("IncomeTaxPage", {
      selectedSection: flag
    });
  }

  ionViewDidEnter() {
    //  this.getDetails()
  }
}
