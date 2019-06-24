import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        
        if (!items || !filter.search) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out

        if (filter.src === 'state') {
           return items.filter(item => item.indexOf(filter.search.toUpperCase()) !== -1);
        }

        if(filter.src === 'territoryState') {
            return items.filter(item => item.stateName.indexOf(filter.search.toUpperCase()) !== -1);
        }
        if(filter.src === 'territory') {
            return items.filter(item => item.territoryName.toUpperCase().indexOf(filter.search.toUpperCase())!== -1);
        }

        if (filter.src === 'district') {
            return items.filter(item => item.districtName.toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);
        }

        if (filter.src === 'territoryCity') {

            return items.filter(item => item.cityName.toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);
        }


        if (filter.src === 'territoryPincode') {

            return items.filter(item => ((item.pincode).toString()).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);
        }

        if (filter.src === 'territoryDistrict') {

            return items.filter(item => (item.districtName).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);
        }

        if(filter.src == 'selectedPincodes') {

            return items.filter(item => (item.stateName).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1 || (item.districtName).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1 || (item.cityName).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1 || ((item.pincode).toString()).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);

        }

        if(filter.src == 'userSearch') {

            return items.filter(item => (item.userName).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);

        }


        if(filter.src == 'networkSearch') {

            return items.filter(item => (item.establishment).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);

        }

        if(filter.src == 'junior') {

            return items.filter(item => (item.userName).toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);

        }

    }
}