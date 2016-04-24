import {Component} from 'angular2/core';
import {AdminLoginService} from '../services/login';
import {Router,ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'adminLogin',
    templateUrl: 'pages/admin/login.tpl',
    directives:[AdminLoginComponent,ROUTER_DIRECTIVES]
})


export class AdminLoginComponent{
    constructor(private admidLoginService: AdminLoginService, private router: Router){
    }
    Login(){
        this.router.navigate(['Main']);
        return false;
    }
}