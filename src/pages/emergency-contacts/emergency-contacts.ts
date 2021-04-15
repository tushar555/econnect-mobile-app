import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import { Storage } from "@ionic/storage";
import { CallNumber } from '@ionic-native/call-number';


@IonicPage()
@Component({
  selector: 'page-emergency-contacts',
  templateUrl: 'emergency-contacts.html',
})
export class EmergencyContactsPage {
  companyName: any;
  showDetails: any = true;
  userToken: any;
  contactList = [];
  anotherContactList = [];
  showList: any = false;
  contactDetails = [999];
  loading: any;
  myInput: any;
  datanotfound: any;
  pageload: boolean = true;
  smallLoader: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone,
    public postService: PostService, public storage: Storage, private _callNumber: CallNumber,
    public toastCtrl: ToastController, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
    this.datanotfound = 'assets/img/notfound.png'
    this.postService.getUserDetails().then((userToken) => {
      this.companyName = userToken['companyName'];
      
  });
  }

  ionViewDidEnter() {
   // setTimeout(() => {
      this.postService.getUserDetails().then((user: any) => {
        this.postService.presentLoadingDefault();
        let data = {
          tokenId: user.tokenid,
          RequestTokenId: user.tokenid
        }
        console.log('data', data);
  
        this.zone.run(() => {
          this.postService.getData('Employee/GetEmergencyContacts', data)
            .then((resp: any) => {
              console.log('contactDetails', this.contactDetails);
  
              this.contactDetails = resp;
              this.postService.loading.dismiss();
            }).catch((error: any) => {
              this.postService.presentToast(error);
             // this.navCtrl.pop();
            })
        });
      })
  //  },2000)
  }


  searchContact(param) {

    if (param.target.value !== undefined) {
      let length = param.target.value.length;
      let text = param.target.value;

      switch (true) {
        case (length === 3):
         
          this.showDetails = true;
          // this.postService.presentLoadingDefault();
          this.pageload=false;
          this.getContacts(param);
          break;
        case (length < 3):
          // console.log('In Case2');
          this.makeEmpty();
          break;
        case (length > 3):
          this.showDetails = false;

          if (this.contactList.length === 0) {
            this.pageload=false;
            this.getContacts(param);
          } else {
            this.initialize('', '');
            this.contactList.map(item => item.Name);
            this.contactList = this.contactList.filter((item) => {
              return (item.Name.toLowerCase().indexOf(text.toLowerCase()) > -1);
            });
          }
          break;
      }

    } else {
      this.makeEmpty();
    }

  }

  getContacts(param) {
    if (this.pageload){
      this.postService.presentLoadingDefault();
    }
    else{
      this.smallLoader = true;
    }
    this.showList = true;

    this.postService.getUserDetails().then((user: any) => {

      const sendData = {
        tokenid: user.tokenid,
        search_text: param.target.value
      }
      this.postService.getData('Employee/EmployeeSearch', sendData).then((resp: any) => {
        console.log('ServerServer', resp);
        if (this.pageload)
          this.postService.loading.dismiss();
        else
          this.smallLoader = false;
        this.pageload = false;

        if (resp.Message === 'Success') {
          this.contactList = resp.employees;
          console.log('contactList', this.contactList);

          this.initialize(this.contactList, 'fromget');
        } else {
          this.postService.presentToast('Server Error');
        }
      }).catch((error: Error) => {
        if (this.pageload)
          this.postService.loading.dismiss();
        else
          this.smallLoader = false;
        this.postService.presentToast(error);
      });
    })
  }

  openEmergencyContacts(contact){
    contact.companyName = this.companyName;
    let modal = this.modalCtrl.create('UserEmergencyContactPage', {"data": contact});
    modal.present();
    modal.onDidDismiss((dt)=>{
      console.log(dt);
    });
  }

  makeEmpty() {
    this.contactList = [];
    this.anotherContactList = [];
    this.showList = false;
  }

  call(call_number) {

    if (call_number === '' || call_number === null || call_number === undefined) {
      this.postService.presentToast('Phone Number is not available');
    } else {
      this._callNumber.callNumber(call_number, true)
        .then(() => console.log('Launched dialer!'))
        .catch((error) => this.postService.presentToast('Cannot place call Right Now'));
    }

  }

  initialize(temp, flag) {

    if (flag === 'fromget') {
      this.contactList = temp;
      this.anotherContactList = temp
    } else {
      this.contactList = this.anotherContactList;
    }

  }

  onCancel($event) {
    console.log('InCancel Func');
    this.contactList = [];
    this.anotherContactList = [];
    this.showList = false;
    this.showDetails = true;
    console.log("this.contactDetails: ",this.contactDetails);
  }
}
