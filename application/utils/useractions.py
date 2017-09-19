from ..models import User, UserTags, Event

class UserActions():
    def __init__(self, user, event, timestamp):
        self.user = user
        self.event = event
        self.timestamp = timestamp

    def subscribe(self):
        self.user.subscribe(True)

    def unsubscribe(self):
        self.user.subscribe(False)

