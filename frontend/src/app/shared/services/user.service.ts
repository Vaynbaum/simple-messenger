import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { BACKEND_URL_RESOURCE } from '../urls';
import { User } from '../models/user.model';
import { PaginatorData } from '../models/paginator.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private getProfile(token: string) {
    return this.httpClient.get(`${BACKEND_URL_RESOURCE}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  private deleteProfile(token: string) {
    return this.httpClient.delete(`${BACKEND_URL_RESOURCE}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  Logout() {
    this.authService.DeleteTokens();
  }

  private changeImg(img: string, token: string) {
    return this.httpClient.get(`${BACKEND_URL_RESOURCE}/change_img`, {
      params: { img: img },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  ChangeImg(img: string) {
    return new Observable((observer) => {
      this.changeImg(img, this.authService.GetAccessToken()).subscribe(
        (response) => {
          observer.next(response);
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            let sub = this.authService.TokenRefreshed.subscribe(() => {
              sub.unsubscribe();
              this.changeImg(img, this.authService.GetAccessToken()).subscribe(
                (response) => observer.next(response),
                (err) => observer.next(err)
              );
            });
            this.authService.RefreshToken();
          }
        }
      );
    });
  }

  DeleteProfile() {
    return new Observable((observer) => {
      this.deleteProfile(this.authService.GetAccessToken()).subscribe(
        (response) => {
          observer.next(null);
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            let sub = this.authService.TokenRefreshed.subscribe(() => {
              sub.unsubscribe();
              this.deleteProfile(this.authService.GetAccessToken()).subscribe(
                (response) => observer.next(null),
                (err) => observer.next(null)
              );
            });
            this.authService.RefreshToken();
          }
        }
      );
    });
  }

  GetAllUsers(limit?: any, last?: any): Observable<PaginatorData<User>> {
    let url = `${BACKEND_URL_RESOURCE}/all_users`;
    if (limit) url += `?limit=${limit}`;
    if (last) url += `${limit ? '&' : '?'}to_next=${last}`;
    return this.httpClient.get<PaginatorData<User>>(url);
  }

  GetProfileByKey(key: string): Observable<User> {
    return this.httpClient.get<User>(`${BACKEND_URL_RESOURCE}/user`, {
      params: {
        key: key,
      },
    });
  }

  GetProfile() {
    return new Observable((observer) => {
      this.getProfile(this.authService.GetAccessToken()).subscribe(
        (response) => {
          observer.next(response as User);
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            let sub = this.authService.TokenRefreshed.subscribe(() => {
              sub.unsubscribe();
              this.getProfile(this.authService.GetAccessToken()).subscribe(
                (response) => {
                  observer.next(response as User);
                },
                (err) => {
                  observer.next(null);
                }
              );
            });
            this.authService.RefreshToken();
          }
        }
      );
    });
  }
}
