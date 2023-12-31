import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { environment } from 'src/environments/environment';

/**
 * Serviço responsável por gerenciar as operações relacionadas ao usuário.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  signupUser(requestDatas: SignupUserRequest) : Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(`${this.API_URL}/user`, requestDatas);
  }

  authUser(requestDatas: AuthRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }

  isLoggedIn() {
    const token = this.cookie.get('token');
    return token ? true : false;
  }
}
