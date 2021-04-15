import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constant } from "../constant";
import * as CryptoJS from "crypto-js";

@Injectable()
export class AuthProvider {
  state: any;

  constructor(private _http: HttpClient) {}
  checkLogin(usercredentials, overwriteSession?) {
    const promise = new Promise((resolve, reject) => {
      this.encrypt(usercredentials.username).then(username => {
        this.encrypt(usercredentials.password).then(password => {
          let newpassword = usercredentials.password === null ? null : password;
          let data = JSON.stringify({
            tokenid: username,
            password: newpassword,
            overwriteSession: overwriteSession || false,
            PIN: usercredentials.pin
          });
          this._http
            .post(Constant.userAuthentication, data, {
              headers: { "Content-Type": "application/json" },
              observe: "response"
            })
            .timeout(30000)
            .subscribe(
              data => {
                resolve(data.body);
              },
              error => {
                reject(error);
              }
            );
        });
      });
    });
    return promise;
  }

  checkPinStatus(data) {
    const promise = new Promise((resolve, reject) => {
      const URL = Constant.CheckPinLogin;
      this._http
        .post(URL, data, {
          headers: { "Content-Type": "application/json" },
          observe: "response"
        })
        .subscribe(resp => {
          resolve(resp.body);
        });
    });

    return promise;
  }

  encrypt(plain_text) {
    let promise = new Promise(resolve => {
      let key = CryptoJS.enc.Utf8.parse("S@LT&P@@sW0rDkEY");
      let iv = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");
      let encrypted = {};
      encrypted = CryptoJS.AES.encrypt(plain_text, key, {
        iv: iv
      });
      if (encrypted != null) {
        let encrypted_text = encrypted["ciphertext"].toString(
          CryptoJS.enc.Base64
        );
        resolve(encrypted_text);
      } else {
        resolve("");
      }
    });
    return promise;
  }

  decrypt(plain_text) {
    let promise = new Promise(resolve => {
      let key = CryptoJS.enc.Utf8.parse("S@LT&P@@sW0rDkEY");
      let iv = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");
      let decrypted: any;
      decrypted = CryptoJS.AES.decrypt(plain_text, key, {
        iv: iv
      });
      let decrypted_text = decrypted.toString(CryptoJS.enc.Utf8);
      resolve(decrypted_text);
    });
    return promise;
  }
}
