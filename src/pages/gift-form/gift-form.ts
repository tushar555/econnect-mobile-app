import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

/**
 * Generated class for the GiftFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift-form',
  templateUrl: 'gift-form.html',
})
export class GiftFormPage {
  data: any;
  status: any;
  acknowledgeForm: FormGroup;
  butText: any;

  constructor(public navCtrl: NavController,public viewCtrl:ViewController,public formBuilder:FormBuilder, public navParams: NavParams,public postService:PostService) {
    this.data=this.navParams.get("data");
    console.log( this.data," this.data");
    this.status=this.navParams.get("status");
    this.acknowledgeForm = formBuilder.group({
      Location: [this.data.Location || '', Validators.required],
      MobileNo: [this.data.MobileNo || '',Validators.required],
      Name: [this.data.Name || '',Validators.required],
      PAN: [this.data.PAN || '',Validators.required],
      RHR: [this.data.RHR || '',Validators.required]
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftFormPage');
  }
  acknowlegeGift(data,status){
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      let data = { 
        'TokenId': user.tokenid, 
        'Status': status,
        'Name':this.acknowledgeForm .get('Name').value,
        'MobileNo':this.acknowledgeForm .get('MobileNo').value,
        'Location':this.acknowledgeForm .get('Location').value,
        'PAN':this.acknowledgeForm .get('PAN').value,
        'RHR':this.acknowledgeForm .get('RHR').value
      };
      this.postService.getData('Feedback/UpdateGiftStatus', data).then((respdata: any) => {
         if (respdata) {
          console.log("respdata",respdata);
          this.postService.loading.dismiss();
          this.postService.presentToast("Acknowledgement status has been submitted successfully..");
          this.viewCtrl.dismiss();
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
