import { AuthGuard } from './shared/guard/auth.guard';
import { WebSocketService } from './shared/services/websocket.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './shared/services/auth.service';
import { CookieService } from './shared/services/cookie.service';
import { UserService } from './shared/services/user.service';
import { ProfileService } from './shared/services/profile.service';
import { ImageService } from './shared/services/image.service';
import { MessageService } from './shared/services/message.service';

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    NgxPhotoEditorModule,
    SharedModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    CookieService,
    UserService,
    ProfileService,
    ImageService,
    MessageService,
    WebSocketService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
