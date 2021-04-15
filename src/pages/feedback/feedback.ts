import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams } from 'ionic-angular';
import { PostService } from "../../providers/api/PostService";
// import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
   companyName: any;
  rating: any;
  questionList: any;
  inputArea = [];
  radioGroup = [];
  starRateArray = [];
  @ViewChild(Navbar) navBar: Navbar;
  // private secureStorage: SecureStorage, 
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public _service: PostService, public storage: Storage,
    public zone: NgZone) {
    this.getQuestionList();
    this.initializeStarArray();
    this._service.getUserDetails().then((userToken) => {
      this.companyName = userToken['companyName'];
      // alert("compan:"+this.companyName);
  });
  }


  getQuestionList(): any {
    this._service.presentLoadingDefault();
    this._service.getUserDetails().then((dt: any) => {
      this._service.getData('/FeedbackQuestions/GetFeedbackQuestions', { tokenid: dt.tokenid }).then((data: any) => {
        console.log('Data', data);
        this.questionList = data.FeedbackQuestions;
        this._service.loading.dismiss();
      }).catch((error) => {
        this._service.loading.dismiss();
        this._service.presentToast(error);
      })
    })

  }

  initializeStarArray() {
    this.starRateArray = [
      {
        value: false
      },
      {
        value: false
      },
      {
        value: false
      },
      {
        value: false
      },
      {
        value: false
      }
    ]
  }

  starRating(rating) {
    this.zone.run(() => {
      this.rating = rating;
      console.log('Rating', this.rating);

      this.initializeStarArray();

      for (let i = this.rating; i >= 0; i--) {
        this.starRateArray[i].value = true;
      }
    })

  }
  onSubmit() {

    if (this.inputArea.length === 9 && this.radioGroup.length === 5) {

      this._service.presentLoadingDefault();

      let FeedbackAnswers = [];

      this.inputArea.forEach((item, i) => {
        FeedbackAnswers.push({
          "QuestionID": i,
          "Answer": item
        })
      })
      this.radioGroup.forEach((item, i) => {
        FeedbackAnswers.push({
          "QuestionID": i,
          "Answer": item
        })
      })
      FeedbackAnswers.push({
        "QuestionID": 7,
        "Answer": this.rating + 1
      })

      this._service.getUserDetails().then((user: any) => {

        let data = {
          "TokenID": user.tokenid,
          "FeedbackAnswers": FeedbackAnswers
        }
        console.log('DATA', data);


        this._service.getData('/Feedback/SubmitFeedback', data).then((data) => {
          this._service.loading.dismiss();
          if (data === 'Success') {
            this._service.presentToast('We have received your feedback!');
            this.navCtrl.pop({ animate: true, animation: 'ios-transition', duration: 1000, direction: 'back' });
          } else {
            this._service.presentToast('Error in submitting feedback! Please try after sometime.');
            this.navCtrl.pop({ animate: true, animation: 'ios-transition', duration: 1000, direction: 'back' });
          }

        }).catch((error) => {
          this._service.loading.dismiss();
          console.log('ERROR', error);

        })
      })


    } else {
      this._service.presentToast('All fields are mandatory');
    }



    //console.log('ITEm', data);
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.pop({ animate: true, animation: 'ios-transition', duration: 1000, direction: 'back' });
    }
  }

}
