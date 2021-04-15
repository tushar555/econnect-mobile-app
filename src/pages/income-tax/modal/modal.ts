import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PostService } from '../../../providers/api/PostService';
import { Storage } from '@ionic/storage';
//import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from "@ionic-native/file";

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  isvalidDate: boolean = true;
  setID: any;


  public declarationSummary = [];
  public declarationType: any;
  public data = [];
  // public loginForm: any;
  fiscal_year: any;
  items: any[] = [];
  formDetails: any = [];
  hraForm: any;
  imageURI: any;
  cityType: any = [];
  housingType: any = [];

  information: any;
  openArray = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private _storage: Storage,
    public viewCtrl: ViewController, public _fb: FormBuilder, private _service: PostService,
              public camera: Camera, public platform: Platform, public file: File
  ) {
    // let temp = this.navParams.get('data');
    // this.data = temp;
    // this.declarationSummary = temp.InvestmentChildren;
    // this.declarationType = temp.DeclarationType;

    // console.log('Length', temp);








    this.fiscal_year = this.navParams.get('fiscal_year');
    this.setID = this.navParams.get('setID');
    this.cityType = [
      {
        name: 'Metro'
      }, {
        name: 'Non-Metro'
      }
    ]

    this.housingType = [
      {
        name: 'Own'
      }, {
        name: 'Rent'
      }
    ]

    this.hraForm = this._fb.group({
      // name: ['', [Validators.required, Validators.minLength(1)]],
      formDetails: this._fb.array([
        this.initAddress(0),
      ])
    });
    console.log('HRA', this.hraForm);

  }


  toggleSection(i) {
    // this.openArray[i] = !this.openArray[i]
    let showList = document.getElementById('showList' + i);
    if (showList.hasAttribute('hidden')) {
      document.getElementById('uparrow' + i).hidden = false;
      document.getElementById('downarrow' + i).hidden = true;
      showList.hidden = false;

    }
    else {
      document.getElementById('downarrow' + i).hidden = false;
      document.getElementById('uparrow' + i).hidden = true;

      showList.hidden = true;
    }
    //abc.style.display
    // this.hraForm.value.formDetails[i] = changeValue;
    // console.log('AFETR', this.hraForm.value.formDetails);

  }



  ionViewDidLoad() {
    let value = this.hraForm.value.formDetails;
    console.log('this', value);

    // for(let count=0; count < value.addresses.length; count++){
    //   this.certificate[count] = value.addresses[count].certificate;  
    // }
  }



  initAddress(i) {
    // this.openArray.push(i);

    this.openArray[i] = false;
    console.log('OPen', this.openArray);

    return this._fb.group({
      cityType: ['', [Validators.required,]],
      housingType: ['', [Validators.required]],
      rentalPincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      llName: ['', [Validators.required]],
      llPincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      llPANNo: ['', [Validators.required, Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      rentalAmount: [0, [Validators.required]],
      rentalAddress: ['', [Validators.required]],
      llAddress: ['', [Validators.required]]
    });


  }

  addAddress() {
    const control = <FormArray>this.hraForm.controls['formDetails'];
    let length = this.openArray.length;
    //console.log('Length11', this.openArray.length[length]);

    console.log('Length', length);

    control.push(this.initAddress(length));
  }
  createItem() {

  }

  closeModal() {
    // console.log('this.hraForm.value.formDetails', this.hraForm.value.formDetails);
    // this.hraForm.value.formDetails.forEach(element => {
    //   console.log('ELEMENT', element);

    //   element.ID = 2;
    // });
    let amount = this.hraForm.value.formDetails.reduce((n, x) => n + parseInt(x.rentalAmount), 0);
    console.log('AAPK', amount);

    let data = { 'HRA': this.hraForm.value.formDetails, 'Amount': amount, 'ID': 2 }

    this.viewCtrl.dismiss(data);
  }



  onSubmit() {
    if (this.hraForm.controls.formDetails.valid) {
      this._service.presentLoadingDefault();
      let value = this.hraForm.value;
      let hraExemptionForm = [];


      for (let count = 0; count < value.formDetails.length; count++) {
        hraExemptionForm.push(value.formDetails[count]);
      }

      this._service.getUserDetails().then((user: any) => {


        let data = {
          tokenid: user.tokenid,
          fiscal_year: this.fiscal_year,
          SetID: this.setID,
          HRAs: hraExemptionForm
        }

        this._service.getData('IncomeTax/submitHRAExemption', data).then((response) => {
          //  console.log('Log', data);
          if (response === 'Success') {
            this._service.presentToast('HRA Declaration Submitted');
            let amount = this.hraForm.value.formDetails.reduce((n, x) => n + parseInt(x.rentalAmount), 0);
            let Modaldata = { 'HRA': this.hraForm.value.formDetails, 'Amount': amount, 'ID': 2 }
            this._service.loading.dismiss();

            this.viewCtrl.dismiss(Modaldata);
          }
        }).catch((error) => {
          this._service.loading.dismiss();
          console.log('Error', error);

        })


      })


    } else if (!this.isvalidDate) {
      this._service.presentToast('Please enter Valid Date');
    } else {
      this._service.presentToast('Please Enter All the Details');
    }



    //   })
    // })

    // let tempArray = [];
    // tempArray.push({ 'declarationID': this.data.ID, "InvestmentChild": value });
    // // this._storage.set('temp', tempArray);
    // this._storage.get('temp').then((data) => {
    //   console.log('Parse ', data);
    //   if (data != null) {
    //     data
    //   }
    // });
    // this._service.messageSource.next(tempArray);
  }
  checkDate(event, fromdate, todate) {
    console.log('Hello', new Date(fromdate.value));
    console.log('byee', new Date(todate.value));
    if (new Date(fromdate.value) < new Date(todate.value)) {
      this.isvalidDate = true;
    } else {
      this.isvalidDate = false;
    }

  }
  checkError(parameter) {
    return (parameter.dirty && parameter.errors)
  }
}
