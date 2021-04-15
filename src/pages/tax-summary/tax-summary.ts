import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import { Storage } from '@ionic/storage';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inrFormat' })
export class NewPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return 0;
    else return value.toLocaleString();
    //else return value.toLocaleString("hi-IN");
  }
}
@IonicPage()
@Component({
  selector: 'page-tax-summary',
  templateUrl: 'tax-summary.html',
})
export class TaxSummaryPage {
  companyName: any;
  designation: any;
  userToken: any;
  location: any;
  name: string;
  date: any;
  yearsArray = [];
  year: any;
  taxDeductionArray = [];
  totalDeduction = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public postService: PostService
    , private _storage: Storage, public loadingCtrl: LoadingController) {
    // this.year = 2018;
    this.postService.getUserDetails().then((userToken) => {
      this.companyName = userToken['companyName'];
      // alert("compan:"+this.companyName);
  });
  }

  ionViewDidLoad() {
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {

      this.name = user.userName;
      this.location = user.userLocation;
      this.userToken = user.tokenid;
      this.designation = user.JobTitle;

      this.postService.getCurrentTime().then((newDate: any) => {
        this.date = new Date(newDate);
        this.year = this.date.getFullYear();
        for (let i = 0; i <= 2; i++) {
          console.log(this.date.getFullYear() - i);
          this.yearsArray.push(this.date.getFullYear() - i);
        }
        this.postService.loading.dismiss();
        this.getTaxSummary();
      }).catch((err) => {
        this.postService.loading.dismiss();
        this.postService.presentToast(err);
        this.navCtrl.pop();
      });

    })


  }

  onChange() {
    this.getTaxSummary();
  }


  getTaxSummary() {
    this.taxDeductionArray = [];
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {

      const details = { 'tokenId': user.tokenid, 'year': this.year };
      //console.log('details', details);

      this.postService.getData('SalaryCard/getSalaryCard', details).then((data: any) => {
        this.postService.loading.dismiss();
        // let tempArray = [];
        this.taxDeductionArray = data.SalaryCardItems;
        console.log('Taxx', this.taxDeductionArray);

        this.taxDeductionArray = this.taxDeductionArray.filter(function (name, key) {
          return (name.WageIdentifier.indexOf('DEDUCTION') > 0) ? name : '';
        })

        this.totalDeduction = this.taxDeductionArray.reduce((n, x) => n + x.Amount, 0);

      }).catch((err) => {
        this.postService.loading.dismiss();
        this.postService.presentToast(err);
      });

    })



  }

}
