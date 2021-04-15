import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PostService } from "../../providers/api/PostService";
import { FileOpener } from "@ionic-native/file-opener";
import { DomSanitizer } from "@angular/platform-browser";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import * as moment from "moment";

/**
 * Generated class for the AppraisalLetterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-appraisal-letter",
  templateUrl: "appraisal-letter.html"
})
export class AppraisalLetterPage {
  companyName: any;
  monthsArray: any = [];
  date: any;
  year: any;
  name: any;
  location: any;
  userToken: any;
  total: any;
  designation: any;
  yearsArray = [];
  responseData: any;
  showNoRecord: any;
  constructor(
    public navCtrl: NavController,
    public file: File,
    public navParams: NavParams,
    public postService: PostService,
    public fileOpener: FileOpener,
    public transfer: FileTransfer,
    public sanitize: DomSanitizer
  ) {
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
    });
  }

  ionViewDidLoad() {
    this.postService.presentLoadingDefault();
    this.postService
      .getCurrentTime()
      .then((newDate: any) => {
        this.postService.getUserDetails().then((data: any) => {
          this.date = new Date(newDate);
          let ndate = newDate;
          let currentYear = this.date
            .getFullYear()
            .toString()
            .substring(2);
          if (this.date.getMonth() > 2) {
            currentYear++;
            this.date = moment(ndate)
              .add(1, "year")
              .toDate();
          }

          for (let i = 0; i < 3; i++) {
            this.yearsArray.push(
              this.date.getFullYear() -
                (i + 1) +
                "-" +
                (parseInt(currentYear) - i)
            );
          }
          this.yearsArray = this.yearsArray.reverse();
          this.year = this.yearsArray[1];
          this.postService.loading.dismiss();
          this.downloadPdf();
        });
      })
      .catch(error => {
        this.postService.loading.dismiss();
        this.navCtrl.pop();
        this.postService.presentToast(error);
      });
  }

  // Download function to Preview and Download Pdf
  downloadPdf() {
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      let data = {
        TokenId: user.tokenid,
        FinancialYear: this.year
      };

      this.postService
        .getData("Appraisal/GetAppraisalLetter", data)
        .then((respdata: any) => {
          console.log("TokenId", data.TokenId);
          // console.log("year", data.FinancialYear);
          this.showNoRecord = respdata.length === 0 ? true : false;
          this.responseData = respdata;
          this.postService.loading.dismiss();
        })
        .catch(error => {
          this.postService.loading.dismiss();
          this.postService.presentToast(error);
        });
    });
  }

  getPDFFile(obj) {
    if (this.responseData.length > 0) {
     // let path = null;
      console.log("Log", obj.Base64File);
      var binaryString = window.atob(obj.Base64File);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }

      let blob = new Blob([bytes], { type: "application/pdf" });

      let fileName =
        obj.Filename === undefined ? "Appraisal.pdf" : obj.Filename;
      this.file
        .writeFile(this.file.dataDirectory, fileName, blob, { replace: true })
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
  }
}
