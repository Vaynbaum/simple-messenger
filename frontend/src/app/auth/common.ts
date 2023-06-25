import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Input } from 'src/app/shared/models/input.model';

export const PASSWORD = 'password';
export const EMAIL = 'email';
export const FULLNAME = 'fullname';

const OK = 'ОК';
const DURATION_MESSAGE = 5000;

export function createEmailInput(form: FormGroup) {
  return {
    field: EMAIL,
    type: EMAIL,
    icon: 'email',
    label: 'Email',
    placeholder: 'pat@example.com',
    messageError: () => {
      if (form.get?.(EMAIL)?.['errors']?.['required']) {
        return 'Email не может быть пустым';
      }
      if (form.get?.(EMAIL)?.['errors']?.[EMAIL]) {
        return 'Введите корректный email';
      }
      return '';
    },
    formControl: form.get?.(EMAIL),
  } as Input;
}

export function createPasswordInput(form: FormGroup, label = 'Введите пароль') {
  return {
    field: PASSWORD,
    type: PASSWORD,
    label: label,
    hide: true,
    messageError: () => {
      if (form.get?.(PASSWORD)?.['errors']?.['required']) {
        return 'Пароль не может быть пустым';
      }
      if (
        form.get?.(PASSWORD)?.['errors']?.['minlength'] &&
        form.get?.(PASSWORD)?.['errors']?.['minlength']['requiredLength']
      )
        return `Пароль должен быть больше ${
          form.get(PASSWORD)?.['errors']?.['minlength']?.['requiredLength']
        } символов`;
      return '';
    },
    formControl: form.get?.(PASSWORD),
  } as Input;
}

export function showMessage(snackBar: MatSnackBar, text: string) {
  snackBar.open(text, OK, {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    duration: DURATION_MESSAGE,
  });
}

export function redirect(link: string, router: Router, obj?: any) {
  router.navigate([link], obj);
}
