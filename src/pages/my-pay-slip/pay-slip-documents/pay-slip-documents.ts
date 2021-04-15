import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { PostService } from "../../../providers/api/PostService";
import { File } from "@ionic-native/file";
import { FileOpener } from '@ionic-native/file-opener';
import { Platform } from "ionic-angular";
/**
 * Generated class for the PaySlipDocumentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pay-slip-documents",
  templateUrl: "pay-slip-documents.html"
})
export class PaySlipDocumentsPage {
  companyName: string;
  documents: {}[] = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public postService: PostService,
    public file: File,
    public fileOpener: FileOpener
  ) {
    this.postService.getUserDetails().then(userToken => {
      this.companyName = userToken["companyName"];
      this.documents = this.navParams.get("data");
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PaySlipDocumentsPage");
  }

  showFile(filedata) {
    let fileName = filedata.FileName === undefined ? "Mypayslip.pdf" : filedata.FileName;
    const writeDirectory = this.platform.is("ios")? this.file.dataDirectory: this.file.externalDataDirectory;
    this.postService.presentLoadingDefault();
    this.file.writeFile( writeDirectory, fileName, this.convertBase64ToBlob( filedata.Base64File, "data:application/pdf;base64" ),
        { replace: true })
      .then(data => {
        this.postService.loading.dismiss();
        alert(writeDirectory)
        alert(fileName);
        this.fileOpener.open(writeDirectory + fileName, "application/pdf").then(()=> alert('open')).catch((error)=> alert('error'+ error))
      })
      .catch(error => {
        this.postService.loading.dismiss();
        console.log("Error opening pdf file123", error);
      });
  }

  saveAndOpenPdf(pdf: string, filename: string) {}

  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || "";
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, "");
    b64Data = b64Data.replace(/\s/g, "");
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}
