import { Dialog } from './../../shared/models/dialog.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { redirect } from 'src/app/auth/common';
import { Message } from 'src/app/shared/models/message.model';
import { ImageService } from 'src/app/shared/services/image.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { WebSocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['../system.component.scss', './messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  constructor(
    public imageService: ImageService,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}
  dialogs: Dialog[] = [];
  subscriptionMessageGetted: Subscription | null = null;
  title = 'Сообщения';
  ngOnDestroy(): void {
    this.subscriptionMessageGetted?.unsubscribe();
  }

  openDialog(i: number) {
    redirect('/system/message', this.router, {
      queryParams: {
        save: true,
        key: this.dialogs[i].interlocutor.key,
      },
    });
    this.messageService.currentInterlocutor = this.dialogs[i].interlocutor;
  }

  getDialogs() {
    this.messageService.GetDialogs().subscribe((dialogs: any) => {
      this.dialogs = dialogs;
    });
  }

  ngOnInit() {
    this.getDialogs();
    this.subscriptionMessageGetted =
      this.websocketService.MessageGetted.subscribe((message: Message) => {
        this.getDialogs();
      });
  }
}
