import {Component} from 'angular2/core';
import {AdminLoginComponent} from './components/login'

@Component({
    selector: 'app',
    template: '<adminLogin></adminLogin>',
    directives:[AdminLoginComponent]
})
export class AppComponent { }
