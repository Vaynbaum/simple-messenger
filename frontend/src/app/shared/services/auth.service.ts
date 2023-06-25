import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { SigninModel, SignupModel } from '../models/user.model';
import { BACKEND_URL } from '../urls';
import { CookieService } from './cookie.service';
import { TokensModel } from '../models/tokens.model';
import { Router } from '@angular/router';

const KEY_ACCESS_TOKEN = 'access_token';
const KEY_REFRESH_TOKEN = 'refresh_token';
const EXPIRES_ACCESS_TOKEN = 1;
const EXPIRES_REFRESH_TOKEN = 7;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}
  @Output() Authed = new EventEmitter<any>();

  @Output() TokenRefreshed = new EventEmitter();

  Signin(signinModel: SigninModel) {
    this.httpClient.post(`${BACKEND_URL}/signin`, signinModel).subscribe(
      (res: any) => {
        this.SaveTokens(res as TokensModel);
        this.Authed.emit({ res: true });
      },
      (err: any) => {
        this.Authed.emit({ res: false, msg: err });
      }
    );
  }
  IsLoggedIn() {
    return this.cookieService.getCookie(KEY_REFRESH_TOKEN) != null;
  }

  RecoverPassword(email: any) {
    return this.httpClient.get(`${BACKEND_URL}/recover_password`, {
      params: {
        email: email,
      },
    });
  }

  ResetPassword(code: string, password: string) {
    return this.httpClient.get(`${BACKEND_URL}/reset`, {
      params: {
        code: code,
        new_password: password,
      },
    });
  }

  Signup(signupModel: SignupModel) {
    this.httpClient.post(`${BACKEND_URL}/signup/`, signupModel).subscribe(
      (res: any) => {
        this.SaveTokens(res as TokensModel);
        this.Authed.emit({ res: true });
      },
      (err: any) => {
        this.Authed.emit({ res: false, msg: err });
      }
    );
  }

  RefreshToken() {
    let token = this.cookieService.getCookie(KEY_REFRESH_TOKEN);
    if (token) {
      this.httpClient
        .get(`${BACKEND_URL}/refresh_token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe(
          (response) => {
            this.SaveTokens(response as TokensModel);
            this.TokenRefreshed.emit();
          },
          (err) => {
            this.DeleteTokens();
            this.router.navigate(['/auth/login'], {
              queryParams: {
                authAgain: true,
              },
            });
          }
        );
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          authAgain: true,
        },
      });
    }
  }

  DeleteTokens() {
    this.cookieService.deleteCookie(KEY_ACCESS_TOKEN);
    this.cookieService.deleteCookie(KEY_REFRESH_TOKEN);
  }

  SaveTokens(pair: TokensModel) {
    this.cookieService.setCookie({
      name: KEY_ACCESS_TOKEN,
      value: pair.access_token,
      expireDays: EXPIRES_ACCESS_TOKEN,
      secure: true,
    });
    this.cookieService.setCookie({
      name: KEY_REFRESH_TOKEN,
      value: pair.refresh_token,
      expireDays: EXPIRES_REFRESH_TOKEN,
      secure: true,
    });
  }

  GetAccessToken() {
    let token = this.cookieService.getCookie(KEY_ACCESS_TOKEN);
    return token != null ? token : '';
  }
}
