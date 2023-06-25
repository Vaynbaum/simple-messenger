import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { redirect } from 'src/app/auth/common';
import { User } from 'src/app/shared/models/user.model';
import { ImageService } from 'src/app/shared/services/image.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WebSocketService } from 'src/app/shared/services/websocket.service';
import { NgxCroppedEvent, NgxPhotoEditorService } from 'ngx-photo-editor';
const APPLY_BTN_TEXT = 'Сохранить и продолжить';
const CLOSEB_BTN_TEXT = 'Вернуться назад';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../system.component.scss', './home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private messageService: MessageService,
    public imageService: ImageService,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private router: Router,
    private photoEditorService: NgxPhotoEditorService
  ) {}
  ngOnDestroy(): void {
    this.subscriptionProfileLoaded?.unsubscribe();
    this.subscriptionPictureUnloaded?.unsubscribe();
  }
  output?: NgxCroppedEvent;

  profile: User | null = null;
  subscriptionProfileLoaded: Subscription | null = null;
  subscriptionPictureUnloaded: Subscription | null = null;
  isMyAccount: boolean = false;

  deleteProfile() {
    if (this.profile?.img)
      this.imageService.DeleteOldImage().subscribe((res) => {});
    this.userService.DeleteProfile().subscribe(() => {
      this.webSocketService.Close();
      this.profileService.Logout();
      redirect('/auth/login', this.router, {
        queryParams: {
          message: 'Вы успешно удалили аккаунт!',
        },
      });
    });
  }

  onOpenFileDialog() {
    if (this.isMyAccount) document.getElementById('file-input')?.click();
  }

  displayImg() {
    if (this.output) return this.output.base64;
    else return this.imageService.GetFullURL(this.profile?.img);
  }

  async fileChange(event: any) {
    this.output = undefined;
    this.photoEditorService
      .open(event, {
        modalMaxWidth: 'min(95%, 400px)',
        modalTitle: 'Фотография на вашей странице',
        applyBtnText: APPLY_BTN_TEXT,
        closeBtnText: CLOSEB_BTN_TEXT,
        aspectRatio: 1 / 1,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        this.output = data;
        if (this.output) {
          this.subscriptionPictureUnloaded =
            this.imageService.PictureUnloaded.subscribe((data) => {
              if (data) {
                this.userService.ChangeImg(data).subscribe(() => {
                  this.profileService.GetProfile(true);
                });
              }
            });
          this.imageService.UnloadPicture(this.output.file);
        }
      });
  }

  openDialog() {
    this.messageService.currentInterlocutor = this.profile;
    redirect('/system/message', this.router, {
      queryParams: {
        save: true,
        key: this.profile?.key,
      },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['auth']) {
        this.webSocketService.Connect();
      }
      if (params['key']) {
        this.userService.GetProfileByKey(params['key']).subscribe((user) => {
          this.profile = user;
          this.isMyAccount = false;
        });
      } else {
        this.isMyAccount = true;
        this.subscriptionProfileLoaded =
          this.profileService.ProfileLoaded.subscribe((profile: any) => {
            this.profile = profile;
          });
        this.profileService.GetProfile(true);
      }
    });
  }
}
