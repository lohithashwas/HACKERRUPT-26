
import os
from flask import Flask, jsonify
from flask_cors import CORS
from twilio.rest import Client
from dotenv import load_dotenv

# Load credentials from the local .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Twilio Configuration
ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
TARGET_NUMBER = os.getenv('TARGET_PHONE_NUMBER')

print(f"Server Token Loaded: {bool(AUTH_TOKEN)}")
print(f"Target Number: {TARGET_NUMBER}")

def get_twilio_client():
    if ACCOUNT_SID and AUTH_TOKEN:
        return Client(ACCOUNT_SID, AUTH_TOKEN)
    return None

@app.route('/')
def index():
    return "Protect-R Emergency Gateway Online"

@app.route('/send-sms', methods=['POST'])
def send_sms():
    try:
        client = get_twilio_client()
        if not client:
            return jsonify({'message': 'Server Config Error: Missing Credentials', 'status': 'error'}), 500
        
        message = client.messages.create(
            body='🚨 EMERGENCY ALERT: Protect-R Application\n\nUser requires immediate assistance!\nLocation: https://maps.app.goo.gl/NhwcWu1uy5ZTPCDq8',
            to=TARGET_NUMBER,
            from_=TWILIO_NUMBER
        )
        return jsonify({'message': f'SMS Sent Successfully (SID: {message.sid})', 'status': 'success'})
    except Exception as e:
        print(f"SMS Failed: {e}")
        return jsonify({'message': str(e), 'status': 'error'}), 500

@app.route('/initiate-call', methods=['POST'])
def initiate_call():
    try:
        client = get_twilio_client()
        if not client:
            return jsonify({'message': 'Server Config Error: Missing Credentials', 'status': 'error'}), 500

        call = client.calls.create(
            twiml='<Response><Say loop="2">This is an emergency alert from Protect R. User requires help immediately.</Say></Response>',
            to=TARGET_NUMBER,
            from_=TWILIO_NUMBER
        )
        return jsonify({'message': f'Voice Call Initiated (SID: {call.sid})', 'status': 'success'})
    except Exception as e:
        print(f"Call Failed: {e}")
        return jsonify({'message': str(e), 'status': 'error'}), 500

if __name__ == '__main__':
    print("Starting REAL Emergency Gateway on Port 5001...")
    # Using 0.0.0.0 to ensure it's accessible locally
    app.run(debug=True, port=5001, host='0.0.0.0')
