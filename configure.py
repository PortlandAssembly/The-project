from twilio.rest import Client
from flask_script import Manager, Server
import readline
import os
import re

urlvalid = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
numbervalid = re.compile(r'^\+(\d{5,6}$|\d{11,13}$)')
sidvalid = re.compile(r'^[0-9a-fA-F]{34}$')
tokenvalid = re.compile(r'^[0-9a-fA-F]+$')

print
print
print " --- Enter your Twilio information below to configure install --- "
print
print

def maybe_default(config_val):
    return ' [' + config_val + ']' if config_val else '';

def input_with_default(prompt, config_val, regex_check, errorstring, default=''):
    os_config = os.environ[config_val] if config_val in os.environ else ''
    prompted = raw_input(prompt + maybe_default(os_config or default) + ': ').strip()
    value = prompted or os_config or default
    if ('match' in dir(regex_check)) and (callable(getattr(regex_check, 'match'))):
        while (regex_check.match(value) == None):
            print errorstring + ": %s" % value
            value = raw_input(prompt + maybe_default(os_config or default) + ': ').strip()
    return value

twilio_number = input_with_default('Twilio Phone Number (format: +12345678900)', 'TWILIO_NUMBER', numbervalid, 'Invalid number format')
account_sid = input_with_default('Twilio Account Sid', 'TWILIO_ACCOUNT_SID', sidvalid, 'Invalid SID')
auth_token = input_with_default('Twilio Auth Token', 'TWILIO_AUTH_TOKEN', tokenvalid, 'Invalid authtoken')
host_name = input_with_default('Publicly accessible URL (ngrok tunnel, for example)', 'TWILIO_HOST_NAME', urlvalid, 'Invalid url')
database_url = input_with_default('Database to use', 'DATABASE_URL', None, '', 'sqlite:///default.db')

print "Writing configuration to file..."

print """\n\n
To avoid having to run this every time you start the app, you can copy these lines to your shell startup script (~/.bashrc, ~/.zshrc, etc).
(Note that if you're using ngrok, the subdomain will change every time you open a tunnel, so that part will have to chyange each time.)

# Twilio environment variables auto-generated during RRN app installation
export TWILIO_NUMBER='{}'
export TWILIO_ACCOUNT_SID='{}'
export TWILIO_AUTH_TOKEN='{}'
export TWILIO_HOST_NAME='{}'
export DATABASE_URL='{}'
""".format(twilio_number, account_sid, auth_token, host_name, database_url)

os.environ['TWILIO_NUMBER'] = twilio_number
os.environ['TWILIO_ACCOUNT_SID'] = account_sid
os.environ['TWILIO_AUTH_TOKEN'] = auth_token
os.environ['TWILIO_HOST_NAME'] = host_name
os.environ['DATABASE_URL'] = database_url

# f = open('local-config.py', 'rw')
# contents = f.read()
# f.close()
# f = open('local-config.py', 'w')
# f.write(contents + config)
# f.close()

print
print
print "Testing Twilio configuration..."
try:
    twilio = Client(account_sid,auth_token)

    all_numbers = twilio.incoming_phone_numbers.list()
    number_sid = next(num.sid for num in all_numbers if num.phone_number==str(twilio_number))
    sms_url = os.path.join(host_name, 'api/message')

    print 'Found Twilio account and SID for this phone number... '
    print 'Incoming webhooks will be posted to '+sms_url

except Exception as e:
    print 'Error contacting Twilio API with credentials provided. Configuration will not be updated successfully!'
    raise SystemExit

print "Updating Twilio configuration with new webhook URLs:"
 
try:
    twilio.incoming_phone_numbers(str(number_sid)).update(friendly_name='Heyer Alerta',sms_url=str(sms_url),sms_method='POST')
    print
    print "All Done!"
except Exception as e:
    print 'Error configuring webhooks with Twilio. '
    raise SystemExit
    
print "Configuration is now complete. After exporting the environment variables shown above, you can run the development server with `python manager.py runserver`."
