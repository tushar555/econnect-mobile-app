import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { SharedServiceProvider } from '../../../providers/shared-service/shared-service';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Storage } from '@ionic/storage';
import { PostService } from "../../../providers/api/PostService";

@IonicPage()
@Component({
  selector: 'page-salary-statement',
  templateUrl: 'salary-statement.html',
})
export class SalaryStatementPage {

  salaryData: any;
  monthsArray: any = [];

  yearsArray = [];
  date: any;
  constructor(public http: HttpClient, private _zone: NgZone, public navCtrl: NavController,
    public navParams: NavParams, private _shared: SharedServiceProvider,
    public file: File, public fileOpener: FileOpener, public storage: Storage, public toastCtrl: ToastController,
    public _service: PostService) {

    this.date = new Date();
    for (let i = 0; i <= 9; i++) {
      this.yearsArray.push(this.date.getFullYear() - i);
    }
    this.initializeMonths();
    this.getDetails();
  }

  initializeMonths() {
    this.monthsArray = ['January', 'February', 'March', 'April',
      'May', 'June', 'July', 'Augast', 'September',
      'October', 'November', 'December']

  }

  onChange(event) {
    if (event === this.date.getFullYear()) {
      let month = [];
      for (let i = 0; i <= this.date.getMonth(); i++) {
        month.push(this.monthsArray[i]);
      }
      this.monthsArray = month;
    } else {
      this.initializeMonths();
    }
  }

  getDetails() {
    // this._zone.run(()=>{
    //   let link = "assets/json/salaryDetails.json";
    //   this.http.get(link).subscribe((data: any)=>{
    //     this.salaryData = data;
    //   });
    // });
  }

  getSalaryDetails(month, year) {
    this._service.getUserDetails().then((user: any) => {

      let sendData = { 'tokenId': user.tokenid, 'month': month, 'year': year };
      this._service.getData('/SalaryCard/getSalaryCard', sendData).then((data: any) => {
        var binaryString = window.atob(data);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
          var ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }

        let blob = new Blob([bytes], { type: 'application/pdf' });
        this.file.writeFile(this.file.dataDirectory, 'SalarySlip.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf
          this.fileOpener.open(this.file.dataDirectory + 'SalarySlip.pdf', 'application/pdf');

        }).catch((error) => {
          this.createToast(error);
        });

      }).catch((error) => {
        this.createToast(error);
      });

    })



  }
  createToast(error) {
    let message = (error === false ? 'No Network Connection..' : 'Something Went Wrong..');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

}
