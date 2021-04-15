import {Component, NgZone} from '@angular/core';
import {App, IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {PostService} from "../../providers/api/PostService";
import {Storage} from "@ionic/storage";
import * as moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-holiday',
    templateUrl: 'holiday.html',
})
export class HolidayPage {
    ionDTmd;
    ionDTmdMax: string;
    companyName: any;
    dateList = [];
    /*today = new Date();
    todayMonth = this.today.getMonth()+1;
    todayYear = this.today.getFullYear();*/

    date;
    daysInThisMonth: any;
    daysInLastMonth: any;
    daysInNextMonth: any;
    monthNames: string[];
    days: string[];
    monthWiseHolidays: Array < {} > = [];
    currentMonth: any;
    currentYear: any;
    currentDate: any;
    currentDay: any;
    // headerDate: {};
    public markAttendancePage = "MarkAttendancePage";
    private today;
    private todayMonth;
    private todayYear;
    private loading;
    private direction: string;
    private direction1: string;
    ionDTMin: string;

    constructor(
        public navCtrl: NavController, public navParams: NavParams,
        private _appCtrl: App, public zone: NgZone,
        private postService: PostService, public loadingCtrl: LoadingController,
        public modalCtrl: ModalController, public _storage: Storage) {
        //this.headerDate = { "title": "" };
        this.postService.presentLoadingDefault();
        this.postService.getCurrentTime()
            .then(response => {
                this.postService.loading.dismiss();
                this.monthWiseHolidays = [];
                this.today = new Date(moment(response.toString()).format());
                this.date = new Date(moment(response.toString()).format());
                this.todayMonth = this.today.getMonth() + 1;
                this.todayYear = this.today.getFullYear();
                this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                this.currentDay = this.days[this.today.getDay()];
                //this.loading.dismiss();
                this.getDaysOfMonth(this.today.getMonth() + 1, this.today.getFullYear());

                this.ionDTmd = moment().toISOString();
                //  this.ionDTMin = moment(response).subtract(2, 'years').toISOString();
                this.ionDTMin = moment(response).year().toString();

                this.ionDTmdMax = moment().toISOString();

                this.postService.getUserDetails().then((userToken) => {
                    this.companyName = userToken['companyName'];

                });

            }).catch((error) => {
                this.postService.loading.dismiss();
                this.postService.presentToast(error);
                this.navCtrl.pop();
            });
    }

    ionDateTimeChange() {
        console.log("in change");
        this.date = moment(this.ionDTmd).toDate();
        this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }


    getDaysOfMonth(month, year) {
        console.log("in get days");
        this.postService.presentLoadingDefault();

        this.daysInThisMonth = new Array();
        this.daysInLastMonth = new Array();
        this.daysInNextMonth = new Array();
        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        this.postService.getUserDetails().then((getdata: any) => {
            console.log(getdata);
            let params = {
                "month": month,
                "year": year,
                "tokenid": getdata.tokenid
            };

            // this.postService.getData("Attendance/GetMonthAttendance", params)
            this.postService.getData("Attendance/GetMonthAttendanceNew", params)
                .then(response => {


                    this.postService.loading.dismiss();

                    this.monthWiseHolidays = [];
                    if (this.date.getMonth() === this.today.getMonth() && this.date.getFullYear() === this.today.getFullYear()) {
                        this.currentDate = this.today.getDate();
                    } else {
                        this.currentDate = 999;
                    }
                    this.dateList = response['data'];

                    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
                    let flg = false;
                    let startDay = this.dateList.findIndex(x => moment(x.AttendanceDate).get('date') == 1);
                    // let firstDates = []
                    // let j = 0;
                    // for (let dt of this.dateList) {
                    //     if (moment(dt.AttendanceDate).get('date') == 1)
                    //         firstDates.push(j);
                    //     j++;
                    // }
                    // let lastDay = firstDates.pop();
                    let lastDay = this.dateList.findIndex(x => moment(x.AttendanceDate).format('DD-MM-YYYY') === moment(this.dateList[startDay]['AttendanceDate']).endOf('month').format('DD-MM-YYYY'));
                    console.log(this.dateList[startDay]['AttendanceDate']);
                    console.log('startday: ', startDay, ' Lastday:', lastDay);
                    console.log(this.dateList);
                    console.log(moment(year + '-' + month + '1').endOf('month').date());
                    for (var i = startDay; i <= lastDay; i++) {
                        //console.log(i);
                        //  console.log("dateList: ", this.dateList[i]);
                        //console.log("dateListAtt: ",this.dateList[i]['AttendanceDate']);

                        // if (this.dateList[i] != undefined) {


                        // if (this.dateList[i] !== undefined) {

                        if ((this.dateList[i]['IsHoliday'] || this.dateList[i]['isOptionalHoliday'] || this.dateList[i]['isWeeklyOff']) && this.dateList[i]['HolidayDescription'] !== null &&
                            this.dateList[i]['HolidayDescription'] !== '') {

                            this.monthWiseHolidays.push({
                                date: this.dateList[i]['AttendanceDate'],
                                holidayDescription: this.dateList[i]['HolidayDescription'],
                                holidayType: this.dateList[i]['Status']
                            });
                        }
                        this.daysInThisMonth.push({
                            // day: i + 1,
                            day: moment(this.dateList[i]['AttendanceDate']).get('date'),
                            month: month,
                            year: year,
                            AttendanceDate: this.dateList[i]['AttendanceDate'],
                            HolidayDescription: this.dateList[i]['HolidayDescription'],
                            IsHoliday: this.dateList[i]['IsHoliday'],
                            Status: this.dateList[i]['Status'],
                            StatusDescription: this.dateList[i]['StatusDescription'],
                            isOptionalHoliday: this.dateList[i]['isOptionalHoliday'],
                            isWeeklyOff: this.dateList[i]['isWeeklyOff']
                        });

                        //}

                    }
                    console.log("mf holi: ", this.monthWiseHolidays);
                    if (this.direction1 == "2") {
                        this.direction = "2";
                    } else if (this.direction1 == "4") {
                        this.direction = "4";
                    }

                    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
                    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
                    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
                        this.daysInLastMonth.push(i);
                    }

                    // var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
                    // //var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
                    // for (var i = 0; i < (6 - lastDayThisMonth); i++) {
                    //   this.daysInNextMonth.push(i + 1);
                    // }
                    // var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
                    // if (totalDays < 36) {
                    //   for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
                    //     this.daysInNextMonth.push(i);
                    //   }
                    // }
                    this.daysInNextMonth = [];
                    for (let j = lastDay; j < this.dateList.length; j++) {
                        this.daysInNextMonth.push(j);
                    }

                });
        });

        console.log(this.daysInThisMonth);
    }

    /*goToLastMonth() {

        this.monthWiseHolidays = [];
        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());

    }

    goToNextMonth() {


        this.monthWiseHolidays = [];

        //this.paramsDate = this.date;
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());


    }*/
    goToLastMonth() {
        this.direction1 = "4";
        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.ionDTmd = moment(this.ionDTmd).subtract(1, 'month').toISOString();
        // this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }

    goToNextMonth() {
        this.direction1 = "2";
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        this.ionDTmd = moment(this.ionDTmd).add(1, 'month').toISOString();
        // this.getDaysOfMonth(this.date.getMonth() + 1, this.date.getFullYear());
    }

    openYearlyHoliday() {
        let modalCtrl = this.modalCtrl.create("YearHolidayPage");
        modalCtrl.present();
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
        /*this.direction = "";
        let i = 0;
        let j = 0;
        console.log("date: ", this.ionDTmd);
        let date = moment(this.ionDTmd).toDate();


        if (e.direction == 2) {
            this.direction1 = "2";
            if (date.getMonth() == 11) {
                i = 1;
                j = 1;
            }
            else {
                i = date.getMonth() + 2;
                j = 0
            }
            this.ionDTmd = moment(date.getDate() +  i + (date.getFullYear() + j) , 'YYYY-MM-DD').toDate();
            console.log("this.ionDTmd",this.ionDTmd);
            this.getDaysOfMonth(i, date.getFullYear() + j);
            // this.goToNextMonth();
        } else if (e.direction == 4) {
            this.direction1 = "4";
            this.goToLastMonth();
        }
        else return false;*/
    }


}
