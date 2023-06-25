from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from const import FAILDED

from message_model import MessageModel


def createServer(sender: str, password: str):
    domain = sender.split("@")[1]
    smtpObj = smtplib.SMTP(f"smtp.{domain}", 587)
    smtpObj.starttls()
    try:
        smtpObj.login(sender, password)
    except Exception as ex:
        print(ex)
        return None
    return smtpObj


def post(
    serverSMTP: smtplib.SMTP,
    sender: str,
    email_reciver: str,
    message: str,
    subject: str,
    password: str,
):
    msg = MIMEMultipart()
    msg.attach(MIMEText(message, "html", "utf-8"))
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = email_reciver
    try:
        return serverSMTP.sendmail(sender, email_reciver, msg.as_string())
    except Exception as ex:
        print(ex)
        serverSMTP = createServer(sender, password)
        if serverSMTP is None:
            return MessageModel(mailer_result=FAILDED)
        else:
            return post(serverSMTP, sender, email_reciver, message, subject, password)
