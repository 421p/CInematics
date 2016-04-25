/// <reference path="../../../typings/index.d.ts" />
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from "angular2/http";
import {Http} from "angular2/http";
import {XHRBackend} from "angular2/http";
import {AjaxEvents} from "./services/global";
import {RequestOptions} from "angular2/http";
import {Provider} from "angular2/core";

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    new Provider(Http, {
        useFactory: (backend: XHRBackend, defaultOptions: RequestOptions) => new AjaxEvents(backend, defaultOptions),
        deps: [XHRBackend, RequestOptions]
    })
]);
