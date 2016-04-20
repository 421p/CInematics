import {Component} from 'angular2/core';
import {AdminLoginService} from '../services/login';

@Component({
    selector: 'adminLogin',
    templateUrl: 'pages/admin/login.tpl'
})

export class AdminLoginComponent{
    BodyID = "login";
    constructor(){
        $("body").attr("id", this.BodyID);
    }
}