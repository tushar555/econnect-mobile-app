import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { PostService } from "../../providers/api/PostService";
import { Storage } from "@ionic/storage";
import { DomSanitizer } from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-hospitals',
  templateUrl: 'hospitals.html',
})
export class HospitalsPage {
  companyName: any;
  originHospitalList: any;
  size: any;
  tempList: any;
  searchText = "";
  loading;
  private hospitalList: any = [];
  curPageNo: any = 1;
  pageload: boolean = true;
  smallLoader: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private postService: PostService, public storage: Storage, private sanitizer: DomSanitizer,
    private callNumber: CallNumber, private ngZone: NgZone, public plt: Platform) {
    this.getList('', this.curPageNo, 'start');
    this.postService.getUserDetails().then((userToken) => {
      this.companyName = userToken['companyName'];
      // alert("compan:"+this.companyName);
    });
  }

  searchFn(ev: any) {
    // alert('aaaa');
    this.smallLoader = true;
    this.searchText = ev.target.value;
    this.getList(ev.target.value, 1, 'start');
    if (this.searchText.length > 0) {

      this.hospitalList = this.customFilter(this.hospitalList, this.searchText);
    }
    else {
      this.hospitalList = this.originHospitalList;
    }
  }

  reset() {
    console.log('reset');
    this.curPageNo = 1;
    this.getList('', this.curPageNo, 'start');
  }
  customFilter(objList, text) {
    // if (undefined === text || text === '') return objList;
    return objList.filter(product => {
      let flag;
      for (let prop in product) {
        flag = false;
        flag = product[prop].toString().indexOf(text) > -1;
        if (flag)
          break;
      }
      return flag;
    });
  }

  ionViewWillEnter() {
    //this.postService.presentLoadingDefault();
    console.log('ionViewDidLoad HospitalsPage');

  }

  getSafeContent(lat, long, name) {
    let content = "geo:0,0?q=" + lat + "," + long + "(" + name + ")";
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');
      content = "maps://?q=" + lat + "," + long;
    }

    return this.sanitizer.bypassSecurityTrustUrl(content);
  }
  getList(searchText, pageNo, flag) {
    console.log("in getlist");
    if (this.pageload){
      this.postService.presentLoadingDefault();
    }
    else{
      
    }
     // this.smallLoader = true;
    this.postService.getUserDetails().then((user: any) => {

      let params = {
        "tokenid": user.tokenid,
        'SearchText': searchText,
        'PageNo': pageNo
      }
      console.log('Glafff', flag);

      this.postService.getData("/Hospital/GetHospitalList", params)
        .then((response: any) => {
          console.log('Response', response);

          if (flag === 'start') {
            this.hospitalList = response.HospitalList;
          } else if (flag === 'scroll') {
            for (let i = 0; i < response.HospitalList.length; i++) {
              this.hospitalList.push(response.HospitalList[i]);
            }

          }

          // this.tempList = response;
          // this.size = 20;
          // this.hospitalList = this.tempList.slice(0, this.size)
          // this.originHospitalList = this.tempList.slice(0, this.size)
          if (this.pageload)
            this.postService.loading.dismiss();
          else
            this.smallLoader = false;
          this.pageload = false;
        }).catch((error) => {
          if (this.pageload)
            this.postService.loading.dismiss();
          else
            this.smallLoader = false;
          this.postService.presentToast(error);
          console.log('Error getting location', error);
        });
    })

  }


  loadHospitals(infiniteScroll) {
    this.curPageNo += 1;
    setTimeout(() => {
      // for (let i = this.size; i < this.size + 20; i++) {
      //   this.hospitalList.push(this.tempList[i]);
      // }
      this.getList('', this.curPageNo, 'scroll')

      infiniteScroll.complete();
    }, 500);
    this.size += 20
  }


  // Call hospital
  callHospital(callNumber: string) {
    this.callNumber.callNumber(callNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => this.postService.presentToast('Cannot launch dialer without permission'));
  }
}
