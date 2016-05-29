import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ProductFactory} from "./product.factory";
import {ACCORDION_DIRECTIVES} from "ng2-bootstrap";
import {TagInputComponent} from "angular2-tag-input";
import {Path} from "path";
import {childProcess} from "child_process";

@Component({
    providers: [],
    templateUrl: "app/Product/product-facture.html",
    directives: [ ACCORDION_DIRECTIVES ]

})

export class ProductPaymentComponent {

    payments: Object ;
    isOpen = [];
    constructor(public service: ProductFactory){
        this.service.getPayments()
            .subscribe(
                res => {
                    if(res.success){
                        this.payments = res.data;
                        for(var i in this.payments){
                            this.isOpen.push(false);
                        }
                    }else{
                        console.log(res);
                    }
                },
                err =>  console.log(err),
                () => console.log('get payment list Complete')
            );
    }

    printPdf(i) {

        var payment = this.payments[i];

        if (payment.facture != "" && payment.facture) {
            var url = payment.facture;
            if (this.urlExists(url) == true) {
                window.open(url, "_blank");
            } else {
                this.generatePdf(payment, i);
            }
        } else {
            this.generatePdf(payment, i);
        }
    }

    generatePdf(payment, i) {
        payment = this.service.printFacture(payment).subscribe(
            res => {
                if(res.success){
                    payment = res.data;

                    this.payments[i] = payment;

                    window.open(payment.facture, "_blank");
                }else{
                    console.log(res);
                }
            },
            err =>  console.log(err),
            () => console.log('command updated')
        );
    }

    urlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }

    /*
    * 0 => unpaid
    * 1 => paid
    * */

    changeStatus(i) {
        var payment = this.payments[i];
        payment = this.service.changePaymentStatus(payment._id).subscribe(
            res => {
                if(res.success){
                    payment = res.data;

                    this.payments[i] = payment;


                }else{
                    console.log(res);
                }
            },
            err =>  console.log(err),
            () => console.log('payment updated')
        );
    }

}