import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
import {Router} from "angular2/router";
import {SearchComponent} from "../Tools/search.component";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";



@Component({
    selector: "nav-user",
    templateUrl: "app/Layouts/nav-user.html",
    directives: [ROUTER_DIRECTIVES, SearchComponent, DROPDOWN_DIRECTIVES]
})

export class NavUserComponent  {
    public title = "X-vision";

    constructor(public router: Router){
    }

}

