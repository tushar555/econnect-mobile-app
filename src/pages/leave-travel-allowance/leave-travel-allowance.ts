import { LtaProvider } from "./../../providers/lta/lta";
import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PostService } from "../../providers/api/PostService";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the LeaveTravelAllowancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @Pipe({ name: 'inrFormat' })
// export class NewPipe implements PipeTransform {
//   transform(value: any) {
//     if (!value) return 0;
//     else return value.toLocaleString("hi-IN");
//   }
// }
@IonicPage()
@Component({
  selector: "page-leave-travel-allowance",
  templateUrl: "leave-travel-allowance.html"
})
export class LeaveTravelAllowancePage {
  companyName: any;
  totalDeductions: any;
  totalEarnings: any;
  total: number;

  financialYear: Date = new Date();
  ltaRecords: any = [];
  userInfo: any = [];
  headerDate: {};
  initOfUserInfo: boolean = false;
  date: any;
  monthsArray: any = [];
  yearsArray = [];
  year: any;
  month: any;
  name: any;
  location: any;
  userToken: any;
  designation: any;
  paymentData: any = [];
  counter = [];
  getUserDetails: {};
  totalTax: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _ltaProvider: LtaProvider,
    private _ngZone: NgZone,
    public postService: PostService,
    public storage: Storage
  ) {
    this.headerDate = { title: "LTA SUMMERY" };
    this.postService.getUserDetails().then(userToken => {
      this.getUserDetails = userToken;
      this.companyName = userToken["companyName"];
      console.dir(userToken);
      // alert("compan:"+this.companyName);
    });
  }

  ionViewDidLoad() {
    this.postService
      .getCurrentTime()
      .then((newdate: any) => {
        this.date = new Date(newdate);
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();

        this.name = this.postService.userName;
        this.location = this.postService.userLocation;
        this.userToken = this.postService.tokenid;
        this.userToken
          ? (this.designation = this.getUserDetails["JobTitle"])
          : "";

        for (let i = 0; i <= 2; i++) {
          console.log(this.date.getFullYear() - i);
          this.yearsArray.push(this.date.getFullYear() - i);
        }

        this.initializeArray();
        this.getLtaInfo();
      })
      .catch(error => {
        this.navCtrl.pop();
        this.postService.presentToast(error);
      });
  }

  initializeArray() {
    this.paymentData = [];
  }

  getLtaInfo() {
    this.initializeArray();
    this.total = 0;
    this.postService.presentLoadingDefault();
    this._ngZone.run(() => {
      this.postService.getUserDetails().then((user: any) => {
        const details = { tokenId: user.tokenid, year: this.year };
        this.postService
          .getData("SalaryCard/getLTASummary", details)
          .then((data: any) => {
            let tempArray = [];
            let newtempArray = [];
            let test = [];

            // this.paymentData = data.SalaryCardItems;
            tempArray = data.SalaryCardLTAItems;
            this.ltaRecords = data.SalaryCardLTAItems;
            var destinationArray = this.ltaRecords.slice();
            this.totalTax = destinationArray.reduce(
              (n, x) => n + x.FlexiBlockedAmount,
              0
            );
            console.log("Temp Array Y", tempArray);

            // for (let i = 0; i < tempArray.length; ++i) {
            //   // console.log(te);

            //   if (newtempArray.indexOf(tempArray[i].WageType) === -1) {
            //     newtempArray.push(tempArray[i].WageType);
            //     // this.counter.push(this.countElement(tempArray, tempArray[i].WageType));
            //     test.push(tempArray[i]);
            //   }
            // }

            // for (let i = 0; i < newtempArray.length; i++) {

            //   let getAmount = this.getTotalAmountByID(newtempArray[i], tempArray);

            //   this.paymentData.push({ "wageType": newtempArray[i], "amount": getAmount, "description": test[i].WageTypeDescription, 'wageIdentifier': test[i].WageIdentifier })
            // }

            this.postService.dismissLoading();
          })
          .catch(error => {
            this.postService.dismissLoading();
            this.navCtrl.pop();
            this.postService.presentToast(error);
          });
      });
    });
  }

  getTotalAmountByID(nameKey, tempArray: Array<{ any }>) {
    let sum = 0;

    tempArray
      .map(function(e: any) {
        return { Wage: e.WageType, Amount: e.Amount };
      })
      .forEach(item => {
        if (item.Wage === nameKey) sum += item.Amount;
      });
    return sum;
  }
}
