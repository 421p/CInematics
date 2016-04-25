import {Injectable} from 'angular2/core';
import {Http} from "angular2/http";
import {Request} from "angular2/http";
import {RequestOptionsArgs} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Response} from "angular2/http";
import 'rxjs/Rx';

@Injectable()
export class AjaxEvents extends Http {

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, options);
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        //onAjaxStart
        $( "#loader" ).show();
        return super.post(url, body, options).finally(() => {
            //onAjaxStop
            $( "#loader" ).hide();
        });
    }
}