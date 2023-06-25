import { Message } from './../models/message.model';
import { Injectable } from '@angular/core';
import { BACKEND_URL_RESOURCE } from '../urls';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PaginatorData } from '../models/paginator.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
  currentInterlocutor: User | null = null;
  getDialogs(token: string) {
    return this.httpClient.get(`${BACKEND_URL_RESOURCE}/get_dialogs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getMessages(
    interlocutor_key: string,
    token: string,
    limit?: number,
    to_last?: string
  ) {
    let url = `${BACKEND_URL_RESOURCE}/my_messages?interlocutor_key=${interlocutor_key}`;
    if (limit) url += `&limit=${limit}`;
    if (to_last) url += `&to_last=${to_last}`;
    return this.httpClient.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  GetMessages(
    interlocutor_key: string,
    limit?: number,
    to_last?: string
  ): Observable<PaginatorData<Message>> {
    return new Observable((observer) => {
      this.getMessages(
        interlocutor_key,
        this.authService.GetAccessToken(),
        limit,
        to_last
      ).subscribe(
        (response) => {
          observer.next(response as PaginatorData<Message>);
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            this.authService.RefreshToken();
            let sub = this.authService.TokenRefreshed.subscribe(() => {
              sub.unsubscribe();
              this.getMessages(
                interlocutor_key,
                this.authService.GetAccessToken(),
                limit,
                to_last
              ).subscribe((response) => {
                observer.next(response as PaginatorData<Message>);
              });
            });
          }
        }
      );
    });
  }

  GetDialogs() {
    return new Observable((observer) => {
      this.getDialogs(this.authService.GetAccessToken()).subscribe(
        (response) => {
          observer.next(response);
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            this.authService.RefreshToken();
            let sub = this.authService.TokenRefreshed.subscribe(() => {
              sub.unsubscribe();
              this.getDialogs(this.authService.GetAccessToken()).subscribe(
                (response) => {
                  observer.next(response);
                },
                (err) => {
                  observer.next(null);
                }
              );
            });
          }
        }
      );
    });
  }
}
