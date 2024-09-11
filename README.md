# Simple messenger
Pet-проект - это простой мессенджер на websockets

<h3><a href="https://private-chat-sigma.vercel.app/">Демонстрация</a></h3>

### Тестовый аккаунт

```
ivanov@mail.ru
12345678
```

## Как это выглядит

страница входа

<img width="370" alt="image" src="https://github.com/user-attachments/assets/99184732-a4e4-44a5-b374-3f7f1bb5442b">

профиль пользователя

<img width="370" alt="image" src="https://github.com/user-attachments/assets/d8de09a6-51a4-4991-9e65-e02b69b5d371">

страница со всеми переписками

<img width="700" alt="image" src="https://github.com/user-attachments/assets/04fa478e-e275-4201-9036-48208b231220">

страница со всеми пользователями

<img width="700" alt="image" src="https://github.com/user-attachments/assets/e29d15ca-9e7f-4908-a97e-018ed88e5510">


## Запуск проекта

Перед началом работы вы должны:
1. В `.env` файле в корне проекта, измените переменные `XXXXXX`
* `EMAIL_SENDER` и `PASSWORD` для отправки электронных писем на почту
* `DETA_PROJECT_KEY`, `DETA_NAME_DRIVE`, `DETA_NAME_BASE` и `DETA_NAME_BASE_RECOVER_PASSWORD` для базы данных NoSQL и загрузки файлов на платформу Deta
* `SECRET_STRING` для токенов JWT. Используя BASH , вы можете сгенерировать с помощью команды
```bash
openssl rand -hex 32
```
Для запуска проекта требуется Docker. В консоли, в каталоге с проектом, введите команду
```
docker-compose up
```
Нажмите на ссылку:
http://localhost

### Во время регистрации, авторизации, восстановления пароля электронное письмо, отправленное на реальный адрес электронной почты, может попасть в СПАМ!
