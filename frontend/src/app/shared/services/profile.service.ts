import { EventEmitter, Injectable, Output } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  profile: User | null = null;
  isLoading: boolean = false;
  @Output() ProfileLoaded = new EventEmitter<any>();
  GetProfile(hardLoad: boolean = false) {
    if (this.authService.IsLoggedIn()) {
      if (hardLoad) {
        this.profile = null;
        this.load();
      } else if (this.profile) {
        this.ProfileLoaded.emit(this.profile);
      } else if (!this.isLoading) {
        this.load();
      }
    }
  }

  load() {
    this.isLoading = true;
    this.userService.GetProfile().subscribe((profile) => {
      this.isLoading = false;
      this.profile = profile ? (profile as User) : null;
      this.ProfileLoaded.emit(this.profile);
    });
  }

  Logout() {
    this.profile = null;
    this.userService.Logout();
  }
}
