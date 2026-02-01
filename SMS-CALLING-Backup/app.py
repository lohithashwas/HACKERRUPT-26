import os
from flask import Flask, render_template, jsonify, request
from twilio.rest import Client
from dotenv import load_dotenv

from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)


# Twilio credentials - safely get them
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')
target_phone_number = os.getenv('TARGET_PHONE_NUMBER')

# Initialize Client safely
client = None
if account_sid and auth_token:
    try:
        client = Client(account_sid, auth_token)
    except Exception as e:
        print(f"Error initializing Twilio client: {e}")

@app.route('/')
def index():
    return render_template('index.html', target_number=target_phone_number)

@app.route('/initiate-call', methods=['POST'])
def initiate_call():
    if not client or not target_phone_number:
         # Mock success for demo purposes
        return jsonify({'message': 'DEMO MODE: Call initiated successfully! (Mock)', 'status': 'success'})

    try:
        call = client.calls.create(
            twiml='<Response><Say>Ahoy! This is a call from your Twilio application.</Say></Response>',
            to=target_phone_number,
            from_=twilio_phone_number
        )
        return jsonify({'message': f'Call initiated successfully! SID: {call.sid}', 'status': 'success'})
    except Exception as e:
        return jsonify({'message': f'Failed to initiate call: {str(e)}', 'status': 'error'})

@app.route('/send-sms', methods=['POST'])
def send_sms():
    print("Received request to send SMS...")
    if not client or not target_phone_number:
        # Mock success for demo purposes
        print("Missing credentials or client, sending MOCK SUCCESS response.")
        return jsonify({'message': 'DEMO MODE: SMS sent successfully! (Mock)', 'status': 'success'})

    try:
        message = client.messages.create(
            body='Emergency Alert from Protect - R\n\nBalaji Requires your Support\n\nCheck Location : https://maps.app.goo.gl/NhwcWu1uy5ZTPCDq8',
            to=target_phone_number,
            from_=twilio_phone_number
        )
        return jsonify({'message': f'SMS sent successfully! SID: {message.sid}', 'status': 'success'})
    except Exception as e:
        print(f"Twilio Error: {e}")
        # Even on error, for a hackathon demo, sometimes it's better to return success to show the UI
        # But let's return error but with a clear message
        return jsonify({'message': f'Failed to send SMS: {str(e)}', 'status': 'error'})

if __name__ == '__main__':
    print("Starting Flask Server on Port 5001...")
    app.run(debug=True, port=5001)
