import {Injectable}     from 'angular2/core';
import {Http, Response, URLSearchParams, Headers} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class AdminLoginService{
    constructor(private http: Http){
        $("body").attr("id", "login");
    }
    public SignIn(Form:URLSearchParams):Observable<Response>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post("/ajax/rest_login", Form.toString(), {headers: headers})
            .map((res: Response) => res.json());
            
    }
    
    public SetSessionKey(key:string):void{
        sessionStorage.setItem("api_key", key);
    }
}