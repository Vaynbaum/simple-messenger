import { ProfileService } from 'src/app/shared/services/profile.service';
import { AuthService } from './auth.service';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BACKEND_URL_RESOURCE_WEBSOCKET } from '../urls';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { InputMessage } from '../models/message.model';
const TIMEOUT = 3;
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  @Output() MessageGetted = new EventEmitter<any>();

  ws: WebSocketSubject<unknown> | undefined;
  SendMessage(message: InputMessage) {
    this.ws?.next(message);
  }

  Close() {
    this.ws?.complete();
  }

  Connect() {
    let sub = this.profileService.ProfileLoaded.subscribe((profile: any) => {
      sub.unsubscribe();
      if (profile) {
        this.ws = webSocket(
          `${BACKEND_URL_RESOURCE_WEBSOCKET}/ws?token=${this.authService.GetAccessToken()}`
        );
        this.ws?.asObservable().subscribe(
          (dataFromServer) => {
            this.MessageGetted.emit(dataFromServer);
          },
          (err) => {
            setTimeout(() => {
              this.Connect();
            }, TIMEOUT);
          },
          () => {}
        );
      }
    });
    this.profileService.GetProfile();
  }

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}
}
