from testing_config import BaseTestConfig
from application.models import User


class TestModels(BaseTestConfig):
    def test_get_user_with_email_and_password(self):
        self.assertTrue(
                User.get_user_with_email_and_password(
                        self.default_user["email"],
                        self.default_user["password"])
        )

    def test_unsubscribe_user(self):
        user = User.get_user_with_email_and_password(
                    self.default_user["email"],
                    self.default_user["password"])
        user.subscribe(False)
        self.assertFalse(user.active)
        user.subscribe()
        self.assertTrue(user.active)
