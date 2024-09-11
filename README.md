# Simple messenger
Pet-project is a simple messenger on websockets

<h3><a href="https://private-chat-sigma.vercel.app/">Live Demo</a></h3>

### Test account

```
ivanov@mail.ru
12345678
```

## How it looks like

login page

<img width="370" alt="image" src="https://github.com/user-attachments/assets/99184732-a4e4-44a5-b374-3f7f1bb5442b">

user profile

<img width="370" alt="image" src="https://github.com/user-attachments/assets/d8de09a6-51a4-4991-9e65-e02b69b5d371">

the page with all the correspondence

<img width="700" alt="image" src="https://github.com/user-attachments/assets/04fa478e-e275-4201-9036-48208b231220">

a page with all users

<img width="700" alt="image" src="https://github.com/user-attachments/assets/e29d15ca-9e7f-4908-a97e-018ed88e5510">


## Project launch

Before starting, you must:
1. In the `.env` file in the root of the project, change the variables `XXXXXX`
* `EMAIL_SENDER` and `PASSWORD` to send emails to the mail
* `DETA_PROJECT_KEY`, `DETA_NAME_DRIVE`, `DETA_NAME_BASE` and `DETA_NAME_BASE_RECOVER_PASSWORD` for NoSQL database and uploading files to the DETA platform
* `SECRET_STRING` for JWT tokens. Using BASH , you can generate with the command
```bash
openssl rand -hex 32
```
Docker is required to run the project. In the console, in the directory with the project, enter the command
```
docker-compose up
```
Click on the link:
http://localhost

### During registration, authorization, password recovery, an email sent to a real email can get into SPAM!
