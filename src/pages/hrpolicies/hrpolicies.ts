import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SharedServiceProvider } from "../../providers/shared-service/shared-service";

@IonicPage()
@Component({
  selector: "page-hrpolicies",
  templateUrl: "hrpolicies.html"
})
export class HrpoliciesPage {
  menuArray: Array<any> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _shared: SharedServiceProvider
  ) {}

  ionViewDidLoad() {
    this._shared
      .getpolicies()
      .then((data: any) => {
        console.log(data.menulist);
        this.menuArray = data.menulist;
      })
      .catch(error => {
        console.log(error);
      });
  }

  getItems(event) {
    const val = event.target.value;
    //  this.menuArray = [];
    // if (val && val.trim() != '') {
    //   this.menuArray = this.menuArray.filter((item) => {
    //     return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //   })
    // }
  }
}
