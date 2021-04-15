import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { PostService } from "../../providers/api/PostService";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

/**
 * Generated class for the GiftAcknowledgementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-gift-acknowledgement",
  templateUrl: "gift-acknowledgement.html"
})
export class GiftAcknowledgementPage {
  respData: any;
  data: any;
  acknowledgeForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public postService: PostService
  ) {
    this.acknowledgeForm = formBuilder.group({
      TokenId: ["", Validators.compose([Validators.required])],
      Location: ["", Validators.required],
      MobileNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[1-9]{1}[0-9]{9}$/)
        ])
      ],
      Name: ["", Validators.required],
      PAN: [""],
      RHR: ["", Validators.required],
      Status: [false],
      BankAccountNo: ["", Validators.required]
    });
    this.getGiftStatus();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad GiftAcknowledgementPage");
  }
  getGiftStatus() {
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      let data = {
        TokenId: user.tokenid
      };
      this.postService
        .getData("Feedback/GetGiftStatus", data)
        .then((respdata: any) => {
          console.log(respdata, "../respdata../");
          if (respdata) {
            this.respData = respdata["GiftStatus"]; // respdata["GiftStatus"];
            this.data = respdata;
            this.patchValue();
            this.postService.loading.dismiss();
          } else {
            this.postService.loading.dismiss();
            this.postService.presentToast("Sorry Data is Not Present!");
          }
        })
        .catch(error => {
          this.postService.loading.dismiss();
          this.postService.presentToast(error);
        });
    });
  }

  patchValue() {
    if (this.respData) {
      this.acknowledgeForm.patchValue({
        BankAccountNo: this.data.BankAccountNo,
        MobileNo: this.data.MobileNo
      });
    }

    this.acknowledgeForm.patchValue({
      TokenId: this.data.TokenId,
      Name: this.data.Name,
      Location: this.data.Location,
      RHR: this.data.RHR,
      Status: this.respData
    });
  }

  checkCharOnly(event) {
    var value = String.fromCharCode(event.which);
    var pattern = new RegExp(/[a-zåäö ]/i);
    return pattern.test(value);
  }
  // acknowlegeGift(status){
  //   let profileModal = this.modalCtrl.create('GiftFormPage',{
  //     data:this.data,
  //     status:status
  //   });
  //   profileModal.present();
  //   profileModal.onDidDismiss(data => {
  //   console.log(data);
  //   });
  //   // this.postService.presentLoadingDefault();
  //   // this.postService.getUserDetails().then((user: any) => {
  //   //   let data = {
  //   //     'TokenId': user.tokenid,
  //   //     'Status': status
  //   //   };

  //   //   this.postService.getData('Feedback/UpdateGiftStatus', data).then((respdata: any) => {
  //   //     console.log(respdata,"../respdata../");
  //   //      if (respdata) {
  //   //       console.log("respdata",respdata);
  //   //       this.postService.loading.dismiss();
  //   //       this.postService.presentToast("Acknowledgement status has been submitted successfully..");
  //   //     } else {
  //   //       this.postService.loading.dismiss();
  //   //       this.postService.presentToast("Sorry Data is Not Present!");
  //   //     }

  //   //   }).catch((error) => {

  //   //     this.postService.loading.dismiss();
  //   //     this.postService.presentToast(error);
  //   //   });

  //   // })

  // }

  acknowlegeGift() {
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      // let data = {
      //   'TokenId': user.tokenid,
      //   'Status': status,
      //   'Name':this.acknowledgeForm .get('Name').value,
      //   'MobileNo':this.acknowledgeForm .get('MobileNo').value,
      //   'Location':this.acknowledgeForm .get('Location').value,
      //   'PAN':this.acknowledgeForm .get('PAN').value,
      //   'RHR':this.acknowledgeForm .get('RHR').value
      // };
      let param = this.acknowledgeForm.getRawValue();
      param.tokenid = user.tokenid;
      console.log("PARAMM", param);

      this.postService
        .getData("Feedback/UpdateGiftStatus", param)
        .then((respdata: any) => {
          if (respdata) {
            console.log("respdata", respdata);
            this.postService.loading.dismiss();
            this.postService.presentToast(
              "Acknowledgement status has been submitted successfully.."
            );
            this.getGiftStatus();
            //this.viewCtrl.dismiss();
          } else {
            this.postService.loading.dismiss();
            this.postService.presentToast("Sorry Data is Not Present!");
          }
        })
        .catch(error => {
          this.postService.loading.dismiss();
          this.postService.presentToast(error);
        });
    });
  }
}
