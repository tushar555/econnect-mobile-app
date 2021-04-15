import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { PostService } from '../../../providers/api/PostService';


@IonicPage()
@Component({
  selector: 'page-show-details',
  templateUrl: 'show-details.html',
})
export class ShowDetailsPage {
  details: any;
  contactDetails = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public postService: PostService, public toastCtrl: ToastController) {
    this.details = this.navParams.get('contactDetails');
    console.log(this.details);
  }

  ionViewDidLoad() {
    let token = {
      tokenId: this.details.tokenid
    }
    this.postService.getData('assets/temp.json', token)
      .then((resp: any) => {
        console.log('Resp', resp);
        this.contactDetails = resp;
      }).catch((error: any) => {
        this.presentToast('Server Error');
      })
  }

  closeModal() {
    this.view.dismiss();
  }

  presentToast(messsage) {
    let toast = this.toastCtrl.create({
      message: messsage,
      duration: 3000
    });
    toast.present();
  }
}
