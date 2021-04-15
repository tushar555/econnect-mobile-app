import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import * as moment from "moment";

/**
 * Generated class for the UserNotficationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-notfication',
  templateUrl: 'user-notfication.html',
})
export class UserNotficationPage {
  totalArr: any;
  responseArr: any;
  date: any;

  constructor(public navCtrl: NavController,
     public zone: NgZone,
     public postService: PostService,
     public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.dir("did load");
    // this.postService.presentLoadingDefault();
    this.getSalarycardDetails();
  }

  getSalarycardDetails() {
    
    // this.initializeArray();
    // this.total = 0;
    //  this.postService.presentLoadingDefault();
    console.dir(moment().format('DD-MM-yyyy'));
    this.postService.presentLoadingDefault();

    this.zone.run(() => {
      this.postService.getUserDetails().then((user: any) => {
        // const details = { 'tokenId': user.tokenid, 'year': parseInt(this.year) };
        // console.dir(moment(this.date).get('month')+1, moment(this.date).get('year'));
        const details = {
          tokenid: user.tokenid,
          todayDate: moment().format('YYYY-MM-DD'),
        };
        this.postService 
          .getData("Attendance/GetNotification", details)
          .then((resp: any) => {
            this.totalArr = [];
            this.responseArr = resp.Data;
            console.dir( this.responseArr);
            // this.responseArrAll=resp.data;
            // this.weeks = this.responseArr[0].Weeks;

            //  if(this.searchItem !== undefined && this.searchItem!==''){
            //   this.searchbar.clearInput(null);
            //   this.searchItem='';
            //  }
            // console.log("totalArr: ", this.responseArr);
            // this.postService.loading.dismiss();
            this.postService.dismissLoading();
          });
      });
    });
  }


}
