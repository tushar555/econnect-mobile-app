import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
/**
 * Generated class for the DateTimeFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "dateTimeFormatPipe"
})
export class DateTimeFormatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(date: any, format: string): any {
    if (date) {
      return moment(date).format(format);
    }
  }
}
