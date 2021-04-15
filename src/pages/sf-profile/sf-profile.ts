import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { PostService } from "../../providers/api/PostService";
import { HomePage } from "../home/home";
import { PinSetFormComponent } from "../../components/pin-set-form/pin-set-form";

class SfProfile {
  Aadhar: string;
  PAN: string;
  emergencyContact: any;
  Email: string;
  dependants: any;
  PhoneNo: string;
  Address: string;
}
/**
 * Generated class for the SfProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-sf-profile",
  templateUrl: "sf-profile.html"
})
export class SfProfilePage {
  SfProfileData: any = {};
  localUserData: any = {};
  private isModal: boolean;
  is_edit: boolean;
  userDetails: any = {};
  profileForm: FormGroup;
  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  phonePattern = /^[789]\d{9}$/;
  PANNoPattern = /[A-Z]{5}\d{4}[A-Z]{1}/;
  isPinPresent: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public postService: PostService,
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public event: Events
  ) {
    this.isModal = navParams.get("isModal");
    this.SfProfileData = new SfProfile();
    this.localUserData.companyName = "";

    this.postService.getUserDetails().then(userToken => {
      this.localUserData = userToken;

      this.getProfileDetails();
      this.is_edit = true;
    });

    // this.postService.getPinStatus().then((resp: any) => {
    //   this.isPinPresent = resp.IsPinAvailable;

    //   this.setPinPresent(resp.IsPinAvailable);
    // });

    event.subscribe("Response", resp => {
      console.log("resp", resp.message);

      if (resp.message == "Success") {
        this.isPinPresent = "true";
      }
    });
  }

  setPinPresent(flag) {
    this.isPinPresent = flag;
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad SfProfilePage");
    // this.getProfileDetails();
  }
  openPinForm() {
    let pinModal = this.modalCtrl.create(PinSetFormComponent, {
      userId: 8675309
    });
    pinModal.present();
  }
  ngOnInit() {
    this.profileForm = this._fb.group({
      mobileNumber: [
        "",
        [Validators.required, Validators.pattern(this.phonePattern)]
      ],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
      aadhar: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(12)
        ])
      ],
      pan: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10)
        ])
      ],
      add1: ["", [Validators.required]],
      add2: ["", [Validators.required]],
      add3: [""],
      add4: [""],
      add5: [""],
      add6: [""],
      add7: [""],
      add8: [""],
      add9: [""],
      add10: [""],
      add11: [""],
      add12: [""],
      add13: [""],
      zipcode: ["", [Validators.required]]
    });
  }
  get f() {
    return this.profileForm.controls;
  }
  getProfileDetails() {
    this.postService.presentLoadingDefault();
    let url = "Employee/GetBasicProfile";
    let params = {
      tokenid: this.localUserData.tokenid
    };

    this.postService.getData(url, params).then(
      (res: any) => {
        console.log("in res", res);
        this.SfProfileData = res;
        this.userDetails = JSON.parse(JSON.stringify(res));
        this.profileForm.controls["mobileNumber"].setValue(res.PhoneNo);
        this.profileForm.controls["email"].setValue(res.Email);
        this.profileForm.controls["aadhar"].setValue(res.Aadhar);
        this.profileForm.controls["pan"].setValue(res.PAN);
        this.profileForm.controls["add1"].setValue(res.Address.address1);
        this.profileForm.controls["add2"].setValue(res.Address.address2);
        this.profileForm.controls["add3"].setValue(res.Address.address3);
        this.profileForm.controls["add4"].setValue(res.Address.address4);
        this.profileForm.controls["add5"].setValue(res.Address.address5);
        this.profileForm.controls["add6"].setValue(res.Address.address6);
        this.profileForm.controls["add7"].setValue(res.Address.address7);
        this.profileForm.controls["add8"].setValue(res.Address.address8);
        this.profileForm.controls["add9"].setValue(res.Address.address9);
        this.profileForm.controls["add10"].setValue(res.Address.address10);
        this.profileForm.controls["add11"].setValue(res.Address.address11);
        this.profileForm.controls["add12"].setValue(res.Address.address12);
        this.profileForm.controls["add13"].setValue(res.Address.address13);
        this.profileForm.controls["zipcode"].setValue(res.Address.zipCode);
        // this.profileForm.controls["emergencyname"].setValue(
        //   res.Address.zipCode
        // );
        // this.profileForm.controls["ephoneno"].setValue(res.Address.zipCode);
        if (
          this.SfProfileData.emergencyContact &&
          this.SfProfileData.emergencyContact.length > 0
        ) {
          // this.SfProfileData.emergencyContact.forEach((element, i) => {
          //   this.profileForm.controls["Name" + i].setValidators([
          //     Validators.required
          //   ]);
          //   this.profileForm.controls["Name" + i].updateValueAndValidity();
          //   this.profileForm.controls["Phone" + i].setValidators([
          //     Validators.required
          //   ]);
          //   this.profileForm.controls["Phone" + i].updateValueAndValidity();
          // });
        }
        this.postService.loading.dismiss();
      },
      error => {
        console.log(error);
        this.postService.loading.dismiss();
      }
    );
  }

  updateProfile() {
    console.log("in update 1", this.profileForm);
    // if(this.profileForm.valid){
    console.log("in update 2");
    this.postService.presentLoadingDefault();
    let url = "Employee/SubmitBasicProfile";
    let params = {
      tokenid: this.localUserData.tokenid,
      PhoneNo: this.profileForm.get("mobileNumber").value,
      Email: this.profileForm.get("email").value,
      Aadhar: this.profileForm.get("aadhar").value,
      PAN: this.profileForm.get("pan").value,
      //location: this.profileForm.get("location").value,
      Address: {
        addressType: this.SfProfileData.Address.addressType,
        address1: this.profileForm.get("add1").value,
        address2: this.profileForm.get("add2").value,
        address3: this.profileForm.get("add3").value,
        address7: this.profileForm.get("add7").value,
        address6: this.profileForm.get("add6").value,
        address5: this.profileForm.get("add5").value,
        address4: this.profileForm.get("add4").value,
        address9: this.profileForm.get("add9").value,
        zipCode: this.profileForm.get("zipcode").value,
        address8: this.profileForm.get("add8").value,
        address10: this.profileForm.get("add10").value,
        address11: this.profileForm.get("add11").value,
        address12: this.profileForm.get("add12").value,
        address13: this.profileForm.get("add13").value,
        startDate: this.SfProfileData.Address.startDate
      },
      dependants: this.SfProfileData.dependants,
      emergencyContact: this.SfProfileData.emergencyContact
    };
    console.log("params: ", params);
    this.postService.getData(url, params).then(
      (res: any) => {
        console.log("update response", res);
        this.SfProfileData = res;
        this.postService.loading.dismiss();
        if (res.d.length > 0) {
          this.postService.presentToast("Updated Successfully !");
          this.navCtrl.pop({
            animate: true,
            animation: "ios-transition",
            duration: 1000,
            direction: "back"
          });
        } else {
          this.postService.presentToast("Error in updating profile data");
          this.navCtrl.pop({
            animate: true,
            animation: "ios-transition",
            duration: 1000,
            direction: "back"
          });
        }
      },
      error => {
        console.log(error);
        this.postService.loading.dismiss();
      }
    );
    //  }
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
