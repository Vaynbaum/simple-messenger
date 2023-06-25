import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { redirect } from 'src/app/auth/common';
import { Button } from 'src/app/shared/models/button.model';
import { User } from 'src/app/shared/models/user.model';
import { ImageService } from 'src/app/shared/services/image.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { WebSocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  profile: User | null = null;
  showIcon = false;
  subscriptionProfileLoaded: Subscription | null = null;
  constructor(
    private profileService: ProfileService,
    public imageService: ImageService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.checkWidthWindow();
    window.addEventListener('resize', () => {
      this.checkWidthWindow();
    });
    this.subscriptionProfileLoaded =
      this.profileService.ProfileLoaded.subscribe((profile: any) => {
        this.profile = profile;
      });
    this.profileService.GetProfile();
  }
  ngOnDestroy(): void {
    this.subscriptionProfileLoaded?.unsubscribe();
  }
  checkWidthWindow() {
    if (window.innerWidth < 768) this.showIcon = true;
    else this.showIcon = false;
  }

  title = 'Сайт-чат';
  links: Button[] = [
    {
      name: 'Пользователи',
      icon: 'group',
      click: () => {
        redirect('/system/users', this.router);
      },
    },
    {
      name: 'Сообщения',
      icon: 'mail',
      click: () => {
        redirect('/system/messages', this.router);
      },
    },
  ];

  rightButtons: Button[] = [
    {
      name: 'Профиль',
      icon: 'person',
      click: () => {
        redirect('/system/home', this.router);
      },
    },
    {
      name: 'Выход',
      icon: 'logout',
      click: () => {
        this.profileService.Logout();
        this.webSocketService.Close();
        redirect('/auth/login', this.router, {
          queryParams: {
            logoutSuccess: true,
          },
        });
      },
    },
  ];
}
