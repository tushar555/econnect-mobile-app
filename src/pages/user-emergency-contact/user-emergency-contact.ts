import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import { Storage } from "@ionic/storage";
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the UserEmergencyContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class CurUserContact {
  TokenId: any;
  Name: any;
  contacst: any;
}

@IonicPage()
@Component({
  selector: 'page-user-emergency-contact',
  templateUrl: 'user-emergency-contact.html',
})
export class UserEmergencyContactPage {
  contactDetails: any;
  curUserContact: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public postService: PostService, public storage: Storage) {
    this.curUserContact = this.navParams.get('data');

  }

  ionViewDidLoad() {
    // this.curUserContact = this.navParams.get('data');
    // this.curUserContact = {Name: 'Sumit Kumar Gupta', TokenId: '2994822'};

    this.getEmergencyContacts(this.curUserContact.TokenId);
  }

  getEmergencyContacts(tokenid) {
    this.postService.getUserDetails()
      .then((user: any) => {
        this.postService.presentLoadingDefault();
        let data = {
          tokenId: user.tokenid,
          RequestTokenId: tokenid
        }
        this.postService.getData('Employee/GetEmergencyContacts', data)
          .then((resp: any) => {
            console.log(resp);
            this.contactDetails = resp;
            this.postService.loading.dismiss();
          }).catch((error: any) => {
            this.postService.presentToast(error);
            this.postService.loading.dismiss();
            this.navCtrl.pop();
          })
      })
  }

  closeContactModal() {
    this.viewCtrl.dismiss();
  }
}
