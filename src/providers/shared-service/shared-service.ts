import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Constant } from '../constant'
import { monthYearDetails } from '../interface';

/*
  Generated class for the SharedServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedServiceProvider {
  navTitle = "Mahindra Finance";
  details = {} as monthYearDetails;

  constructor(private _http: HttpClient) {
    console.log('Hello SharedServiceProvider Provider');

  }

  getHoldayList(): any {
    return this._http.get('assets/data/holiday.json').map((res: Response) => res);
  }



  getpolicies() {
    const promise = new Promise((resolve, reject) => {
      let link = 'assets/data/hrpolicies.json';
      this._http.get(link).timeout(30000).subscribe((data: any) => {
        resolve(data);
      }, (error) => {
        reject(reject);
      });
    });
    return promise;
  }

  getIncometaxData(link, data) {
    const promise = new Promise((resolve, reject) => {
      this._http.get(link).timeout(30000).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      })
    });

    return promise;
  }

}
