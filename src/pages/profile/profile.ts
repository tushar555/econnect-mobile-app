import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  message: string;
  headerDate: {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.headerDate = { "title": "Profile" }; //set header title
    this.message = 'HELLLOOOO BRODA';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
