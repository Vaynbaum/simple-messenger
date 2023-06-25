import { MatSnackBar } from '@angular/material/snack-bar';
import { SigninModel } from './../../shared/models/user.model';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Input } from 'src/app/shared/models/input.model';
import {
  createEmailInput,
  createPasswordInput,
  redirect,
  showMessage,
} from '../common';
import { Button } from 'src/app/shared/models/button.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss', './login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  title = 'Авторизация';
  nameButton = 'Войти';
  subscriptionAuthed: Subscription | null = null;

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  inputs: Input[] = [
    createEmailInput(this.form),
    createPasswordInput(this.form),
  ];

  buttons: Button[] = [
    {
      url: '/auth/registration',
      name: 'Создать аккаунт',
      click: (url: string) => {
        redirect(url, this.router);
      },
    },
    {
      url: '/auth/recover_password',
      name: 'Восстановить пароль',
      click: (url: string) => {
        redirect(url, this.router);
      },
    },
  ];

  signin() {
    const { email, password } = this.form.value;
    this.subscriptionAuthed = this.authService.Authed.subscribe((res) => {
      if (res.res) {
        this.router.navigate(['/system/home'], {
          queryParams: {
            auth: true,
          },
        });
      } else {
        if (res.msg.error.detail) {
          showMessage(this._snackBar, res.msg.error.detail);
        }
      }
    });
    this.authService.Signin(new SigninModel(email, password));
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    this.subscriptionAuthed?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['authAgain']) {
        showMessage(this._snackBar, 'Необходимо заново авторизоваться');
      } else if (params['logoutSuccess']) {
        showMessage(this._snackBar, 'Вы вышли из аккаунта');
      } else if (params['message']) {
        showMessage(this._snackBar, params['message']);
      }
    });
  }
}
