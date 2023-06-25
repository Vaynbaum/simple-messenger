from fastapi import FastAPI
from pydantic import EmailStr
from jinja2 import Template

from config import settings
from const import (
    FAILDED,
    SUBJECT_GREETING,
    SUBJECT_RECOVER_PASSWORD,
    SUBJECT_SIGNIN,
    SUCCSESS,
)
from message_model import MessageModel
from sender import createServer, post


serverSMTP = createServer(settings.EMAIL_SENDER, settings.PASSWORD)

app = FastAPI()


@app.get("/send_code/")
async def root(email: EmailStr, url: str):
    html = open("./templates/reset_password.html", encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.EMAIL_SENDER,
            email,
            template.render(url=url),
            SUBJECT_RECOVER_PASSWORD,
            settings.PASSWORD,
        )
        return res if res else MessageModel(mailer_result=SUCCSESS)
    return MessageModel(mailer_result=FAILDED)


@app.get("/warning_signin/")
async def root(email: EmailStr):
    html = open("./templates/warning_signin.html", encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.EMAIL_SENDER,
            email,
            template.render(),
            SUBJECT_SIGNIN,
            settings.PASSWORD,
        )
        return res if res else MessageModel(mailer_result=SUCCSESS)
    return MessageModel(mailer_result=FAILDED)


@app.get("/greeting/")
async def root(email: EmailStr, fullname: str):
    html = open("./templates/greeting.html", encoding="utf-8").read()
    template = Template(html)
    if serverSMTP is not None:
        res = post(
            serverSMTP,
            settings.EMAIL_SENDER,
            email,
            template.render(fullname=fullname),
            SUBJECT_GREETING,
            settings.PASSWORD,
        )
        return res if res else MessageModel(mailer_result=SUCCSESS)
    return MessageModel(mailer_result=FAILDED)
