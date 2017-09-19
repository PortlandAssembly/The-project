from testing_config import BaseTestConfig
from application.models import User
from application.utils.msgparse import parse_message

class TestMsgParse(BaseTestConfig):

    def test_uppercase_command(self):
        result = parse_message('Help')
        self.assertTrue(result['handled'])
        result = parse_message('HELP')
        self.assertTrue(result['handled'])

    def test_help_command(self):
        result = parse_message('help')
        self.assertTrue(result['handled'])
        self.assertIn('Commands available:', result['response'])

    def test_subscribe_command(self):
        result = parse_message('subscribe')
        self.assertTrue(result['handled'])
        self.assertEquals('subscribe', result['action'])
        self.assertIn('Subscribed', result['response'])

    def test_generic_message(self):
        result = parse_message('This is a generic message, maybe about an event')
        self.assertFalse(result['handled'])

