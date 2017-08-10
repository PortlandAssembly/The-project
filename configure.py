from twilio.rest import Client
from flask_script import Manager, Server
from application.app import app
import os

print
print
print " --- Enter your Twilio information below to configure install --- "
print
print

def maybe_default(config_val):
    return ' [' + config_val + ']' if config_val else '';

def input_with_default( prompt, config_val ):
    os_config = os.environ[config_val] if config_val in os.environ else ''
    prompted = raw_input( prompt + maybe_default(os_config) + ': ' )
    return prompted or os_config

twilio_number = input_with_default('Twilio Phone Number', 'TWILIO_NUMBER')
account_sid = input_with_default('Twilio Account Sid', 'TWILIO_ACCOUNT_SID')
auth_token = input_with_default('Twilio Auth Token', 'TWILIO_AUTH_TOKEN')
host_name = input_with_default('Publicly accessible URL (ngrok tunnel, for example)', 'TWILIO_HOST_NAME')
database_url = input_with_default('Database to use', 'DATABASE_URL')

### LOCAL FOR DEBUGGING
#twilio_number = '+15036766408'
#account_sid = 'ACb227808447a91e78137f0ce02ccb26c3'
#auth_token = 'f71096e8247d6b94e718e6ae8f18b404'
#host_name = 'http://example.org'
#database_url = 'sqlite:///your.db'

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
    twilio.incoming_phone_numbers(str(number_sid)).update(friendly_name='The project',sms_url=str(sms_url),sms_method='POST')
    print
    print "All Done!"
except Exception as e:
    print 'Error configuring webhooks with Twilio. '
    raise SystemExit
    
print "Configuration is now complete. After exporting the environment variables shown above, you can run the development server with `python manager.py runserver`."
