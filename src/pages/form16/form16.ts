import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import { FileOpener } from '@ionic-native/file-opener';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


/**
 * Generated class for the Form16Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form16',
  templateUrl: 'form16.html',
})
export class Form16Page {
 
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
  constructor(
    public navCtrl: NavController, 
    public file: File,
    public navParams: NavParams,
    public postService: PostService,
    public fileOpener: FileOpener,
    public transfer: FileTransfer,
    public sanitize: DomSanitizer
  ) {
    this.postService.getUserDetails().then((userToken) => {
      this.companyName = userToken['companyName'];
      
  });
  }

  ionViewDidLoad() {
    this.postService.presentLoadingDefault();
    this.postService.getCurrentTime().then((newDate: any) => {
      this.postService.getUserDetails().then((data: any) => {
        this.date = new Date(newDate);
        let currentYear = this.date.getFullYear().toString().substring(2);
        // this.year = this.date.getFullYear();
       

        for (let i = 0; i <= 2; i++) {
          // this.yearsArray.push(this.date.getFullYear() - i);
          this.yearsArray.push((this.date.getFullYear() - (i+1)) +"-"+(parseInt(currentYear)  - i));
        }
        this.postService.loading.dismiss();
       })

    }).catch((error) => {
      this.postService.loading.dismiss();
      this.navCtrl.pop();
      this.postService.presentToast(error);
    });

  }

  
  // Download function to Preview and Download Pdf
  downloadPdf(year) {
    console.log(year);
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {

      let data = { 
        'TokenId': user.tokenid, 
        'FinancialYear': year
      };

      this.postService.getData('SalarySlip/GetForm16', data).then((respdata: any) => {
          console.log("TokenId",data.TokenId);
          console.log("year",data.FinancialYear);

        if (respdata.Message === 'Success') {
          console.log("respdata",respdata);
          let path = null;
         console.log('Log', respdata.Base64File);
          var binaryString = window.atob(respdata.Base64File);
          var binaryLen = binaryString.length;
          var bytes = new Uint8Array(binaryLen);
          for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
          }


          let blob = new Blob([bytes], { type: 'application/pdf' });

          let fileName = respdata.FileName === undefined ? 'Mypayslip.pdf' : respdata.FileName
          this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true }).then(fileEntry => {
            //   // Open the PDf

            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf');
            //  this.fileOpener.open(data.Base64File, 'application/pdf');
            this.postService.loading.dismiss();

          }).catch((error) => {
            console.log('Error', error);

            this.postService.presentToast("Something went wrong!");
            this.postService.loading.dismiss();

          });

        } else {
          this.postService.loading.dismiss();
          this.postService.presentToast("Sorry Data is Not Present!");
        }

      }).catch((error) => {

        this.postService.loading.dismiss();
        this.postService.presentToast(error);
      });



    })


  }
  

}
