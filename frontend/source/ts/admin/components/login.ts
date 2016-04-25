import {Component } from 'angular2/core';
import {AdminLoginService} from '../services/login';
import {Router,ROUTER_DIRECTIVES} from "angular2/router";
import {URLSearchParams} from 'angular2/http';
import 'rxjs/Rx';
@Component({
    selector: 'adminLogin',
    templateUrl: 'pages/admin/login.tpl',
    directives:[AdminLoginComponent,ROUTER_DIRECTIVES]
})



export class AdminLoginComponent{
    username:string;
    password:string;
    constructor(public admidLoginService: AdminLoginService, private router: Router){
    }
    Login(){
        let Form = new URLSearchParams();
        Form.set("username", this.username);
        Form.set("password", this.password);
        
        this.admidLoginService.SignIn(Form).subscribe((response:ApiKey) => {
            this.admidLoginService.SetSessionKey(response.apiKey);
            this.router.navigate(["Main"]);
            return false;
        });
    }
}