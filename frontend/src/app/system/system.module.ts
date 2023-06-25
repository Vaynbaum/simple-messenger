import { DialogComponent } from './dialog/dialog.component';
import { MessagesComponent } from './messages/messages.component';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    SystemComponent,
    HeaderComponent,
    HomeComponent,
    UsersComponent,
    MessagesComponent,
    DialogComponent,
  ],
  imports: [CommonModule, SystemRoutingModule, SharedModule],
})
export class SystemModule {}
