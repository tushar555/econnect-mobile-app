import { CallNumber } from "@ionic-native/call-number";
import { LtaProvider } from "./../providers/lta/lta";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpClientModule } from "@angular/common/http";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
//import { SplashPage } from '../pages/splash/splash';
import { SharedServiceProvider } from "../providers/shared-service/shared-service";
import { PostService } from "../providers/api/PostService";
import { FileOpener } from "@ionic-native/file-opener";
import { File } from "@ionic-native/file";
import { AuthProvider } from "../providers/auth/auth";
import { IonicStorageModule } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
//import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { FileTransfer } from "@ionic-native/file-transfer";
import { Camera } from "@ionic-native/camera";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ComponentsModule } from "../components/components.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage //SplashPage
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      backButtonIcon: "ios-arrow-back",
      iconMode: "md"
    }),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
    //SplashPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    CallNumber,
    FileOpener,
    File,
    Network,
    FileTransfer,
    InAppBrowser,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SharedServiceProvider,
    LtaProvider,
    PostService,
    AuthProvider,
    LocationAccuracy
  ]
})
export class AppModule {}
