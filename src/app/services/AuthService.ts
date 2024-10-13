import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UserLoginRequest} from "../dtos/request/UserLoginRequest";
import {TokenResponse} from "../login/login.component";

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  login(userDetails: UserLoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('http://localhost:8080/auth/login', {email:userDetails.email, password:userDetails.password})
  }
}
