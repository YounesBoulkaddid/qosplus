
import {Injectable} from 'angular2/core';
import 'rxjs/Rx';
import {Headers} from "angular2/http";
import {AuthHttp} from 'angular2-jwt';
import {Router} from "angular2/router";
import {API} from "../Config/api";

@Injectable()

export class ProductFactory {
    http = null;
    apiUrl = "http://192.168.33.10:8080/api/v1/product/";
    constructor(public authHttp: AuthHttp, public router : Router, api : API) {
        this.apiUrl = api.url+api.product;

    }

    save(products){
        var data =  JSON.stringify({products});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

      return  this.authHttp
            .post(this.apiUrl + 'add',
                data, {
                    headers: headers
                })
            .map(response => response.json())

    }

    getProduct(){
        return  this.authHttp
            .get(this.apiUrl+'list')
            .map(response => response.json())
    }

    deleteProduct(product){
        var data = JSON.stringify({product});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.authHttp
            .post(this.apiUrl + 'delete',
            data, {
                    headers: headers
                })
            .map(response => response.json())
    }
}