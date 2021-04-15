import { Component } from "@angular/core";
import { AlertController, NavController, NavParams, Platform } from "ionic-angular";
import { trigger, state, style } from "@angular/animations";
import { Storage } from "@ionic/storage";
import { PostService } from "../../providers/api/PostService";
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger("rotatedState", [
      state(
        "deg1",
        style({
          transform: "rotate(0deg)",
          transition: "all 1000ms ease-out 0.3s"
        })
      ),
      state(
        "deg2",
        style({
          transform: "rotate(-90deg)",
          transition: "all 1000ms ease-out 0.3s"
        })
      ),
      state(
        "deg3",
        style({
          transform: "rotate(90deg)",
          transition: "all 1000ms ease-out 0.3s"
        })
      ),
      state(
        "deg4",
        style({
          transform: "rotate(-180deg)",
          transition: "all 1000ms ease-out 0.3s"
        })
      ),
      state(
        "deg5",
        style({
          transform: "rotate(180deg)",
          transition: "all 1000ms ease-out 0.3s"
        })
      )
    ]),
    trigger("textRotate", [
      state(
        "deg1",
        style({
          transform: "rotate(0deg)",
          transition: "all 800ms ease-out 1s"
        })
      ),
      state(
        "deg2",
        style({
          transform: "rotate(90deg)",
          transition: "all 800ms ease-out 1s"
        })
      ),
      state(
        "deg3",
        style({
          transform: "rotate(-90deg)",
          transition: "all 800ms ease-out 1s"
        })
      ),
      state(
        "deg4",
        style({
          transform: "rotate(180deg)",
          transition: "all 800ms ease-out 1s"
        })
      ),
      state(
        "deg5",
        style({
          transform: "rotate(180deg)",
          transition: "all 800ms ease-out 1s"
        })
      )
    ])
  ],
  providers: [AppLauncher]
})
export class HomePage {
  companyName: any;
  menu;
  isHoEmp: any;
  state: string = "default";
  q0 = 0;
  q1 = -90;
  q2 = 90;
  q3 = -180;
  userName: any = "";
  userLocation: any;
  userEmail: any;
  isCSR: any;
  subMenuData: any;
  sIndex: number;
  private appversion: any;
  private tokenId: any;
  attendanceMananger: any;
  IsGiftEligible: boolean = false;
  isCSRUrl: any;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private postService: PostService,
    private alertCtrl: AlertController,
    private _service: PostService,
    public navParam: NavParams,
    private appLauncher: AppLauncher,
    private platform: Platform
  ) {
    this.storage.get("appversion").then(data => {
      this.appversion = data;
    });

    //let flag = navParam.get("flag");

    // this.postService.getPinStatus().then((data: any) => {
    //   if (data.IsPinAvailable === "false" && flag == "fromLogin") {
    //     this.openAlertBox(
    //       "Warning",
    //       "Seems like you have not set pin yet. Are you sure you want to set now?"
    //     );
    //   } else if (data.IsPasswordChange === "true" && flag == "fromLogin") {
    //     this.openAlertBox(
    //       "Warning",
    //       "Your pin is disabled, kindly reset it from profile section."
    //     );
    //   }
    // });
    setTimeout(() => {
      this._service.getUserDetails().then((data: any) => {
        this.userName = data.userName;
        this.userLocation = data.userLocation;
        this.userEmail = data.userEmail;
        this.companyName = data.companyName;
        this.tokenId = data.tokenid;
      });
    }, 1000);
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
      this.isCSR = userToken["isCSR"];
      this.isCSRUrl = userToken["CSRURL"];
      this.IsGiftEligible = userToken["IsGiftEligible"];
      // this.attendanceMananger=userToken['manager'][0].IsManager;
      // alert("compan:"+this.companyName);
      if (userToken["manager"]) {
        this.attendanceMananger = userToken["manager"][0].IsManager;
      } else {
        this.attendanceMananger = false;
      }
      this.menu = [
        {
          tab: "Time",
          qid: "q1",
          menuImage: "white-time-attendance",
          href: "",
          isActive: 1,
          subMenu: [
            {
              menu: "",
              menuImage: "",
              link: "",
              href: "",
              position: "",
              border: "",
              isActive: 1
            },
            {
              menu: "Attendance",
              menuImage:
                this.companyName !== "MIBL"
                  ? "white-attendance"
                  : "black-attendance",
              link: "AttendanceDetailsPage",
              href: "",
              position: "1",
              border: "#b12143",
              isActive: 1
            },
            {
              menu: "Holiday",
              menuImage:
                this.companyName !== "MIBL" ? "white-holiday" : "black-holiday",
              link: "HolidayPage",
              href: "",
              position: "2",
              border: "#f8e472",
              isActive: 1
            },
            {
              menu: "Success Factors",
              menuImage: this.companyName !== "MIBL" ? "white-sf" : "black-sf",
              link: "",
              //href: 'https://performancemanager4.successfactors.com',
              href: "https://performancemanager4.successfactors.com/login?company=mahindrama",
              position: "3",
              border: "#1caf9d",
              isActive: 1
            }
          ]
        },
        {
          tab: "Payroll",
          qid: "q2",
          menuImage: "white-payroll",
          href: "",
          isActive: 1,
          subMenu: [
            {
              menu: "My Payslip",
              menuImage:
                this.companyName !== "MIBL" ? "white-payslip" : "black-payslip",
              link: "CurrentPayslipPage",
              href: "",
              position: "1",
              border: "#b12143",
              isActive: 1
            },
            {
              menu: "Salary Card",
              menuImage:
                this.companyName !== "MIBL"
                  ? "white-salary-card"
                  : "black-salary-card",
              //link: 'SalaryCardPage',
              link: "",
              href: "",
              boxShadow: false,
              position: "2",
              border: "#f8e472",
              isActive: 1
            },
            {
              menu: "LTA Summary",
              menuImage:
                this.companyName !== "MIBL"
                  ? "white-lta-summary"
                  : "black-lta-summary",
              //link: 'LeaveTravelAllowancePage',
              link: "",
              href: "",
              position: "3",
              border: "#1caf9d",
              isActive: 1
            },
            {
              menu: "Income Tax",
              menuImage:
                this.companyName !== "MIBL"
                  ? "white-income-tax"
                  : "black-income-tax",
              link: "IncomeTaxSetPage",
              //link: '',
              href: "",
              position: "4",
              border: "#e37f92",
              isActive: 1
            },
            {
              menu: "Flexi Decl.",
              menuImage:
                this.companyName !== "MIBL" ? "white-flexi" : "black-flexi",
              // link: 'FlexiPage',
              link: "",
              href: "",
              position: "5",
              border: "#0a23af",
              isActive: 1
            },
            {
              menu: "Appraisal Letter",
              menuImage:
                this.companyName !== "MIBL" ? "white-payslip" : "black-payslip",
              link: this.companyName !== "MIBL" ? "" : "AppraisalLetterPage",
              href: "",
              position: "1",
              border: "#b12143",
              isActive: 1
            }
            // {
            //     menu:'Form 16',
            //     menuImage: (this.companyName !== 'MIBL') ? 'white-form16' : 'black-form16',
            //     //link: 'Form16Page',
            //     link: '',
            //     href: '',
            //     position: '6',
            //     border: '#f9a300',
            //     isActive: 1,
            // }
          ]
        },
        {
          tab: "Info",
          qid: "q3",
          menuImage: "white-info",
          href: "",
          isActive: 1,
          subMenu: [
            {
              menu: "",
              menuImage: "",
              link: "",
              href: "",
              position: "",
              border: "",
              isActive: 1
            },
            {
              menu: "Hospitals",
              menuImage:
                this.companyName !== "MIBL"
                  ? "white-hospital"
                  : "black-hospital",
              link: "HospitalsPage",
              href: "",
              position: "1",
              border: "#0a23af",
              isActive: 1
            },
            {
              menu: "Emergency",
              menuImage:
                this.companyName !== "MIBL"
                  ? "white-contacts"
                  : "black-contacts",
              link: "EmergencyContactsPage",
              href: "",
              position: "2",
              border: "#f9a300",
              isActive: 1
            },
            {
              menu: "25 years",
              menuImage: this.companyName !== "MIBL" ? "white-25" : "black-25",
              link: "GiftAcknowledgementPage",
              href: "",
              position: "3",
              border: "#f9a300",
              isActive: 1
            },
            {
              menu: "CSR",
              menuImage:
                this.companyName !== "MIBL" ? "white-csr" : "black-csr",
              link: "",
              href: this.isCSRUrl,
              position: "4",
              border: "#f9a300",
              isActive: 1
            }
          ]
        },
        {
          tab: " Offers",
          qid: "q4",
          menuImage: "white-policy",
          href: "https://www.m2all.com/offers",
          isActive: 1
        }
      ];

      // this.menu = [
      //   {
      //     tab: "Time",
      //     qid: "q1",
      //     menuImage: "white-time-attendance",
      //     href: "",
      //     isActive: 1,
      //     subMenu: [
      //       {
      //         menu: "",
      //         menuImage: "",
      //         link: "",
      //         href: "",
      //         position: "",
      //         border: "",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Attendance",
      //         menuImage:
      //           this.companyName !== "MIBL"
      //             ? "white-attendance"
      //             : "black-attendance",
      //         link: "AttendanceDetailsPage",
      //         href: "",
      //         position: "1",
      //         border: "#b12143",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Holiday",
      //         menuImage:
      //           this.companyName !== "MIBL" ? "white-holiday" : "black-holiday",
      //         link: "HolidayPage",
      //         href: "",
      //         position: "2",
      //         border: "#f8e472",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Success Factors",
      //         menuImage: this.companyName !== "MIBL" ? "white-sf" : "black-sf",
      //         link: "",
      //         //href: 'https://performancemanager4.successfactors.com',
      //         href:
      //           "https://performancemanager4.successfactors.com/login?company=mahindrama",
      //         position: "3",
      //         border: "#1caf9d",
      //         isActive: 1
      //       }
      //     ]
      //   },
      //   {
      //     tab: "Payroll",
      //     qid: "q2",
      //     menuImage: "white-payroll",
      //     href: "",
      //     isActive: 1,
      //     subMenu: [
      //       {
      //         menu: "My Payslip",
      //         menuImage:
      //           this.companyName !== "MIBL" ? "white-payslip" : "black-payslip",
      //         link: "CurrentPayslipPage",
      //         href: "",
      //         position: "1",
      //         border: "#b12143",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Salary Card",
      //         menuImage:
      //           this.companyName !== "MIBL"
      //             ? "white-salary-card"
      //             : "black-salary-card",
      //         link: "SalaryCardPage",
      //         //link: '',
      //         href: "",
      //         boxShadow: false,
      //         position: "2",
      //         border: "#f8e472",
      //         isActive: 1
      //       },
      //       {
      //         menu: "LTA Summary",
      //         menuImage:
      //           this.companyName !== "MIBL"
      //             ? "white-lta-summary"
      //             : "black-lta-summary",
      //         link: "LeaveTravelAllowancePage",
      //         //link: '',
      //         href: "",
      //         position: "3",
      //         border: "#1caf9d",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Income Tax",
      //         menuImage:
      //           this.companyName !== "MIBL"
      //             ? "white-income-tax"
      //             : "black-income-tax",
      //         link: "IncomeTaxSetPage",
      //         //link: '',
      //         href: "",
      //         position: "4",
      //         border: "#e37f92",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Flexi Decl.",
      //         menuImage:
      //           this.companyName !== "MIBL" ? "white-flexi" : "black-flexi",
      //         link: "FlexiPage",
      //         //link: '',
      //         href: "",
      //         position: "5",
      //         border: "#0a23af",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Appraisal Letter",
      //         menuImage:
      //           this.companyName !== "MIBL" ? "white-payslip" : "black-payslip",
      //         link: this.companyName == "MIBL" ? "AppraisalLetterPage" : "",
      //         href: "",
      //         position: "1",
      //         border: "#b12143",
      //         isActive: 1
      //       }
      //       // {
      //       //     menu:'Form 16',
      //       //     menuImage: (this.companyName !== 'MIBL') ? 'white-form16' : 'black-form16',
      //       //     //link: 'Form16Page',
      //       //     link: '',
      //       //     href: '',
      //       //     position: '6',
      //       //     border: '#f9a300',
      //       //     isActive: 1,
      //       // }
      //     ]
      //   },
      //   {
      //     tab: "Info",
      //     qid: "q3",
      //     menuImage: "white-info",
      //     href: "",
      //     isActive: 1,
      //     subMenu: [
      //       {
      //         menu: "",
      //         menuImage: "",
      //         link: "",
      //         href: "",
      //         position: "",
      //         border: "",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Hospitals",
      //         menuImage:
      //           this.companyName !== "MIBL"
      //             ? "white-hospital"
      //             : "black-hospital",
      //         link: "HospitalsPage",
      //         href: "",
      //         position: "1",
      //         border: "#0a23af",
      //         isActive: 1
      //       },
      //       {
      //         menu: "Emergency",
      //         menuImage:
      //           this.companyName !== "MIBL"
      //             ? "white-contacts"
      //             : "black-contacts",
      //         link: "EmergencyContactsPage",
      //         href: "",
      //         position: "2",
      //         border: "#f9a300",
      //         isActive: 1
      //       },
      //       {
      //         menu: "25 years gift",
      //         menuImage: this.companyName !== "MIBL" ? "white-25" : "black-25",
      //         link: "GiftAcknowledgementPage",
      //         href: "",
      //         position: "3",
      //         border: "#f9a300",
      //         isActive: 1
      //       },
      //       {
      //         menu: "CSR",
      //         menuImage:
      //           this.companyName !== "MIBL" ? "white-csr" : "black-csr",
      //         link: "",
      //         href: this.isCSRUrl,
      //         position: "4",
      //         border: "#f9a300",
      //         isActive: 1
      //       }
      //     ]
      //   },
      //   {
      //     tab: " Offers",
      //     qid: "q4",
      //     menuImage: "white-policy",
      //     href: "https://www.m2all.com/offers",
      //     isActive: 1
      //   }
      // ];

      console.log("my menu: ", this.menu);
      if (this.attendanceMananger == true) {
        var object = {
          menu: "Attendance Approval",
          menuImage:
            this.companyName !== "MIBL"
              ? "white-attendance"
              : "black-attendance",
          link: "AdminAttendancePage",
          href: "",
          position: "2",
          border: "#0a23af",
          isActive: 1
        };
        this.menu[0].subMenu.splice(2, 0, object);
        this.menu[0].subMenu.join();
        console.dir(this.menu[0].subMenu);
      }
      this.menuOpen(this.menu[0], 0);
    });
  }
  acknowledgeGift() {
    this.navCtrl.push("GiftAcknowledgementPage");
  }
  ionViewDidEnter() {
    //    this.authTokenValidate('[]');
  }

  openAlertBox(paramtitle, paramMessage) {
    let alert = this.alertCtrl.create({
      title: paramtitle,
      message: paramMessage,
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Ok",
          role: "ok",
          handler: () => {
            this.navCtrl.push("SfProfilePage");
          }
        }
      ]
    });
    alert.present();
  }

  authTokenValidate(params) {
    this.postService
      .getUserDetails()
      .then((user: any) => {
        const params = JSON.stringify({
          tokenid: user.tokenid
        });
        this.postService
          .getData("Account/CheckAuthTokenValidity", params)
          .then((response: any) => {
            this.postService.dismissLoading();
            console.log("GetDayAttendance response", JSON.stringify(response));
          });
      })
      .catch(error => {
        // this.postService.loading.dismiss();
        this.navCtrl.pop();
        this.postService.presentToast(error);
      });
  }

  menuOpen(subMenu, index) {
    let qid = subMenu.qid;
    this.state =
      qid === "q1"
        ? "deg1"
        : qid === "q2"
        ? "deg2"
        : qid === "q3"
        ? "deg3"
        : qid === "q4"
        ? "deg4"
        : "deg1";

    this.subMenuData = subMenu.subMenu;
    this.sIndex = index;
    if (
      subMenu.href != "" &&
      subMenu.href != undefined &&
      subMenu.href != null
    ) {
      window.open(subMenu.href, "_blank");
    }
  }
  subMenuOpen(m) {
    if (m.href != "" && m.href != undefined && m.href != null) {
      window.open(m.href, "_blank");
    }
    if (m.link != "" && m.link != undefined && m.link != null) {
      this.navCtrl.push(
        m.link,
        {},
        {
          animate: true,
          animation: "ios-transition",
          duration: 1000,
          direction: "forward"
        }
      );
    } else if (
      (m.href == "" || m.href == undefined || m.href == null) &&
      (m.link == "" || m.link == undefined || m.link == null)
    ) {
      this._service.presentToast("Coming Soon");
    }
  }

  openProfile() {
    this.navCtrl.push("SfProfilePage");
  }
  openNotification() {
    this.navCtrl.push("UserNotficationPage");
  }

  openApp() {
    const options: AppLauncherOptions = {
    }
    if(this.platform.is('ios')) {
      options.uri = 'fb://'
    } else {
      options.packageName = 'com.facebook.katana'
    }
    this.appLauncher.canLaunch(options)
    .then((canLaunch: boolean) => console.log('Facebook is available'))
    .catch((error: any) => console.error('Facebook is not available'));
  }

  logout() {
    let alert = this.alertCtrl.create({
      message: "Are you sure you want to logout?",
      buttons: [
        {
          text: "No",
          cssClass: "btn-alert-cancel",
          handler: () => {
            //alert.dismiss();
          }
        },
        {
          text: "Yes",
          cssClass: "btn-alert-ok",
          handler: () => {
            this._service
              .getData("Account/Logout", { tokenid: this.tokenId })
              .then((resp: any) => {
                alert.dismiss().then(() => {
                  this.storage.clear();
                  this.navCtrl.setRoot("LoginPage");
                });
              })
              .catch(() => {
                this._service.presentToast(
                  "Unable to logout at the moment. Please try again after sometime."
                );
              });
          }
        }
      ]
    });
    alert.present();
  }
  goToFeedback() {
    this.navCtrl.push(
      "FeedbackPage",
      {},
      {
        animate: true,
        animation: "ios-transition",
        duration: 1000,
        direction: "forward"
      }
    );
  }
}
