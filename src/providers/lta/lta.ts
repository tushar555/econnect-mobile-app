import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

/*
  Generated class for the LtaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LtaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LtaProvider Provider');
  }

  getLtaDetails() : any{
     return this.http.get('assets/data/lta.json').map((res : Response) => res);
  }

  getHospitalList() : any{
    return this.http.get('assets/data/hospital.json').map((res : Response) => res);
 }


}
