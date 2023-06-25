import { Input } from '../../shared/models/input.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createEmailInput, redirect, showMessage } from '../common';
import { Button } from 'src/app/shared/models/button.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recover_password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['../auth.component.scss', './recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  title = 'Восстановление пароля';
  nameButton = 'Отправить сообщение на почту';
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}
  inputs: Input[] = [createEmailInput(this.form)];
  button: Button={
    url: '/auth/login',
    name: 'Войти в аккаунт',
    click: (url: string) => {
      redirect(url, this.router);
    },
  }
  ngOnInit() {}
  recover() {
    const { email } = this.form.value;
    this.authService.RecoverPassword(email).subscribe(
      (result: any) => {
        showMessage(this._snackBar, result.message);
      },
      (err) => {
        showMessage(this._snackBar, err.error.detail);
      }
    );
  }
}
