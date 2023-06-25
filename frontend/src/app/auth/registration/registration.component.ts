import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Input } from 'src/app/shared/models/input.model';
import {
  FULLNAME,
  createEmailInput,
  createPasswordInput,
  redirect,
  showMessage,
} from '../common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignupModel } from 'src/app/shared/models/user.model';
import { Button } from 'src/app/shared/models/button.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../auth.component.scss', './registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  title = 'Регистрация';
  nameButton = 'Зарегистрироваться';
  subscriptionAuthed: Subscription | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscriptionAuthed?.unsubscribe();
  }
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    fullname: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  inputs: Input[] = [
    {
      field: FULLNAME,
      type: 'name',
      label: 'Фамилия и имя',
      icon: 'badge',
      messageError: () => {
        return 'Поле должно быть заполнено';
      },
      formControl: this.form.get(FULLNAME),
    },
    createEmailInput(this.form),
    createPasswordInput(this.form),
  ];

  button: Button = {
    url: '/auth/login',
    name: 'Войти в аккаунт',
    click: (url: string) => {
      redirect(url, this.router);
    },
  };

  signup() {
    const { email, password, fullname } = this.form.value;
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
    this.authService.Signup(new SignupModel(email, password, fullname));
  }
}
