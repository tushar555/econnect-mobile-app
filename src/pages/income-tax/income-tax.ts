import { Component, NgZone, Pipe, PipeTransform, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, MenuController, Content } from 'ionic-angular';
import { PostService } from '../../providers/api/PostService';
import { SharedServiceProvider } from '../../providers/shared-service/shared-service'
import { FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';


@Pipe({ name: 'inrFormat' })
export class NewPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return 0;
    else return value.toLocaleString();
    //else return value.toLocaleString("hi-IN");
  }
}
@IonicPage()
@Component({
  selector: 'page-income-tax',
  templateUrl: 'income-tax.html',

})
export class IncomeTaxPage {

  @ViewChild('content') content: Content;

  
  basic_salary: any = 0;
  net_salary: any = 0;
  year: any;
  showAdd: boolean = true;
  public serverResponse: any = {};
  public indexarray = [];
  public totalAmount: number = 0;
  public editedArray = [];
  selectedAction: any;
  showAlertMessage: boolean;
  simulationList: any[];
  sectionDetails: any = [];
  totalTaxableAmount: number = 0;
  totalTaxableSalary: number = 0;
  selectedSection: any;
  showSearch: boolean = false;
  HRA_details: any;
  HRA_Amount: any;
  checkDiscarding: any = false;
  selectedSchemeNo: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private postService: PostService, private _modalCtrl: ModalController,
    private tempService: SharedServiceProvider, public alertCtrl: AlertController,
    private _fb: FormBuilder, public menu: MenuController, public _storage: Storage,
    public zone: NgZone) {
    //this.calculator(this.taxableIncome);


    this.postService.detailValue.subscribe((data) => {
      //console.log('SERVICE', data);

    });

    this.selectedSection = 'simulation';//this.navParams.get('selectedSection');

    this.getDetails(this.selectedSection);


  }
  declarationAction(flag) {
    let totalAmount = 0;
    totalAmount = this.serverResponse.Schemes.reduce((n, x) => n + x.declaredAmount, 0)
    this.selectedAction = flag;
    if (totalAmount !== 0) {
      this.postService.presentConfirmAlert('Discard changes', 'Do you want to discard current changes?',
        'Confirm', this.onCancel, this.onSuccess)
    } else {
      if (flag === 'import') {
        this.importFromSim();
      } else if (flag === 'new') {
        this.createNewForm();

      }
    }


  }

  createNewForm() {
    this.postService.getUserDetails().then((getdata: any) => {
      let url = 'IncomeTax/DeleteITDeclarations'
      let data = {
        "tokenid": getdata.tokenid,
        "fiscal_year": this.year
      }

      this.postService.getData(url, data).then((response) => {
        console.log();
        this.getDetails(this.selectedSection)
      })

    });

    // this.serverResponse.Schemes.forEach((object) => {
    //   object.subSectiondetails.forEach((innerObj) => {
    //     innerObj.Amount = 0;
    //     innerObj.DeclarationDetails = null;
    //     innerObj.DeclarationDetailsIds = null;
    //     innerObj.DeclarationId = null;
    //     innerObj.OfflineProof = null;
    //   })
    //   object.amountConsider = 0;
    //   object.declaredAmount = 0;
    // })
    // this.totalTaxableSalary = 0;
    // this.totalTaxableAmount = 0;
    // //  this.sliderFunction();

  }

  importFromSim() {
    // Check if user move from simulation to declaration without saving  
    let totalAmount = 0;
    if (this.simulationList !== undefined) {

      this.simulationList.forEach((obj) => {
        totalAmount += obj.subSectiondetails.reduce((n, x) => n + x.Amount, 0)
      })

    }

    if (this.simulationList !== undefined && totalAmount !== 0) {

      this.simulationList.forEach((obj, i) => {
        this.serverResponse.Schemes[i].SectionLimit = obj.SectionLimit
        this.serverResponse.Schemes[i].amountConsider = obj.amountConsider
        this.serverResponse.Schemes[i].declaredAmount = obj.declaredAmount
        obj.subSectiondetails.forEach((innerObj, j) => {
          if (this.serverResponse.Schemes[i].subSectiondetails[j] !== undefined) {
            this.serverResponse.Schemes[i].subSectiondetails[j].Status = null;
            this.serverResponse.Schemes[i].subSectiondetails[j].Amount = innerObj.Amount
          }
        })
      })


    } else {
      this.postService.presentToast('You have not created any simulation!')
    }
  }


  sliderFunction() {
    if (this.showSearch) {
      this.showSearch = false;
    } else {
      var modalBlock = document.getElementById("modal");
      var titleBlock = document.getElementById("title");

      var declarationDiv = document.getElementById('declarationDiv');
      console.log('declarationDiv', declarationDiv);

      if (modalBlock.classList.contains("close")) {
        modalBlock.classList.remove("close");
        modalBlock.className += "slider";


        declarationDiv.style.display = 'block';
        this.showAdd = false;
        setTimeout(() => {
          if (document.getElementById('box1') !== null) document.getElementById('box1').style.height = "calc(50vh - 147px)";

        }, 500)


      } else {
        modalBlock.classList.remove("slider");
        modalBlock.className += "close";

        declarationDiv.style.display = 'none';
        this.showAdd = true;
        if (document.getElementById('box1') !== null) document.getElementById('box1').style.height = "100%";

      }
    }
  }

  getDetails(flag) {

    this.postService.presentLoadingDefault();
    this.postService.getCurrentTime().then((time: any) => {

      let date = new Date(time);
      this.year = date.getFullYear() + 1;

      this.postService.loading.dismiss();
      let url: any;
      let param: any;
      this.postService.getUserDetails().then((getdata: any) => {
        if (flag === 'declaration') {
          url = "IncomeTax/getNewIncomeTaxData";
          param = {
            "tokenid": getdata.tokenid,
            "fiscal_year": this.year
          }
        } else if (flag === 'simulation') {
          url = "IncomeTax/getIncomeTaxSimData";
          param = {
            "tokenid": getdata.tokenid,
            "FiscalYear": this.year
          }
        }

        this.postService.getData(url, param).then((data: any) => {
          this.postService.loading.dismiss();
          this.serverResponse = data;
          this.basic_salary = data.Taxable;
          this.net_salary = data.Taxable;
          this.totalTaxableSalary = data.Taxable;

          this.modifydeclarationArray(data);

          setTimeout(() => {
            if(flag === 'simulation')
              this.initialcalculateTotalTax()
            
              this.postService.loading.dismiss();

          }, 100);

          // this.postService.loading.dismiss();


          //  this.incomeSummary = data.Schemes; // this Array is for the sidemenu. Contains all Section's array
          // this.responseArray = data.Schemes; // for Searching purpose we have to reintitialize original array
          //this.fixedincomeSummary = data.Schemes;

          //this.basic_salary = data.Taxable;
          // this.net_salary = data.Taxable; // for calculation of the tax we need original basic salary

          // this.initializedeclarationSetArray(data.DeclarationSets);
          // this.initializeSectionArray(data.Schemes);
          // let tempArray = this.initializeIncomeSummaryArray(data.Schemes);
          // this.initializeAddedFieldArray(tempArray);

        })
          .catch((error) => {
            // this.postService.loading.dismiss();
            this.postService.loading.dismiss();
          });

      });

    })


  }

  modifydeclarationArray(declarationList) {
    let uniqueSectionArray = [];
    let SectionWiseArray = [];

    uniqueSectionArray = declarationList.Schemes.filter((obj, i) => {
      return (declarationList.Schemes.findIndex(innerobj => innerobj.Section === obj.Section) === i)
    }).map(obj => ({ "Section": obj.Section, "SectionLimit": obj.SectionLimit ? obj.SectionLimit : 0 }))

    uniqueSectionArray.forEach((obj, index) => {
      SectionWiseArray.push({
        "Section": obj.Section,
        "subSectiondetails": this.getSectionwiseArray(obj, declarationList.Schemes),
        "SectionLimit": obj.SectionLimit,
        "amountConsider": this.getAmountConsider(obj, declarationList.Schemes),
        "declaredAmount": this.getSectionDeclaredAmount(obj, declarationList.Schemes)
      })
    })

    this.serverResponse.Schemes = SectionWiseArray;
    this.selectedSchemeNo = 0;
    if (this.selectedSection === 'simulation')
      this.simulationList = SectionWiseArray;

  }


  getSectionwiseArray(sectionKey, SchemesArray) {
    return SchemesArray.filter(obj => obj.Section === sectionKey.Section )
  }


  getAmountConsider(sectionKey, SchemesArray) {
    let amount = SchemesArray.filter(obj => obj.Section === sectionKey.Section).reduce((n, x) => n + x.Amount, 0);

    if (amount < sectionKey.SectionLimit) {

      return amount
    }
    else {
      return sectionKey.SectionLimit

    }
  }

  getSectionDeclaredAmount(sectionKey, SchemesArray) {
    console.log(SchemesArray);

    return SchemesArray.filter(obj => obj.Section === sectionKey.Section).reduce((n, x) => n + x.Amount, 0);

  }


  initialcalculateTotalTax() {

    
    this.totalTaxableSalary =  this.basic_salary;

    this.serverResponse.Schemes.forEach((obj) => {
     // obj.subSectiondetails.forEach((innerobj) => {
      let tempAmount: any = 0;

      // Taxable Income From Previous Employer and Other Income (Int, Dividend, St/lt Capgain)
      // These scheme's values are adding in taxable income which we are doing as follows..
     
      /*********Start********* */
      let  tempArray =  obj.subSectiondetails.filter(inner=>inner.SchemeID === 1 || inner.SchemeID===7)
      console.log('TEMPARRAY', tempArray);
      
      tempArray.forEach((item)=>{
        this.totalTaxableSalary += parseInt( item.Amount);
      })
      /*********ENd********* */



      if(obj.Section === '80D' || obj.Section === '80DD' || obj.Section === '80DDB'){
          //this.calculateForPreventive()
          this.calculateTaxableIncome(obj.subSectiondetails)
      }else{
        tempAmount = this.totalTaxableSalary - obj.amountConsider;
      this.totalTaxableSalary = tempAmount <= 0 ? 0 : tempAmount; 

      }

     
        //this.calculateIncomeTax( obj);
     // });
    });

    //    this.calculateFinalTax();

    
    // this.totalTaxableSalary = this.basic_salary;
    // taxList.forEach((obj) => {

    //   obj.subSectiondetails.forEach((innerobj) => {

    //     // if (innerobj.SchemeCategory !== 'General' && innerobj.Amount !== 0)
    //     this.calculateIncomeTax(innerobj, obj)
    //   })
    // })

    this.calculateTax();
  }

  calculateTaxableIncome(tempArray){


    let Amount = 0;
    let tempLimit=0;
    let foundObj = tempArray.filter(obj=>obj.SchemeID ==12 || obj.SchemeID ==13);
    if(foundObj[0]){
      Amount = foundObj.reduce((n,x)=>n+parseInt(x.Amount),0);
      tempLimit = foundObj[0].Limit;
      if(Amount>=tempLimit) this.totalTaxableSalary -= tempLimit;
      else if(Amount<tempLimit)this.totalTaxableSalary -= Amount;
    }
      tempArray.forEach((obj)=>{ 
      
        if(obj.SchemeID !==12 && obj.SchemeID !== 13){
          if( obj.Amount >= obj.Limit ){
            this.totalTaxableSalary -= parseInt( obj.Limit);
         }else if(obj.Amount<obj.Limit){
           this.totalTaxableSalary -= parseInt( obj.Amount);             
         }
        }
          
      })
  }


  edit(data, index) {

    // document.getElementById('inp' + index).removeAttribute('readOnly')
    document.getElementById('save' + index).hidden = false;
    document.getElementById('edit' + index).hidden = true;
    document.getElementById('label' + index).hidden = true;
    document.getElementById('inp' + index).hidden = false;

    this.editedArray.push(data.SchemeID);
    // this.editedArray = false;

  }
  fun(){
    console.log('funfunfunfunfun');
    
  }
  save(data) {
    var value = 0;
    if (data.Amount === '' ||  /^[a-zA-Z()%~`!@#$%^&*()_+=|}{:'";<>,.?/\[\]\-\\]+$/.test(data.Amount)) {
      data.Amount= 0;        
    }else{
     value = parseInt( data.Amount);

     if (!isNaN(value) ) {
      data.Amount = value;
      this.checkDiscarding = true;

      // document.getElementById('label' + index).hidden = false;
      // document.getElementById('inp' + index).hidden = true;
      // document.getElementById('edit' + index).hidden = false;
      // document.getElementById('save' + index).hidden = true;

      //this.updateSectionAddedFieldArray(data, value);

     // let delindex = this.editedArray.findIndex(obj => obj === data.SchemeID)
      //this.editedArray.splice(delindex, 1);

      //Set Declared Amount Value in section
      let tempArray = this.serverResponse.Schemes.find(obj => obj.Section === data.Section)
      console.log('TEMPAAAAAAAAAAAAAAAAAAa', tempArray);
      
      tempArray.declaredAmount = this.getSectionDeclaredAmount(data, tempArray.subSectiondetails);
      tempArray.amountConsider = this.getAmountConsider(data, tempArray.subSectiondetails);

      // if (this.selectedSection == 'declaration' && data.ProofRequired) {
      //   const alert = this.alertCtrl.create({
      //     title: 'Proof Required !',
      //     subTitle: 'Please upload proof details from web version',
      //     buttons: ['OK']
      //   });
      //   alert.present();
      // }
      this.initialcalculateTotalTax();
      // this.getSectionWaiseTotalAmt();

    } else {
      data.Amount = 0;
      //this.postService.presentToast('Please enter Amount');

    }
    }


    //parseFloat((<HTMLInputElement>document.getElementById('inp' + index)).value);
   


 

  }





  ionViewDidLoad() {
  }


  sendToApproval() {

    let alert = this.alertCtrl.create({
      title: 'Confirm declaration',
      message: 'Do you want to save this declaration?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {


          }
        },
        {
          text: 'Confirm',
          handler: () => {
            let data: any;
            let url: any;

            if (this.editedArray.length === 0) {
              this.postService.presentLoadingDefault();
              let NewSchemesArray = [];
              this.serverResponse.Schemes.forEach((item) => {
                item.subSectiondetails.forEach((innerItem) => {
                  innerItem.OfflineProof = true;
                  if (innerItem.Status != 'Approved') { //innerItem.Status != 'Pending' &&
                    NewSchemesArray.push(innerItem);
                  }

                })
              })

              this.postService.getUserDetails().then((user: any) => {


                url = 'IncomeTax/SubmitIncomeTaxDeclarations';
                let data = {
                  "RequestType": "PendingApproval",
                  "TokenId": user.tokenid,
                  "FiscalYear": this.year,
                  "Schemes": NewSchemesArray
                }


                this.postService.getData(url, data).then((resp: any) => {
                  this.postService.loading.dismiss();
                  if (resp == 'Success') {
                    //this.getTaxableAmount(this.fiscalYear, this.selectedSection);

                    this.postService.presentToast('Submitted! Please wait for admin approval !');
                  }
                })

              });

            } else {
              this.postService.presentToast('You have forgotten to save some amount');

            }


          }
        }
      ]
    });
    alert.present();



  }


  saveAsDraft() {

    let data: any;
    let url: any;
   
    if (this.editedArray.length === 0) {
      this.checkDiscarding = false;
      let NewSchemesArray = [];
      this.serverResponse.Schemes.forEach((item) => {
        item.subSectiondetails.forEach((innerItem) => {
          innerItem.OfflineProof = true;
          if (innerItem.Status != 'Approved') { //innerItem.Status != 'Pending' &&
            NewSchemesArray.push(innerItem);
          }

        })
      })

      const total = NewSchemesArray.reduce((n, x) => n + x.Amount, 0);

      if (total == 0) {
        this.postService.presentToast('No changes detected for calculation!');
      } else {
        this.postService.getUserDetails().then((user: any) => {

          if (this.selectedSection === 'simulation') {
  
            data = {
              "TokenId": user.tokenid,
              "FiscalYear": this.year,
              "Schemes": NewSchemesArray
            }
  
  
            url = 'IncomeTax/SubmitIncomeTaxSimulations';
  
          } else if (this.selectedSection === 'declaration') {
  
            data = {
              "RequestType": "Save",
              "TokenId": user.tokenid,
              "FiscalYear": this.year,
              "Schemes": NewSchemesArray
            }
            url = 'IncomeTax/SubmitIncomeTaxDeclarations';
          }
  
          this.postService.getData(url, data).then((resp: any) => {
  
            if (resp == 'Success') {
              //this.getTaxableAmount(this.fiscalYear, this.selectedSection);
              this.postService.presentToast('Saved Sucessfully !');
            }
          })
  
        });
  
      }

   
    } else {
      this.postService.presentToast('You have forgotten to save some amount');

    }


  }





  //Newly Add
  calculateIncomeTax(detailObj, secDetails) {

    if (detailObj.Section !== 'General' && detailObj.Amount !== 0) {

      if (detailObj.Amount < secDetails.SectionLimit) {
        let tempAmount = this.totalTaxableSalary - detailObj.Amount;
        this.totalTaxableSalary = tempAmount <= 0 ? 0:tempAmount;

      } else {
        let tempAmount = this.totalTaxableSalary - secDetails.SectionLimit;
        this.totalTaxableSalary =  tempAmount <= 0 ? 0:tempAmount;

      }
    }


    // tahis.calculateTax();

  }

  //Newly Add
  calculateTax() {
    let amount: any;
    let total = 0;

    this.totalTaxableAmount = 0;
   // this.net_salary = this.serverResponse.Taxable;
    // alert(this.totalTaxableSalary)
    if (this.totalTaxableSalary > 250000) {
      if (this.totalTaxableSalary > 250000) {
        amount = (this.totalTaxableSalary > 500000) ? (500000 - 250000) * 0.05 : (this.totalTaxableSalary - 250000) * 0.05; //param minus from 250000
        total += amount;
      }
      if (this.totalTaxableSalary > 500000) {
        amount = (this.totalTaxableSalary > 1000000) ? (1000000 - 500000) * 0.20 : (this.totalTaxableSalary - 500000) * 0.20; //param minus from 500000
        total += amount;
      }
      if (this.totalTaxableSalary > 1000000) {
        amount = (this.totalTaxableSalary - 1000000) * 0.30; //param minus from 500000
        total += amount;
      }
    }

    let education_cess = total * 0.04;
    this.totalTaxableAmount = total + education_cess;
    console.log('LOGAAAaaaaaaa', this.serverResponse);
    
  }

  presentAlert(taxable_amt) {
    let alert = this.alertCtrl.create({
      title: 'Your Total Tax',
      subTitle: taxable_amt,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewDidEnter() { }


  getItems(ev: any) {

  }



  //Newly Add
  loadSectionDetails(data) {
    this.sectionDetails = data;
    this.sliderFunction();

  }




  // ionViewCanLeave() {
  //   this.showAlertMessage = true;
  //   // if (this.showAlertMessage) {
  //   //   alert(',nm');
  //   let alertPopup = this.alertCtrl.create({
  //     title: 'Exit',
  //     message: '¿Are you sure?',
  //     buttons: [{
  //       text: 'Exit',
  //       handler: () => {
  //         alertPopup.dismiss().then(() => {
  //           this.exitPage();
  //         });
  //       }
  //     },
  //     {
  //       text: 'Stay',
  //       handler: () => {
  //         // need to do something if the user stays?
  //       }
  //     }]
  //   });

  //   // Show the alert
  //   alertPopup.present();

  //   // Return false to avoid the page to be popped up
  //   return false;
  //   //   }
  // }




  ionViewCanLeave() {
    let totalAmount = 0;
    this.serverResponse.Schemes.forEach((obj) => {
      totalAmount += obj.subSectiondetails.reduce((n, x) => n + x.Amount, 0)
    })

    if (this.checkDiscarding && totalAmount !== 0) {

      this.postService.presentConfirmAlert('Discard changes', 'Do you want to discard current changes?',
        'Confirm', this.onCancel, this.onleaveSuccess)

      return false;

    } else {
      this.checkDiscarding = false;
     // this.navCtrl.pop();
    }

  }

  onSuccess = () => {

    if (this.selectedAction === 'import') {

      this.importFromSim();
    } else if (this.selectedAction === 'new') {
      this.createNewForm();

    }
    this.checkDiscarding = false;

  }

  onleaveSuccess = () => {
    this.checkDiscarding = false;
    this.navCtrl.pop();
  }

  onCancel = () => {

  }

  onSelect(scheme){
      this.selectedSchemeNo = scheme;
      console.log('selectedLeave', this.serverResponse.Schemes[0]);

  }

}
