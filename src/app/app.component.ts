import { Component, ViewChild } from "@angular/core";
import {
  AlertController,
  App,
  IonicApp,
  Platform,
  Events,
  ModalController
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { Storage } from "@ionic/storage";
import { NavController } from "ionic-angular/navigation/nav-controller";

/*Internet Connectivity Check Imports*/
import { Network } from "@ionic-native/network";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
/*Internet Connectivity Check Imports*/

//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SharedServiceProvider } from "../providers/shared-service/shared-service";
import { MobileAccessibility } from "@ionic-native/mobile-accessibility";
import { PostService } from "../providers/api/PostService";
import { LoginPage } from "../pages/login/login";
import {
  InAppBrowser,
  //InAppBrowserOptions
} from "@ionic-native/in-app-browser/ngx";

declare var cordova;
@Component({
  selector: "app-root",
  templateUrl: "app.html",
  providers: [MobileAccessibility]
})
export class MyApp {
  rootPage: any;
  navTitle = "Mahindra Finance";
  //private userOffline: boolean = false;
  hide: boolean = true;
  @ViewChild("navCtrl") navCtrl: NavController;

  constructor(
    public iab: InAppBrowser,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public shared: SharedServiceProvider,
    public storage: Storage,
    private network: Network,
   // private toast: ToastController,
    private app: App,
    public post: PostService,
    private ionicApp: IonicApp,
    private alertCtrl: AlertController,
    private mobileAccessibility: MobileAccessibility,
    public event: Events,
    public modalCtrl: ModalController
  ) {
    document.addEventListener(
      "deviceready",
      function() {
        cordova.getAppVersion.getVersionNumber().then(
          version => {
            storage.set("appversion", version);
          },
          function(error) {
            console.error("The following error occurred: " + error);
          }
        );
      },
      false
    );
    platform.ready().then(() => {
      // statusBar.overlaysWebView(true);
      statusBar.styleDefault();
      this.event.subscribe("user:logout", () => {
        // this.post.presentAlert("Session expired!", 'Your session has been expired! Please login again.', 'OK', this.onSuccess())
        this.storage.clear();

        this.app.getActiveNavs()[0].setRoot("LoginPage");
      });

      /*let splash = modalCtrl.create(SplashPage);
      splash.present();*/
      /* Back Button Code Start */
      platform.registerBackButtonAction(() => {
        console.log("hi");
        let activePortal =
          ionicApp._loadingPortal.getActive() ||
          ionicApp._modalPortal.getActive() ||
          ionicApp._toastPortal.getActive() ||
          ionicApp._overlayPortal.getActive();
        if (activePortal) {
          activePortal.dismiss();
        }
        let nav = app.getActiveNavs()[0];
        let activeView = nav.getActive();
        console.log("activeView: " + activeView.name);
        if (
          activeView.component === HomePage ||
          activeView.component === LoginPage
        ) {
          if (nav.canGoBack()) {
            //Can we go back?
            nav.pop();
          } else {
            const alert = this.alertCtrl.create({
              message: "Are you sure you want to exit the application?",
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel",
                  cssClass: "btn-alert-cancel",
                  handler: () => {
                    console.log("Application exit prevented!");
                  }
                },
                {
                  text: "Exit",
                  cssClass: "btn-alert-ok",
                  handler: () => {
                    platform.exitApp(); // Close this application
                  }
                }
              ]
            });
            alert.present();
          }
        } else if (nav.canGoBack()) {
          //Can we go back?
          console.log("going back");
          nav.pop();
        }
      });
      /* Back Button Code End */

      /* Network Connectivity Check Start */
      /*      if (this.checkNetwork()) {
        this.userOffline = true;
        this.post.networkmessageSource.next(false);
      } else if (!this.checkNetwork()) {
        this.post.networkmessageSource.next(true);
      }*/

      /*this.network.onConnect().subscribe(data => {
        this.userOffline = false;
        this.post.networkmessageSource.next(true);
      }, error => console.log("Network Error", error));

      this.network.onDisconnect().subscribe(data => {
        //this.displayNetworkUpdate(data.type);
        this.userOffline = true;
        this.post.networkmessageSource.next(false);
      }, error => console.log("Network Error", error));*/

      /* Network Connectivity Check End */

      /* Status Bar Styling Start */
      //statusBar.styleDefault();
      //splashScreen.hide();
      /* Status Bar Styling End*/

      /* Mobile Accessibility Plugin Code Start */
      console.log("mobileAccessibility: " + this.mobileAccessibility);
      if (this.mobileAccessibility) {
        this.mobileAccessibility.usePreferredTextZoom(false);
      }
      /* Mobile Accessibility Plugin Code End */
      /* Check app Version Code Start */
      this.post.presentLoadingDefault();
      console.log("in app version");

      setTimeout(() => {
        this.post
          .getUserDetails()
          .then((user: any) => {
            // const params = JSON.stringify({
            //   tokenid: user.tokenid
            // });
            this.showAppVersion(user.tokenid);
          
          })
          .catch(error => {
            this.showAppVersion("undefined");
            // this.postService.loading.dismiss();
          });
      }, 200);
    });

    var offline = Observable.fromEvent(document, "offline");
    var online = Observable.fromEvent(document, "online");

    offline.subscribe(() => {
      console.log("in offline ");
      this.navCtrl.push("OfflinePage");
    });

    online.subscribe(() => {
      console.log("in online ");
      /*let currentIndex = this.navCtrl.getActive().index;
        this.navCtrl.remove(currentIndex);*/
      this.navCtrl.pop();
    });
  }

  onSuccess = () => {
    this.storage.clear();
    this.app.getActiveNavs()[0].setRoot("LoginPage");
  };

  showAppVersion(tokenId) {
    console.trace();

    this.storage.get("appversion").then(data => {
      this.post
        .getData("Account/CheckAppVersion", {
          Platform: "android",
          Version: data || "1.3.39",
          tokenid: tokenId
        })
        .then((resp: any) => {
          this.post.dismissLoading();
          if (resp.IsLatest == true) {
            // //this.post.presentToast("Correct version");
            // /* Landing Page Redirection Start */
            // storage.get('username').then((data) => {
            //   if (data === null || data === undefined) {
            //       this.rootPage = "LoginPage"
            //   } else {
            //       this.rootPage = HomePage;
            //   }
            // });

            this.post.getUserDetails().then(data => {
              console.log(data);
              // if(data['userName'] === null || data['userName'] === undefined){
              if (data == undefined || resp.IsSessionValid == false) {
                this.rootPage = "LoginPage";
              } else {
                this.rootPage = HomePage;
              }
            });
          } else {
            //this.post.presentToast("Check version");
            const alert = this.alertCtrl.create({
              message: "Please update your app",
              enableBackdropDismiss: false,
              buttons: [
                {
                  text: "Ok",
                  cssClass: "btn-alert-full-width",
                  handler: () => {
                   // let target = "_blank";
                    this.iab.create(
                      "https://econnect.mahindrafs.com/weconnectliveapp/",
                      "_system"
                    );
                    //window.open('https://uat.weconnect.mahindrafs.com/econnectapp1/', "_blank");
                    //window.open('https://econnect.mahindrafs.com/weconnectliveapp/', "_self");
                    // document.open('https://econnect.mahindrafs.com/weconnectliveapp/', "_blank");
                    //location.href="https://econnect.mahindrafs.com/weconnectliveapp/";
                    //window.location.assign('https://econnect.mahindrafs.com/weconnectliveapp/');
                  }
                }
              ]
            });
            alert.present();

            //  alert.onDidDismiss(() => platform.exitApp());
          }
          /* Landing Page Redirection End */
        })
        .catch(error => {
          this.post.dismissLoading();
          this.post.presentToast(error);
        });
    });
  }

  checkNetwork() {
    if (
      this.network.type === "none" ||
      this.network.type === "" ||
      this.network.type === null ||
      this.network.type === undefined
    )
      return true;
    else return false;
  }
  /*  displayNetworkUpdate(connectionState: string){
      this.toast.create({
        message: `You are now ${connectionState}`,
        duration: 6000
      }).present();
    }*/
}
