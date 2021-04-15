import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], searchText: string) {
    /*if (searchTerm) {
      searchTerm = searchTerm.toUpperCase();
      return list.filter(item => {
        return item.site.toUpperCase().indexOf(searchTerm) !== -1
      });
    } else {
      return list;
    }*/

    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    console.log("search: " + searchText);
    return items.filter(it => {
      return (it.HospitalName + it.HospitalAddress).toLowerCase().includes(searchText);
    });
    //return value.toLowerCase();
  }
}
