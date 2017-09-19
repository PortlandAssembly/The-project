from cmd import Cmd

class MsgParse(Cmd):

    def precmd(self, line):
        return line.strip().lower()

    def do_help(self, line):
        return {
            'handled': True,
            'response': """
Commands available:

subscribe: subscribe to alerts
unsubscribe: stop receiving alerts
tags: view or change your tags (interests, skills, locations)
            """
            }

    def do_subscribe(self, line):
        """Create the user if they don't exist, and subscribe them to future
            alerts, but do nothing else.

            """
        return {
            'handled': True,
            'action': 'subscribe',
            'response': 'Subscribed to alerts'
            }

    def do_unsubscribe(self, line):
        """Stop the user from receiving alerts in the future, until such a time
            as they as re-subscribed.

            """
        return {
            'handled': True,
            'action': 'unsubscribe',
            'response': 'Unsubscribed from all alerts. Text "subscribe" at any time to resubscribe'
            }

    def do_EOF(self, line):
        return True

    def default(self, line):
        return {
            'handled': False
            }

def parse_message(line):
    parser = MsgParse()
    return parser.onecmd(parser.precmd(line))

