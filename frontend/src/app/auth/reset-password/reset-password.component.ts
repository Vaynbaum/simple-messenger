import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Input } from 'src/app/shared/models/input.model';
import { createPasswordInput, redirect, showMessage } from '../common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_CODE } from 'src/app/shared/consts';
import { Button } from 'src/app/shared/models/button.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss', './reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  title = 'Изменение пароля';
  nameButton = 'Изменить пароль';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}
  form: FormGroup = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  isReset = false;
  code = null;
  inputs: Input[] = [createPasswordInput(this.form, 'Введите новый пароль')];
  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.code = params['code'];
    });
  }
  button: Button = {
    url: '/auth/login',
    name: 'Войти в аккаунт',
    click: (url: string) => {
      redirect(url, this.router);
    },
  };

  resetPassword() {
    const { password } = this.form.value;
    if (this.code) {
      this.authService.ResetPassword(this.code, password).subscribe(
        (result: any) => {
          showMessage(this._snackBar, result.message);
          this.isReset = true;
        },
        (err) => {
          showMessage(this._snackBar, err.error.detail);
        }
      );
    } else {
      showMessage(this._snackBar, NO_CODE);
    }
  }
}
