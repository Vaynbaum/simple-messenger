import { FormControl, Validators } from '@angular/forms';
import { InputMessage, Message } from './../../shared/models/message.model';
import { ImageService } from './../../shared/services/image.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { MessageService } from 'src/app/shared/services/message.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WebSocketService } from 'src/app/shared/services/websocket.service';
import { redirect } from 'src/app/auth/common';
import { Input } from 'src/app/shared/models/input.model';
import { Button } from 'src/app/shared/models/button.model';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['../system.component.scss', './dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private userService: UserService,
    private messageService: MessageService,
    public imageService: ImageService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}
  subscriptionProfileLoaded: Subscription | null = null;
  subscriptionMessageGetted: Subscription | null = null;
  interlocutor: User | null = null;
  messages: Message[] = [];
  profile: User | null = null;
  matCard: any;
  last: any;
  msgCtrl = new FormControl(null, [Validators.required]);

  selectSide(msg: Message) {
    return { 'text-align': msg.sender == this.profile?.key ? 'right' : 'left' };
  }

  openProfile(key: any) {
    redirect('/system/home', this.router, {
      queryParams: {
        key: key,
      },
    });
  }

  textarea: Input = {
    type: 'text',
    formControl: this.msgCtrl,
    placeholder: 'Введите ваше сообщение',
    icon: 'send',
  };

  sendMsg() {
    let value = this.msgCtrl.value;
    //@ts-ignore
    let message = new InputMessage(value, this.interlocutor.key);
    this.websocketService.SendMessage(message);
    this.messages.push(
      new Message(
        //@ts-ignore
        [this.interlocutor.key, this.profile.key],
        message.text,
        true,
        new Date(),
        this.profile?.key
      )
    );
    this.msgCtrl.reset();
    this.croll();
  }

  ngOnInit() {
    this.subscriptionMessageGetted =
      this.websocketService.MessageGetted.subscribe((message: Message) => {
        this.messages.push(message);
      });

    document.getElementById('textarea')?.addEventListener('keydown', (e) => {
      const { code } = e;
      if ('Enter' === code || 'NumpadEnter' === code) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.subscriptionProfileLoaded =
      this.profileService.ProfileLoaded.subscribe((profile: any) => {
        this.profile = profile;
      });
    this.profileService.GetProfile();

    this.matCard = document.getElementById('mat-card');
    this.route.queryParams.subscribe((params: Params) => {
      if (params['key']) {
        this.userService.GetProfileByKey(params['key']).subscribe((user) => {
          this.interlocutor = user;
          this.getMessages(params['key'], true);
        });
      } else if (params['save']) {
        this.interlocutor = this.messageService.currentInterlocutor;
        this.getMessages(this.interlocutor?.key, true);
      }
    });
  }

  croll() {
    const TIMEOUT = 3;
    setTimeout(() => {
      this.matCard.scrollTo(0, this.matCard.scrollHeight);
    }, TIMEOUT);
  }

  getMessages(key: any, isScroll: boolean, last?: any) {
    const LIMIT = 20;
    this.messageService.GetMessages(key, LIMIT, last).subscribe((messages) => {
      this.last = messages.to_next;
      messages.items.forEach((item) => {
        this.messages.unshift(item);
      });
      if (isScroll) this.croll();
    });
  }

  onScroll(event: any) {
    const MIN_HEIGHT = 10;
    if (this.matCard.scrollTop < MIN_HEIGHT && this.last) {
      this.getMessages(this.interlocutor?.key, false, this.last);
    }
  }

  ngOnDestroy(): void {
    this.subscriptionProfileLoaded?.unsubscribe();
  }
}
