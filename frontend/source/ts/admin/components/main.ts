import {Component} from 'angular2/core';
import {AdminMainService} from '../services/main';

@Component({
    selector: 'adminMain',
    templateUrl: 'pages/admin/main.tpl'
})

export class AdminMainComponent{
    constructor(admidMainService: AdminMainService){
    }
}