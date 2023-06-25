import { ProfileService } from './shared/services/profile.service';
import { Component, OnDestroy } from '@angular/core';
import { WebSocketService } from './shared/services/websocket.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) {
    if (this.authService.IsLoggedIn()) {

      this.profileService.GetProfile();
      this.webSocketService.Connect();
    }
  }
  ngOnDestroy(): void {
    this.webSocketService.Close();
  }
}
