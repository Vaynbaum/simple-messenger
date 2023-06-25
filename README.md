# simple-messenger
Pet-project is a simple messenger on websockets

<h3><a href="https://private-chat-sigma.vercel.app/">Live Demo</a></h3>

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
