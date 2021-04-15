import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-my-pay-slip',
  templateUrl: 'my-pay-slip.html',
})
export class MyPaySlipPage {
  tab1Root: any = "CurrentPayslipPage";
  tab2Root: any = "SalaryStatementPage";

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {

    // console.log('ionViewDidLoad MyPaySlipPage');
  }

}
