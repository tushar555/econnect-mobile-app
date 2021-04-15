import { Component, NgZone } from "@angular/core";
import {
  App,
  Events,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Platform
} from "ionic-angular";
import { PostService } from "../../../providers/api/PostService";
import { DayDetailsPage } from "../day-details/day-details";
import { Storage } from "@ionic/storage";
import * as moment from "moment";
declare var window;
@IonicPage()
@Component({
  selector: "page-attendance-details",
  templateUrl: "attendance-details.html"
})
export class AttendanceDetailsPage {
  companyName: any;
  selectedGrid: any;
  isHoEmp: any;
  temp: any;
  tempArray: any;
  lastMonthActive: any;
  noOfWeeks: number;
  dateList = [];
  totalDaysInMonth = [];
  weeklyData: any;
  weeklyTotal = {
    hours: "",
    minutes: ""
  };
  public openFooter: boolean = false;
  /*today = new Date();
    todayMonth = this.today.getMonth()+1;
    todayYear = this.today.getFullYear();*/
  value: boolean = false;
  weekList = [];
  Arr = Array;
  date: Date;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  days: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  currentDay: any;
  showCalendar: boolean = true;
  public markAttendancePage = "MarkAttendancePage";
  private loginStatus: any = "I";
  private loginStatusDesc: string = "Punch In";
  private currentParamTime;
  private today;
  private todayMonth;
  private todayYear;
  private direction: string = "0";
  private direction1: string;
  ionDTmd: string;
  ionDTmdMax: string;
  public ionDTMin: string;
  listHeader = [];
  IsAttendancePunch: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private postService: PostService,
    public zone: NgZone,
    public platform: Platform,
    public modalCtrl: ModalController,
    public storage: Storage,
    public event: Events
  ) {
    //app.navTitle = "Attendance";

    this.weeklyTotal.hours = "";
    this.weeklyTotal.minutes = "";
   
    this.postService.getUserDetails().then((userToken: any) => {
      this.isHoEmp = userToken["isHOEmp"];
      this.IsAttendancePunch = userToken.IsAttendancePunch;
    });

    this.postService.AttendanceCall.subscribe(() => {
      this.getDetails();
    });
    this.ionDTmd = moment().toISOString();

    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
    });
    //this.getDetails();
  }

  ionViewDidLoad() {
    this.getDetails();
  }

  getDetails() {
    this.postService
      .getCurrentTime()
      .then(response => {
        this.today = new Date(moment(response.toString()).format());
        this.date = new Date(moment(response.toString()).format());
        this.todayMonth = this.today.getMonth() + 1;
        this.todayYear = this.today.getFullYear();

        this.ionDTmdMax = this.today.getFullYear();
        this.ionDTMin = moment(response.toString())
          .subtract(1, "year")
          .month("April")
          .toISOString();
     
        this.monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        this.days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];
        this.currentDay = this.days[this.today.getDay()];
        this.getDaysOfMonth(
          this.today.getMonth() + 1,
          this.today.getFullYear()
        ); //changes in remove +1 in month
        //  this.postService.loading.dismiss();

        this.currentParamTime = response;
        this.postService.getUserDetails().then((user: any) => {
          const params = JSON.stringify({
            tokenid: user.tokenid,
            AttendanceDate: response
          });
          this.postService
            .getData("/Attendance/getPunchData", params)
            .then((response: any) => {
              //   this.postService.dismissLoading();
              if (response.TimeType == null) {
                this.loginStatusDesc = "Punch In";
                this.loginStatus = "I";
              }
              if (response.TimeType == "I") {
                this.loginStatusDesc = "Punch Out";
                this.loginStatus = "O";
              }
              if (response.TimeType == "O") {
                this.loginStatusDesc = "Punch Out";
                this.loginStatus = "O";
              }

              console.log("Login Status", this.loginStatus);
              console.log("Login Status DESC ", this.loginStatusDesc);
            });
        });
      })
      .catch(error => {
        // this.postService.loading.dismiss();
        //this.navCtrl.pop();
        this.postService.presentToast(error);
      });
  }

  loadCalendarView() {
    window.screen.orientation.lock("portrait");
    this.showCalendar = true;
  }

  loadListView() {
    //window.screen.orientation.lock('landscape');
    window.screen.orientation.lock("landscape-primary");
    this.showCalendar = false;
  }
  ionViewWillEnter() {
    if (this.showCalendar) {
      window.screen.orientation.lock("portrait");
    } else {
      window.screen.orientation.lock("landscape-primary");
    }
  }

  arrayOne(): any[] {
    // console.log('NO', this.noOfWeeks);
    if (this.weeklyData) return Array(this.weeklyData.length);
    else return Array();
    // if(this.dateList){
    //   let weeks = Math.ceil(this.dateList.length / 7)+1;
    //   let date15 = moment('15-'+this.currentMonth+'-'+this.currentYear).day();
    //   if(date15 == 6 || date15 == 0){
    //     weeks--;
    //   }
    //   return Array(weeks);
    // }
    // return Array();
  }

  getNoOfWeeks(year, month) {
    console.log("YEAR", year, "MOnth", month);

    let startDate = moment([year, month]);
    let firstDay = moment(startDate).startOf("month");
    let endDay = moment(startDate).endOf("month");
    let count = 0;
    console.log("FIRST", moment(firstDay.calendar()).week());
    console.log("LAST", moment(endDay.calendar()).week());

    for (
      let i = moment(firstDay.calendar()).week();
      i <= moment(endDay.calendar()).week();
      i++
    ) {
      count++;

      let days = [1, 2, 3, 4, 5, 6].map(d =>
        moment(year + "-" + i + "-" + d, "YYYY-W-E")
      );
      console.log("DAY", days);

      this.weekList.push(days);
    }

    // console.log('WEEKLIST', this.weekList);

    // var firstOfMonth = new Date(year, month - 1, 1);
    // var lastOfMonth = new Date(year, month, 0);

    // var used = firstOfMonth.getDay() + lastOfMonth.getDate();

    return count;
  }

  gotoAdminSection() {
    let profileModal = this.modalCtrl.create("AdminAttendancePage");
    profileModal.present();
  }
  TimeMinutes(n) {
    let num = n;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    let hours1 = rhours < 10 ? "0" + rhours : rhours;
    let minutes1 = rminutes < 10 ? "0" + rminutes : rminutes;
    return hours1 + ":" + minutes1;
    //return rhours + ":" + rminutes + ":" + '00';
  }

  getDaysOfMonth(month, year) {
    this.totalDaysInMonth = [];
    this.tempArray = [{}];
    console.log("Month", month, "Year", year);

    this.postService.presentLoadingDefault();

    this.noOfWeeks = this.getNoOfWeeks(year, month);

    if (this.direction1 == "2") {
      this.direction = "2";
    } else if (this.direction1 == "4") {
      this.direction = "4";
    }
    console.log("direction: " + this.direction);

    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    // this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentMonth = this.date.getMonth();
    this.currentYear = this.date.getFullYear();
    console.log("markAtt");

    var thisNumOfDays = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();
    for (var i = 1; i <= thisNumOfDays; i++) {
      this.daysInThisMonth.push({
        day: i,
        month: month,
        year: year,
        AttendanceDate: "",
        HolidayDescription: null,
        IsHoliday: null,
        Status: "",
        StatusDescription: "",
        TimeIn: "",
        TimeInSource: "",
        TimeInConsidered: "",
        TimeOutConsidered: "",
        TimeOut: "",
        TimeOutSource: "",
        LatitudeIn: null,
        LongitudeIn: null,
        LatitudeOut: null,
        LongitudeOut: null,
        Remarks: null,
        SFRegularized: null
      });
    }
    var firstDayThisMonth = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      1
    ).getDay();
    var prevNumOfDays = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0
    ).getDate();
    for (
      var i = prevNumOfDays - (firstDayThisMonth - 1);
      i <= prevNumOfDays;
      i++
    ) {
      console.log("PREV", i);

      this.daysInLastMonth.push(i);
    }

    /*		var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
                for (var i = 0; i < thisNumOfDays; i++) {
                  console.log(i);
                    this.daysInThisMonth.push(i+1);
                }*/

    var lastDayThisMonth = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDay();
    //var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var i = 0; i < 6 - lastDayThisMonth; i++) {
      this.daysInNextMonth.push(i + 1);
    }
    console.log("LENGTH", this.daysInLastMonth.length, this.daysInLastMonth);

    var totalDays =
      this.daysInLastMonth.length +
      this.daysInThisMonth.length +
      this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (var i = 7 - lastDayThisMonth; i < 7 - lastDayThisMonth + 7; i++) {
        this.daysInNextMonth.push(i);
      }
    }

    // setTimeout(() => {
    // this.storage.get('username').then((data) => {
    this.postService.getUserDetails().then((user: any) => {
      let params = {
        month: month,
        year: year,
        tokenid: user.tokenid
      };
      console.log("PARAMS ", params);

      // this.postService.getData("Attendance/GetMonthAttendance", params)
      this.postService
        .getData("Attendance/GetMonthAttendanceNew", params)
        .then(response => {
          this.direction = "0";
          console.log(response);
          if (
            this.date.getMonth() === this.today.getMonth() &&
            this.date.getFullYear() === this.today.getFullYear()
          ) {
            this.currentDate = this.today.getDate();
          } else {
            this.currentDate = 999;
          }

          this.dateList = response["data"];
          this.weeklyData = this.weeklySegregation();
          console.log("my weeklydata: " + JSON.stringify(this.weeklyData));
          //var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
          let offsetlen = this.daysInLastMonth.length;
          for (let i = 0; i < this.daysInThisMonth.length; i++) {
            let offset = i + offsetlen;
            if (this.dateList[offset] != undefined) {
              /*this.daysInThisMonth[i]['month'] = month;
                            this.daysInThisMonth[i]['year'] = year;*/
              let clockedHours = "";
              // if (this.dateList[offset]['TimeIn'] && this.dateList[offset]['TimeOut']) {
              //     clockedHours = this.msToTime(new Date(this.dateList[offset]['TimeOut']).getTime() - new Date(this.dateList[offset]['TimeIn']).getTime());
              // }

              if (
                this.dateList[offset].MinutesConsidered != null &&
                this.dateList[offset].MinutesConsidered != 0
              ) {
                console.dir(this.dateList[offset].MinutesConsidered);
                clockedHours = this.TimeMinutes(
                  this.dateList[offset].MinutesConsidered
                );
                //dateInfo['clockedHours']=clockedHours;
              } else {
                clockedHours = "-";
              }
              console.dir(this.dateList[offset]["TimeInConsidered"]);
              this.daysInThisMonth[i]["AttendanceDate"] = this.dateList[offset][
                "AttendanceDate"
              ];
              this.daysInThisMonth[i]["HolidayDescription"] = this.dateList[
                offset
              ]["HolidayDescription"];
              this.daysInThisMonth[i]["IsHoliday"] = this.dateList[offset][
                "IsHoliday"
              ];
              this.daysInThisMonth[i]["Status"] = this.dateList[offset][
                "Status"
              ];
              this.daysInThisMonth[i]["IsHoliday"] = this.dateList[offset][
                "IsHoliday"
              ];
              this.daysInThisMonth[i]["StatusDescription"] = this.dateList[
                offset
              ]["StatusDescription"];
              this.daysInThisMonth[i]["TimeIn"] = this.dateList[offset][
                "TimeIn"
              ];
              this.daysInThisMonth[i]["TimeInSource"] = this.dateList[offset][
                "TimeInSource"
              ];
              this.daysInThisMonth[i]["TimeOut"] = this.dateList[offset][
                "TimeOut"
              ];
              this.daysInThisMonth[i]["TimeOutSource"] = this.dateList[offset][
                "TimeOutSource"
              ];
              this.daysInThisMonth[i]["LatitudeIn"] = this.dateList[offset][
                "LatitudeIn"
              ];
              this.daysInThisMonth[i]["LongitudeIn"] = this.dateList[offset][
                "LongitudeIn"
              ];
              this.daysInThisMonth[i]["LatitudeOut"] = this.dateList[offset][
                "LatitudeOut"
              ];
              this.daysInThisMonth[i]["LongitudeOut"] = this.dateList[offset][
                "LongitudeOut"
              ];
              this.daysInThisMonth[i]["clockedHours"] = clockedHours;
              this.daysInThisMonth[i]["Remarks"] = this.dateList[offset][
                "Remarks"
              ];
              this.daysInThisMonth[i]["SFRegularized"] = this.dateList[offset][
                "SFRegularized"
              ];
              this.daysInThisMonth[i]["TimeInConsidered"] = this.dateList[
                offset
              ]["TimeInConsidered"];
              this.daysInThisMonth[i]["TimeOutConsidered"] = this.dateList[
                offset
              ]["TimeOutConsidered"];
              this.daysInThisMonth[i]["MinutesConsidered"] = this.dateList[
                offset
              ]["MinutesConsidered"];
              console.log(
                "ABV",
                this.dateList[offset],
                "loop Value",
                this.daysInThisMonth[i]["day"],
                this.daysInThisMonth[i]["Status"]
              );
            } else {
              let checkDate = new Date(
                this.date.getFullYear(),
                this.date.getMonth(),
                i + 1
              );
              console.log("in else: " + checkDate);
              console.log(this.today);
              let status = "";
              let description = "";
              if (this.days[checkDate.getDay()] === "Sunday") {
                status = "H";
                description = "Holiday";
              } else if (checkDate < this.today) {
                status = "A";
                description = "Absent";
              }
              console.log("status: " + status);
              this.daysInThisMonth[i]["AttendanceDate"] = this.date;
              this.daysInThisMonth[i]["HolidayDescription"] = null;
              this.daysInThisMonth[i]["IsHoliday"] = null;
              this.daysInThisMonth[i]["Status"] = status;
              this.daysInThisMonth[i]["StatusDescription"] = description;
              this.daysInThisMonth[i]["TimeIn"] = "No details found";
              this.daysInThisMonth[i]["TimeInSource"] = "No details found";
              this.daysInThisMonth[i]["TimeOut"] = "No details found";
              this.daysInThisMonth[i]["TimeOutSource"] = "No details found";
              this.daysInThisMonth[i]["LatitudeIn"] = null;
              this.daysInThisMonth[i]["LongitudeIn"] = null;
              this.daysInThisMonth[i]["LatitudeOut"] = null;
              this.daysInThisMonth[i]["LongitudeOut"] = null;
              this.daysInThisMonth[i]["clockedHours"] = null;
              this.daysInThisMonth[i]["Remarks"] = null;
              this.daysInThisMonth[i]["SFRegularized"] = null;
              this.daysInThisMonth[i]["TimeInConsidered"] = null;
              this.daysInThisMonth[i]["TimeOutConsidered"] = null;
              this.daysInThisMonth[i]["MinutesConsidered"] = "No details found";
            }
          }
          // this.totalDaysInMonth.push(this.daysInThisMonth);
          console.log("LAST MONTH", this.daysInLastMonth);
          console.log("THIS MONTH", this.daysInThisMonth);
          console.log("Next MONTH", this.daysInNextMonth);
          // this.totalDaysInMonth.push(this.daysInLastMonth);
          // this.totalDaysInMonth.push(this.daysInThisMonth);
          //this.totalDaysInMonth.push(this.daysInNextMonth);
          // console.log('TOTAL DAys', this.totalDaysInMonth);
          console.dir(this.daysInThisMonth);
          this.daysInLastMonth.forEach(item => {
            this.totalDaysInMonth.push({ iscurrent: false, day: item });
          });

          this.daysInThisMonth.forEach(item => {
            this.totalDaysInMonth.push({ iscurrent: true, day: item.day });
          });

          this.daysInNextMonth.forEach(item => {
            this.totalDaysInMonth.push({ iscurrent: false, day: item });
          });

          if (moment().get("month") == moment(this.ionDTmd).get("month")) {
            this.getCurrentWeek().then(dt => {
              this.showWeekDetails(dt);
            });
          } else {
            this.showWeekDetails(0);
          }
          console.log("TOTAL DAys", this.temp);
          console.log(this.weeklyData);

          this.postService.dismissLoading();
        })
        .catch(error => {
          this.postService.dismissLoading();

          this.postService.presentToast(error);
        });
    });

    // });

    // }, 1000);
  }

  goToLastMonth() {
    this.direction1 = "4";
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.ionDTmd = moment(this.ionDTmd)
      .subtract(1, "month")
      .toISOString();
    this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
  }

  goToNextMonth() {
    this.direction1 = "2";
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.ionDTmd = moment(this.ionDTmd)
      .add(1, "month")
      .toISOString();
    this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
  }

  /*    goToLastYear() {
        this.direction1 = "4";
        this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth());
        this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }

    goToNextYear() {
        this.direction1 = "2";
        this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth());
        this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }*/

  /*changeMonth(month) {
        this.date = new Date(this.date.getFullYear(), this.currentMonth);
        this.getDaysOfMonth(this.currentMonth + 1, this.date.getFullYear());
    }*/

  dateChanged(evt) {
    if (
      moment(evt).year() === this.today.getFullYear() &&
      this.today.getMonth() < moment(evt).month()
    ) {
      //this.ionDTmd = "";
      this.postService.presentToast(
        "Sorry!You are not allowed to select future dates."
      );
    } else if (
      moment(evt).year() === this.today.getFullYear() - 1 &&
      moment(evt).month() + 1 < 4
    ) {
      //this.ionDTmd = "MM,YYYY";
      this.postService.presentToast(
        "Please select date between current finacial year."
      );
    } else {
      this.date = moment(this.ionDTmd).toDate();
      this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }
  }

  changed(evt) {
    // the 'checked' value now is on $event.detail.value
    // instead of '$event.checked'
    // if (evt !== this.value) {
    // do things

    if (
      evt.year === this.date.getFullYear() &&
      this.date.getMonth() < evt.month
    ) {
      this.ionDTmd = moment().toISOString();
      this.postService.presentToast(
        "Sorry!You are not allowed to select future dates."
      );
      return false;
    } else if (
      evt.year === this.date.getFullYear() - 1 &&
      this.date.getMonth() < 4
    ) {
      this.postService.presentToast(
        "Please select date between current finacial year."
      );

      //  t
    } else {
      this.date = moment(this.ionDTmd).toDate();
      this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }

    //  }
  }

  ionDateTimeChange(event) {
    // alert(123);
    // console.log(this.date);
    // this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
  }

  swipeCalendar(e) {
    this.direction = "0";
    console.log("swipe", e);
    console.log("swipe-direction", e.direction);
    if (e.direction == 2) {
      this.direction1 = "2";
      this.goToNextMonth();
    } else if (e.direction == 4) {
      this.direction1 = "4";
      this.goToLastMonth();
    } else return false;
  }

  dayDetails(data) {
    console.log("open popup clicked");
    console.dir(data);
    this.navCtrl.push("DayDetailsPage", { data: data });
  }

  markAttendance() {
    // let profileModal = this.modalCtrl.create("MarkAttendancePage");
    // profileModal.present();
    // profileModal.onWillDismiss(() => {

    // })
    this.navCtrl.push("MarkAttendancePage");
  }

  formatDate(date, format) {
    return moment(date).format(format);
    //let date = new Date("2018-05-02T09:58:21");
    //let hours =  this.pad(date.getHours() % 12 || 12);
    //let meridian = hours >= 12 ? 'PM' : 'AM';
    // return d+" "+date+" "+this.pad(date.getDate()) + "-" + this.pad(this.monthNames[date.getMonth()]) + "-" +
    //   this.pad(date.getFullYear()) + " " + this.pad(date.getHours()) + ":" + this.pad(date.getMinutes());
  }

  pad(s) {
    return s < 10 ? "0" + s : s;
  }

  msToTime(duration) {
    let seconds = Math.floor(duration / 1000) % 60;
    let minutes = Math.floor(duration / (1000 * 60)) % 60;
    let hours = Math.floor(duration / (1000 * 60 * 60)) % 24;

    let hours1 = hours < 10 ? "0" + hours : hours;
    let minutes1 = minutes < 10 ? "0" + minutes : minutes;
    let seconds1 = seconds < 10 ? "0" + seconds : seconds;

    return hours1 + ":" + minutes1 + ":" + seconds1;
  }

  showWeekDetails(week) {
    // alert('LAOA' + this.totalDaysInMonth);
    this.selectedGrid = week;
    // this.tempArray = this.weekList[week];
    this.lastMonthActive = false;
    switch (true) {
      case week === 0:
        this.lastMonthActive = true;
        this.tempArray = this.totalDaysInMonth.slice(0, 7);
        console.log(this.lastMonthActive);
        break;
      case week === 1:
        this.tempArray = this.totalDaysInMonth.slice(7, 14);
        break;
      case week === 2:
        this.tempArray = this.totalDaysInMonth.slice(14, 21);
        break;
      case week === 3:
        this.tempArray = this.totalDaysInMonth.slice(21, 28);
        break;
      case week === 4:
        this.tempArray = this.totalDaysInMonth.slice(28);
        break;
      case week === 5:
        this.tempArray = this.totalDaysInMonth.slice(28);
        break;
    }
    console.log(this.weeklyData[week]);
    this.calculateWeeklyTime(week);
    // var beginningOfWeek = moment().week(week).startOf('week');
    // var endOfWeek = moment().week(week).startOf('week').add(6, 'days');
    // console.log('HELLO', beginningOfWeek.format('MMMM'));
    // console.log('bye', endOfWeek.format('MMMM'));
  }

  calculateWeeklyTime(week) {
    let curWeekData = this.weeklyData[week];
    let totalMinutes = 0;
    curWeekData.forEach(el => {
      totalMinutes += el.MinutesConsidered;
    });
    this.weeklyTotal.minutes = Math.round(totalMinutes % 60).toString();
    this.weeklyTotal.hours = Math.floor(totalMinutes / 60).toString();
    return { hours: this.weeklyTotal.hours, minutes: this.weeklyTotal.minutes };
  }

  getHoursMinutes(totalminutes) {
    if (totalminutes == null || totalminutes == 0) {
      return { hours: "--", minutes: "--" };
    }
    let mins = (totalminutes % 60).toString();
    let hrs = Math.floor(totalminutes / 60).toString();
    mins = "0" + mins;
    hrs = "0" + hrs;
    return { hours: hrs.slice(0, 2), minutes: mins.slice(0, 2) };
  }
  futureDateWeek() {
    if (
      (this.weeklyTotal.hours == "00" || this.weeklyTotal.hours == "0") &&
      (this.weeklyTotal.minutes == "00" || this.weeklyTotal.minutes == "0")
    ) {
      return true;
    } else {
      return false;
    }
  }
  checkDateCurMonth(calDate) {
    let curMonth = moment(this.date).get("month");
    let calDateMonth = moment(calDate).get("month");
    // if (curMonth != calDateMonth) return true;
    // else return false;
    return false;
  }

  calculateWeeklyHours(week) {
    let curWeekData = this.weeklyData[week];
    let totalHours = 0;
    curWeekData.forEach(el => {
      if (el.TimeIn && el.TimeOut) {
        let start = moment(el.TimeIn);
        let end = moment(el.TimeOut);
        let duration = moment.duration(end.diff(start));
        totalHours += duration.asHours();
      }
    });
    let hrs = Math.floor(totalHours);
    let min = totalHours.toString().split(".")[1];
    min = (parseFloat("0." + min) * 60).toString();
    min = parseInt(min).toString();
    let totalHoursObj = {};
    totalHoursObj["totalHours"] = totalHours;
    totalHoursObj["hours"] = hrs;
    totalHoursObj["minutes"] = parseInt(min);
    this.weeklyTotal.hours = hrs.toString();
    this.weeklyTotal.minutes = min;
    console.log(totalHoursObj);
  }

  weeklySegregation() {
    let weeklyData = [];
    let curWeek = 0;
    weeklyData[0] = [];
    for (let i = 0; i < this.dateList.length; i++) {
      if (
        moment(this.dateList[i].AttendanceDate).date() ==
        moment(this.today).date()
      ) {
        console.log("in if");
        this.dateList[i].currentDate = true;
      } else {
        this.dateList[i].currentDate = false;
      }
      weeklyData[curWeek].push(this.dateList[i]);
      if (
        i < this.dateList.length - 1 &&
        (moment(this.dateList[i + 1].AttendanceDate).day() == 0 ||
          (moment(this.dateList[i].AttendanceDate).date() == 15 &&
            moment(this.dateList[i].AttendanceDate).day() != 0))
      ) {
        curWeek++;
        weeklyData[curWeek] = [];
      }
    }
    return weeklyData;
  }

  checkWeekActive(d) {
    let flg = false;
    if (this.weeklyData && this.selectedGrid > -1) {
      for (let el of this.weeklyData[this.selectedGrid]) {
        if (el.AttendanceDate == d.AttendanceDate) {
          flg = true;
          break;
        }
      }
    }
    return flg;
  }

  nextMonthActive(i) {
    if (this.selectedGrid == this.arrayOne().length - 1) {
      // console.log(this.weeklyData[this.selectedGrid]);
      // console.log(this.daysInNextMonth);
      let flg = false;
      for (let el of this.weeklyData[this.selectedGrid]) {
        // console.log(moment(el.AttendanceDate).date());
        if (this.daysInNextMonth[i] == moment(el.AttendanceDate).date()) {
          flg = true;
          break;
        }
      }
      return flg;
    }
  }

  checkDate(d) {
    if (this.tempArray !== undefined) {
      const checkDay = obj => obj.day === d.day && obj.iscurrent;
      console.log(checkDay);

      if (this.tempArray.some(checkDay)) {
        return true;
      } else {
        return false;
      }
    }

    // if (this.tempArray.indexOf(d.day)) {
    //   console.log('T');
    //   return true;
    // } else {
    //   console.log('F');
    //   return false;
    // }
  }

  checkCurrentDayWeek() {
    let foundIndex = this.totalDaysInMonth.findIndex(
      obj => obj.day == moment(this.today).date() && obj.iscurrent
    );

    switch (true) {
      case foundIndex >= 0 && foundIndex < 7:
        this.showWeekDetails(0);
        break;
      case foundIndex >= 7 && foundIndex < 14:
        this.showWeekDetails(1);
        break;
      case foundIndex >= 14 && foundIndex < 21:
        this.showWeekDetails(2);
        break;
      case foundIndex >= 21 && foundIndex < 28:
        this.showWeekDetails(3);
        break;
      case foundIndex >= 28 && foundIndex < 35:
        this.showWeekDetails(4);
        break;
    }
  }

  getCurrentWeek() {
    let promise = new Promise((resolve, reject) => {
      let i = 0;
      if (this.weeklyData) {
        this.weeklyData.forEach(week => {
          week.forEach(day => {
            console.log(moment(day.AttendanceDate).format("DD-MM-YYYY"));
            if (
              moment(day.AttendanceDate).format("DD-MM-YYYY") ==
              moment().format("DD-MM-YYYY")
            ) {
              resolve(i);
            }
          });
          i++;
        });
      }
    });
    return promise;
  }

  openAttendancePolicy() {
    let modalCtrl = this.modalCtrl.create("AttendancePolicyPage");
    modalCtrl.present();
  }

  // checkMarkAttendanceType() {
  //   this.postService.getCurrentTime()
  //         .then(response => {
  //             console.log("response: ", response);
  //             this.currentTime = response;
  //
  //
  //         });
  //
  // }
  openLegendView() {
    // this.checkStatus = !this.checkStatus;
  }
  ionViewDidLeave() {
    console.log("in leave");
    window.screen.orientation.lock("portrait");
  }
}
