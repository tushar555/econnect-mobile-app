import { HomePage } from "./../home/home";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the HeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-header",
  templateUrl: "header.html"
})
export class HeaderPage {
  @Input() headerInfo: {};
  @Output() passData: EventEmitter<any> = new EventEmitter();

  public homePage = HomePage;
  public profilePage = "ProfilePage";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.headerInfo);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HeaderPage");
  }

  showHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
