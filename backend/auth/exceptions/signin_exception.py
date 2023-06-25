class SigninException(Exception):
    def __init__(self, message):
        self.message = message
