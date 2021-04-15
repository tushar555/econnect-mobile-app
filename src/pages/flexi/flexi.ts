import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Select } from 'ionic-angular';
import { PostService } from "../../providers/api/PostService";
import * as moment from 'moment';

import { AlertController } from 'ionic-angular';


/**
 * Generated class for the FlexiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// class FlexiDetails {
//   FlexiId: number;
//   DeclaredAmount: number;
//   FlexiComponent: string;
//   IsEditable: boolean;
//   Limit: number;
//   Remarks: string;
// }

@IonicPage()
@Component({
  selector: 'page-flexi',
  templateUrl: 'flexi.html',
})
export class FlexiPage {
  companyName: any;
  flexiDetails: any[];
  FlexiPay: number;
  @ViewChild('selectCEA') el1: Select;
  BalanceFlexi: number;
  DeclaredAmount: number;
  FlexiYear: number;
  FlexiCard:any;
  showFooter: boolean = true;
  showSubmit: number;
  flexiCount: any=-1;

  //  flexiDetails: FlexiDetails[] = [];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public alertCtrl: AlertController,
    public postService: PostService) {
    //this.FlexiYear = parseInt(moment().format('YYYY'));
    this.FlexiYear = this.getFiscalYear();
    this.postService.getUserDetails().then((userToken) => {
      this.companyName = userToken['companyName'];
      // alert("compan:"+this.companyName);
      this.showFooter = true;

  });
    platform.ready().then((readySource) => {
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
    });
  }
  ngOnInit() {
    this.getFlexiDetails();
    this.FlexiCard = document.getElementById('flexiCard').offsetHeight;
    this.FlexiCard=this.platform.height()-this.FlexiCard-210; 
    console.dir(this.FlexiCard);
  }
  getFlexiDetails() {
     this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      const details = { 'tokenid': user.tokenid,
       'fiscal_year': this.FlexiYear,
       'empToken': null, 
      };
      this.postService.getData('IncomeTax/getFlexiComponents', details).then((data: any) => {
       this.flexiDetails = data.FlexiComponents;
       this.flexiCount= this.flexiDetails.length;
      console.log("donewwwwwwwwwwwwwwwwwwwww",this.flexiDetails);
      this.getFlexiPayBalance();
      this.calculateFlexiDeclaration(0, 0);
      var count=0;
      for(let i=0;i< this.flexiDetails.length;i++){
            if(this.flexiDetails[i].IsEditable == false){
                count++;
            }
      }
     this.showSubmit=count; 
      this.postService.loading.dismiss();
      }).catch((error) => {
        this.postService.loading.dismiss();
        this.postService.presentToast(error);
      })
    })
  }
  ionViewDidLoad() {

  }
  validateAmountKeyPress(event, limit, i) {
    let chr = parseInt(event.key);
    if (isNaN(chr)) {
      console.log('not number');
      return false;
    }
  }
  

  footerToggle(type){
    console.dir('inside toggle');
    if(type=='hide'){
      this.showFooter = false;
    }else if(type=='show'){
      this.showFooter = true;
    }else{
      this.showFooter = true;
    }
  }
  validateAmountKeyUp(event, limit, i) {
    let amount = this.flexiDetails[i].DeclaredAmount;
    this.flexiDetails[i].DeclaredAmount=parseInt(this.flexiDetails[i].DeclaredAmount, 10);
    if (amount.toString() == '' || amount==null) {
      this.flexiDetails[i].DeclaredAmount = 0;
    }
    if (limit!==null && amount > limit) {
      this.flexiDetails[i].DeclaredAmount = limit;
    }
    console.log('amount',amount, 'limit', limit);
     this.calculateFlexiDeclaration(limit, i);
  }

  showSubmitFlexi() {
    const confirm = this.alertCtrl.create({
      
      title: 'Submit Flexi Components',
      message: 'Are you sure to submit Flexi Component ?',
      cssClass: 'customCommonAlert',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            // this.cancelData(i,data);
            this.submitFlexiDeclaration();
          }
        }
      ,
        {
          text: 'No ',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  
  }
  submitFlexiDeclaration(){
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((user: any) => {
      const details = { 
      'tokenid': user.tokenid, 
      'fiscal_year': this.FlexiYear,
      'FlexiComponents' : this.flexiDetails,
      'empToken': null,
      'type':'submit'
     };
      this.postService.getData('IncomeTax/submitFlexiDeclaration', details).then((data: any) => {
       console.log("getdata",data);
       this.postService.loading.dismiss();
       this.getFlexiDetails();
       this.postService.presentToast('Flexi Updated SuccessFully');
      }).catch((error) => {

        
       
      })
    })
  }
  getFlexiPayBalance() {
    this.flexiDetails.forEach((el) => {
      if (el.FlexiId == 9) {
        this.FlexiPay = el.DeclaredAmount;
      } else if (el.FlexiId == 10) {
        this.BalanceFlexi = el.DeclaredAmount
      }
    });
    console.log('flexipay', this.FlexiPay);
    console.log('balanceflexi', this.BalanceFlexi);
  }

  // calculateFlexiDeclaration(limit, i) {
  //   this.DeclaredAmount = 0;
  //   this.flexiDetails.forEach((el) => {
  //     if (el.FlexiId !== 9 && el.FlexiId !== 10) {
  //       if(el.DeclaredAmount == null){
  //         el.DeclaredAmount = 0;
  //       }
  //       el.DeclaredAmount = parseInt(el.DeclaredAmount.toString());
  //       if (!isNaN(el.DeclaredAmount))
  //         this.DeclaredAmount += el.DeclaredAmount;
  //     }
  //   });
  //   this.BalanceFlexi = this.FlexiPay - this.DeclaredAmount;
  //   if (this.BalanceFlexi < 0) {
  //     this.flexiDetails[i].DeclaredAmount += this.BalanceFlexi;
  //     this.DeclaredAmount += this.BalanceFlexi;
  //     // console.log(this.flexiDetails[i].DeclaredAmount);
  //     this.BalanceFlexi = 0;
  //   }
  // }


  calculateFlexiDeclaration(limit, i) {
    //console.dir(this.el1._value);
    var balance=this.BalanceFlexi;
    this.DeclaredAmount = 0;
    this.flexiDetails.forEach((el) => {
      if (el.FlexiId !== 9 && el.FlexiId !== 10) {
        if(el.DeclaredAmount == null){
          el.DeclaredAmount = 0;
        }

        el.DeclaredAmount = parseInt(el.DeclaredAmount.toString());
        if (!isNaN(el.DeclaredAmount))
          this.DeclaredAmount += el.DeclaredAmount;
      }
    });


    this.BalanceFlexi = this.FlexiPay - this.DeclaredAmount;

    if (this.BalanceFlexi < 0) {
      this.flexiDetails[i].DeclaredAmount += this.BalanceFlexi;
      this.DeclaredAmount += this.BalanceFlexi;
      // console.log(this.flexiDetails[i].DeclaredAmount);
      this.BalanceFlexi = 0;
    }
    if(i == 4){
      if(balance>=1200){
       // this.flexiDetails[i].DeclaredAmount=1200
       //document.getElementById('leaveCode').value = '14'

       // $('#selectCEA').val(this.flexiDetails[i].DeclaredAmount);
        //this.el1.nativeElement.value=this.flexiDetails[i].DeclaredAmount;
        this.el1._value=this.flexiDetails[i].DeclaredAmount;
        //this.BalanceFlexi=balance-this.flexiDetails[i].DeclaredAmount;  
        this.BalanceFlexi=this.FlexiPay - this.DeclaredAmount;
        if(this.flexiDetails[i].DeclaredAmount>1200 && this.flexiDetails[i].DeclaredAmount<2400){
          this.BalanceFlexi=this.BalanceFlexi+this.flexiDetails[i].DeclaredAmount;
          this.DeclaredAmount= this.DeclaredAmount-this.flexiDetails[i].DeclaredAmount;
          this.flexiDetails[i].DeclaredAmount=0;
          this.el1._value='0';
        //  this.el1.nativeElement.value='0';
          //$('#selectCEA').val('0'); 
        }
      }else{
        this.el1._value='0';
       // this.el1.nativeElement.value='0';
       // $('#selectCEA').val('0'); 
       // if(balance<0){
          this.BalanceFlexi=this.flexiDetails[i].DeclaredAmount-(this.BalanceFlexi*-1);
          this.DeclaredAmount= this.DeclaredAmount-this.flexiDetails[i].DeclaredAmount;
          this.flexiDetails[i].DeclaredAmount=0;
      //  }else{
      //    this.flexiDetails[i].DeclaredAmount=0;
          //this.BalanceFlexi = this.FlexiPay - this.DeclaredAmount;
          //this.BalanceFlexi=balance;
        //  return false;
      //  } 
      }
      
    }
    setTimeout(() => {

    }, 100);
  }


  getFiscalYear(){
    return moment().get('month')>2 ? moment().get('year')+1 : moment().get('year');
  }
}
