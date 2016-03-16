import {Component} from 'angular2/core';
import {FormBuilder, Validators} from "angular2/common";
import {RegEx} from "../lib/regex";
import {AdminFactory} from "./admin.factory";
import {Admin} from "./admin";
import {ControlGroup} from "angular2/common";
import {tokenNotExpired} from 'angular2-jwt';
import {CanActivate} from "angular2/router";
@CanActivate(() => tokenNotExpired('token'))
@Component({
    templateUrl: "app/Admin/admin-subscribe.html",
})

export class AdminSubscribeComponent {
    service: AdminFactory ;
    admin: Admin;
    subscribeForm: ControlGroup;

    model = {
        lastName: 'Boulkaddid',
        firstName: 'Younes',
        phone: '06.59.90.12.05',
        mail: 'younes.boulkaddid@supinternet.fr',
        password: '12345678',
        passwordCheck: '12345678',
    };

    constructor(fb: FormBuilder, regEx: RegEx, adminFactory: AdminFactory){
        this.service = adminFactory;

        this.subscribeForm = fb.group({
            'name': ['', Validators.compose([
               /* Validators.required,
                Validators.maxLength(30)*/
            ])],
            'firstName': ['', Validators.compose([
               /* Validators.required,
                Validators.maxLength(30)*/
            ])],
            'mail': ['', Validators.compose([
               /*
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(100)*/
            ])],
            'phone': ['', Validators.compose([
            ])],
            'mobile': ['', Validators.compose([
            ])],
            'password': ['', Validators.compose([
            ])],
            'passwordCheck': ['', Validators.compose([
            ])]
        });
    }


    subscribe(){
        if(this.subscribeForm.valid){
            this.service.save(this.model);
        }
    }
}
