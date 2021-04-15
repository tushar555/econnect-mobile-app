import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { PostService } from "../../../providers/api/PostService";

/**
 * Generated class for the YearHolidayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-year-holiday",
  templateUrl: "year-holiday.html"
})
export class YearHolidayPage {
  fixedholiday: boolean = true;
  weekoffholiday: boolean = false;
  optionalholiday: boolean = false;
  FixedHolidays: any;
  OptionalHolidays: any;
  WeekoffHolidays: { HolidayDate: string; HolidayDescription: string }[];

  constructor(
    private postService: PostService,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.getYearlyHolidays();
  }

  ionViewDidLoad() {
    //this.getYearlyHolidays();
  }

  loadFixedView() {
    //window.screen.orientation.lock("portrait");
    this.optionalholiday = false;
    this.weekoffholiday = false;
    this.fixedholiday = true;
  }

  loadOptionalView() {
    // alert("IN");
    //window.screen.orientation.lock("portrait");
    this.weekoffholiday = false;
    this.fixedholiday = false;
    this.optionalholiday = true;
  }

  loadWeeklyView() {
    //window.screen.orientation.lock("landscape");
    this.optionalholiday = false;
    this.fixedholiday = false;
    this.weekoffholiday = true;
  }

  getYearlyHolidays() {
    this.postService.presentLoadingDefault();
    this.postService.getUserDetails().then((getdata: any) => {
      let param = {
        tokenid: getdata.tokenid
      };
      this.postService
        .getData("Attendance/getHolidaysInYear", param)
        .then((resp: any) => {
          this.FixedHolidays = resp.FixedHolidays;
          this.OptionalHolidays = resp.OptionalHolidays;
          console.log("resp");

          this.WeekoffHolidays = this.getWeeklyHoliday(); // response.WeekoffHolidays
          this.postService.loading.dismiss();

          //  console.log('response.data',response);
        });
    });
  }

  getDay(HolidayDate) {
    var days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    var d = new Date(HolidayDate);
    var dayName = days[d.getDay() - 1];
    return dayName;
  }

  getWeeklyHoliday() {
    return [
      {
        HolidayDate: "2019-01-26T00:00:00",
        HolidayDescription: "Republic Day"
      },
      {
        HolidayDate: "2019-04-06T00:00:00",
        HolidayDescription: "Gudi Padwa"
      },
      {
        HolidayDate: "2019-04-13T00:00:00",
        HolidayDescription: "Ram Navami"
      },
      {
        HolidayDate: "2019-04-14T00:00:00",
        HolidayDescription: "Dr B. Ambedkar Jayanti"
      },
      {
        HolidayDate: "2019-05-18T00:00:00",
        HolidayDescription: "Buddha Pournima"
      },
      {
        HolidayDate: "2019-08-17T00:00:00",
        HolidayDescription: "Parsi New Year"
      },
      {
        HolidayDate: "2019-10-27T00:00:00",
        HolidayDescription: "Diwali (Laxmi Pujan)"
      },
      {
        HolidayDate: "2019-11-10T00:00:00",
        HolidayDescription: "Id-E-Milad"
      }
    ];
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
