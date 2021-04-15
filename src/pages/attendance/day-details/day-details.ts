import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Slides
} from "ionic-angular";
import { GoogleMap, GoogleMaps } from "@ionic-native/google-maps";
//import { Geolocation } from "@ionic-native/geolocation";
import { PostService } from "../../../providers/api/PostService";
import * as moment from "moment";
import { Constant } from "../../../providers/constant";
import { DomSanitizer } from "@angular/platform-browser";
/**
 * Generated class for the DayDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: "page-day-details",
  templateUrl: "day-details.html",
  providers: [GoogleMaps]
})
export class DayDetailsPage {
  @ViewChild("logoutMap") mapLogoutElement: ElementRef;
  @ViewChild("loginMap") mapLoginElement: ElementRef;

  map;
  showRegularize: any = true;
  private dateDetails: any = {};
  mapIn: GoogleMap;
  mapOut: GoogleMap;
  private latitudeIn: any;
  private longitudeIn: any;
  private latitudeOut: any;
  private longitudeOut: any;
  private showLoginMap: boolean;
  private clockedHours;

  companyName: any;
  @ViewChild(Slides) slides: Slides;
  loginMapSrc: any;
  logoutMapSrc: any;

  constructor(
   // private geolocation: Geolocation,
    public sanitizer: DomSanitizer,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private postService: PostService
  ) {
    console.log(navParams.get("data"));
    // this.slides.lockSwipes(true);

    this.dateDetails = navParams.get("data");
    console.log(this.dateDetails);
    console.log("mapLoginElementmapLoginElement", this.mapLoginElement);

    this.latitudeIn = this.dateDetails.LatitudeIn;
    this.longitudeIn = this.dateDetails.LongitudeIn;
    this.latitudeOut = this.dateDetails.LatitudeOut;
    this.longitudeOut = this.dateDetails.LongitudeOut;
    console.log(
      "this.latitudeIn: " +
        this.latitudeIn +
        "|this.longitudeIn: " +
        this.longitudeIn +
        "|this.latitudeOut: " +
        this.latitudeOut +
        "|this.longitudeOut: " +
        this.longitudeOut
    );

    // if (this.dateDetails.TimeIn && this.dateDetails.TimeOut) {
    //   this.clockedHours = this.msToTime(new Date(moment(this.dateDetails.TimeOut).format()).getTime() - new Date(moment(this.dateDetails.TimeIn).format()).getTime());
    // }
    if (
      this.dateDetails.MinutesConsidered != null &&
      this.dateDetails.MinutesConsidered != 0
    ) {
      console.dir(this.dateDetails.MinutesConsidered);
      this.clockedHours = this.TimeMinutes(this.dateDetails.MinutesConsidered);
      //dateInfo['clockedHours']=clockedHours;
    } else {
      this.clockedHours = "No Details Found";
    }

    if (this.latitudeIn || this.longitudeIn) {
      console.log("in if");
      setTimeout(() => {
        this.loadInMap();
      }, 300);
    }
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
    });
  }
  public closeModal() {
    this.viewCtrl.dismiss();
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
  ionViewDidLoad() {
    console.log("ionViewDidLoad DayDetailsPage");
  }
  loadInMap() {
    this.showLoginMap = true;
    this.loginMapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      Constant.mapUrl + this.latitudeIn + "," + this.longitudeIn
    );
    // let latLng = new google.maps.LatLng(this.latitudeIn, this.longitudeIn);
    // let mapOptions= {
    //   zoom: 18,
    //   center: latLng,
    //   mapTypeControl: false,
    //   draggable: false,
    //   scaleControl: false,
    //   navigationControl: false,
    //   zoomControl : false,
    //   disableDefaultUI: true,
    //   streetViewControl: false,
    //   fullscreenControl: true,
    //   panControl: false,
    //   clickableIcons: false,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    // };
    // //debugger;
    // this.map = new google.maps.Map(this.mapLoginElement.nativeElement, mapOptions);
    // var cityCircle = new google.maps.Circle({
    //   strokeColor: '#113bdd',
    //   strokeOpacity: 0.5,
    //   strokeWeight: 1,
    //   fillColor: '#113bdd',
    //   fillOpacity: 0.30,
    //   map: this.map,
    //   center: latLng,
    //   radius: 50
    // });
    // let marker = new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: this.map.getCenter()
    // });

    console.log("in loadMap");

    // let mapOptions: GoogleMapOptions = {
    //   camera: {
    //     target: {
    //       lat: this.latitudeIn,
    //       lng: this.longitudeIn
    //     },
    //     zoom: 17,
    //     //tilt: 30
    //   },
    //   controls: {
    //     compass: true,
    //     //myLocationButton: true,
    //     indoorPicker: true,
    //     zoom: true
    //   },
    //   gestures: {
    //     scroll: false,
    //     tilt: false,
    //     rotate: false,
    //     zoom: true
    //   }
    // };

    // this.mapIn = GoogleMaps.create('loginMap', mapOptions);
    // this.mapIn.one(GoogleMapsEvent.MAP_READY)
    //   .then(() => {
    //     //this.mapIn.setMyLocationEnabled(true);
    //     console.log('Map is ready!');
    //     this.mapIn.addMarker({
    //       //title: 'Ionic',
    //       icon: 'green',
    //       animation: 'DROP',
    //       position: {
    //         lat: this.latitudeIn,
    //         lng: this.longitudeIn,
    //       }
    //     })
    //       .then(marker => {
    //         marker.on(GoogleMapsEvent.MARKER_CLICK)
    //           .subscribe(() => {
    //             //alert('clicked');
    //           });
    //       });
    //   });
  }
  loadOutMap() {
    this.showLoginMap = false;
    console.log("out loadMap");
    this.logoutMapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      Constant.mapUrl + this.latitudeOut + "," + this.longitudeOut
    );

    // let latLng = new google.maps.LatLng(this.latitudeOut, this.longitudeOut);
    // let mapOptions= {
    //   zoom: 18,
    //   center: latLng,
    //   mapTypeControl: false,
    //   draggable: false,
    //   scaleControl: false,
    //   navigationControl: false,
    //   zoomControl : false,
    //   disableDefaultUI: true,
    //   streetViewControl: false,
    //   fullscreenControl: true,
    //   panControl: false,
    //   clickableIcons: false,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    // };
    // this.map = new google.maps.Map(this.mapLogoutElement.nativeElement, mapOptions);
    // var cityCircle = new google.maps.Circle({
    //   strokeColor: '#113bdd',
    //   strokeOpacity: 0.5,
    //   strokeWeight: 1,
    //   fillColor: '#113bdd',
    //   fillOpacity: 0.30,
    //   map: this.map,
    //   center: latLng,
    //   radius: 50
    // });
    // let marker = new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: this.map.getCenter()
    // });

    // let mapOptions: GoogleMapOptions = {
    //   camera: {
    //     target: {
    //       lat: this.latitudeOut,
    //       lng: this.longitudeOut
    //     },
    //     zoom: 18,
    //     //tilt: 30
    //   },
    //   controls: {
    //     compass: true,
    //     //myLocationButton: true,
    //     indoorPicker: true,
    //     zoom: true
    //   },
    //   gestures: {
    //     scroll: false,
    //     tilt: false,
    //     rotate: false,
    //     zoom: true
    //   }
    // };

    // this.mapOut = GoogleMaps.create('logoutMap', mapOptions);
    // this.mapOut.one(GoogleMapsEvent.MAP_READY)
    //   .then(() => {
    //     //this.mapOut.setMyLocationEnabled(true);
    //     console.log('Map is ready!');
    //     this.mapOut.addMarker({
    //       //title: 'Ionic',
    //       icon: 'green',
    //       animation: 'DROP',
    //       position: {
    //         lat: this.latitudeOut,
    //         lng: this.longitudeOut
    //       }
    //     })
    //       .then(marker => {
    //         marker.on(GoogleMapsEvent.MARKER_CLICK)
    //           .subscribe(() => {
    //             //alert('clicked');
    //           });
    //       });
    //   });
  }
  formatDate(date, format) {
    return moment(date).format(format);
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

  makeRegularization() {
    this.slides.slideNext(500);
    this.slides.lockSwipes(true);
    this.showRegularize = false;
  }
  regularizationAction(flag) {
    if (flag === "submit") {
      console.log("Flag");
    } else if (flag === "cancel") {
      console.log("ABC", flag);
      this.slides.lockSwipes(false);

      this.slides.slidePrev(500);
      this.showRegularize = true;
    }
  }
}
