import { Button } from 'src/app/shared/models/button.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';
import { redirect } from 'src/app/auth/common';
import { Router, Params } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Subscription } from 'rxjs';
const LIMIT = 20;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../system.component.scss', './users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  toNext: string | undefined;
  profile: User | null = null;
  title = 'Все пользователи';
  subscriptionProfileLoaded: Subscription | null = null;
  constructor(
    private userService: UserService,
    public imageService: ImageService,
    public profileService: ProfileService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.subscriptionProfileLoaded?.unsubscribe();
  }

  getUsers(to_next?: string) {
    this.userService.GetAllUsers(LIMIT, to_next).subscribe((users) => {
      users.items.forEach((user) => {
        this.users.push(user);
      });
      this.toNext = users.to_next;
    });
  }

  ngOnInit() {
    this.subscriptionProfileLoaded =
      this.profileService.ProfileLoaded.subscribe((profile: any) => {
        this.profile = profile;
      });
    this.profileService.GetProfile();
    this.getUsers();
  }

  buttonMore: Button = {
    name: 'Показать еще',
    click: () => {
      this.getUsers(this.toNext);
    },
    icon: 'expand_more',
  };

  showPage(key: any) {
    if (key == this.profile?.key) {
      redirect('/system/home', this.router);
    } else {
      redirect('/system/home', this.router, {
        queryParams: {
          key: key,
        },
      });
    }
  }
}
