import {Component} from 'angular2/core';
import {AdminLoginComponent} from './components/login'
import {RouteConfig,RouterLink,ROUTER_DIRECTIVES} from "angular2/router";
import {AdminMainComponent} from "./components/main";
import {ROUTER_PROVIDERS} from "angular2/router";
import {AdminLoginService} from "./services/login";
import {AdminMainService} from "./services/main";


@Component({
    selector: 'app',
    template: ('<router-outlet></router-outlet>'),
    directives:[AdminLoginComponent,AdminMainComponent,ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,AdminLoginService,AdminMainService]
})

@RouteConfig([
    {path:'/admin', name: 'Login', component: AdminLoginComponent, useAsDefault: true},
    {path:'/admin/Main/', name: 'Main', component: AdminMainComponent}
])
export class AppComponent {

}
