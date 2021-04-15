import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PostService } from '../../../providers/api/PostService';

/**
 * Generated class for the AttendancePolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendance-policy',
  templateUrl: 'attendance-policy.html',
})
export class AttendancePolicyPage {
  usertype: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public _service: PostService) {
    this._service.getUserDetails().then((dt:any)=>{
      if(dt.isHOEmp==true){
        this.usertype = 'HO';
      }else{
        this.usertype = 'RO';
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendancePolicyPage');
  }
  close(){
    this.viewCtrl.dismiss();
  }
}
