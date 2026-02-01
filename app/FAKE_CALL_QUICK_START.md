# 🚨 Fake Call Feature - Quick Start Guide

## ✅ What's Been Implemented

A **production-grade Fake Incoming Call system** that creates realistic phone calls indistinguishable from real ones.

---

## 📂 Files Created

### Models

- `lib/features/fake_call/models/fake_call_contact.dart` - Contact data
- `lib/features/fake_call/models/fake_call_state.dart` - State management

### BLoC (State Management)

- `lib/features/fake_call/bloc/fake_call_event.dart` - Events
- `lib/features/fake_call/bloc/fake_call_bloc.dart` - Business logic

### Services

- `lib/features/fake_call/services/fake_call_scheduler.dart` - Background scheduling
- `lib/features/fake_call/services/fake_call_notification_service.dart` - Notifications & audio
- `lib/features/fake_call/services/fake_call_initializer.dart` - Initialization

### UI Screens

- `lib/features/fake_call/screens/fake_call_setup_screen.dart` - Setup interface
- `lib/features/fake_call/screens/incoming_call_screen.dart` - Call UI (Google Dialer clone)

### Configuration

- `android/app/src/main/AndroidManifest.xml` - Updated with permissions
- `pubspec.yaml` - Added dependencies
- `lib/main.dart` - Added service initialization

---

## 🚀 How to Use

### 1. Navigate to Fake Call Screen

Add this button to your dashboard:

```dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/fake_call/bloc/fake_call_bloc.dart';
import 'features/fake_call/services/fake_call_scheduler.dart';
import 'features/fake_call/services/fake_call_notification_service.dart';
import 'features/fake_call/screens/fake_call_setup_screen.dart';

// In your widget build method:
ElevatedButton(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BlocProvider(
          create: (_) => FakeCallBloc(
            scheduler: FakeCallScheduler(),
            notificationService: FakeCallNotificationService(),
          ),
          child: const FakeCallSetupScreen(),
        ),
      ),
    );
  },
  child: const Text('Fake Call'),
)
```

### 2. User Flow

1. User opens Fake Call screen
2. Selects a caller (Mom, Dad, Sister, etc.)
3. Chooses timing (Immediate, 10s, 1m, 5m)
4. Taps "Schedule Fake Call"
5. Call appears as realistic incoming call
6. User can Accept or Decline
7. If accepted, shows ongoing call screen with timer

---

## 🎯 Features

✅ **4 Timing Options**: Immediate, 10 seconds, 1 minute, 5 minutes  
✅ **10 Realistic Contacts**: Pre-configured with Indian phone numbers  
✅ **System Ringtone**: Plays audio in loop  
✅ **Vibration Pattern**: Mimics real phone calls  
✅ **Full-Screen UI**: Works on lock screen  
✅ **Google Dialer Clone**: Pixel-perfect UI  
✅ **Background Scheduling**: Survives app kill  
✅ **Call Timer**: Shows duration when accepted  
✅ **Clean Architecture**: BLoC pattern, scalable

---

## 📱 Permissions (Auto-Requested)

The app will request these permissions automatically:

- Notifications
- Full-screen intents
- System alert window
- Schedule exact alarms

---

## 🎨 UI Preview

### Incoming Call Screen

- Dark background (#1E1E1E)
- Animated pulsing avatar
- Caller name & number
- Green "Accept" button
- Red "Decline" button

### Ongoing Call Screen

- Call timer (MM:SS format)
- Mute, Speaker, Keypad buttons
- Red "End Call" button

---

## 🔧 Customization

### Add Custom Contacts

Edit `lib/features/fake_call/models/fake_call_contact.dart`:

```dart
static const List<FakeCallContact> defaultContacts = [
  FakeCallContact(name: 'Custom Name', phoneNumber: '+91 XXXXX XXXXX'),
  // Add more...
];
```

### Add Custom Timing

Edit `lib/features/fake_call/models/fake_call_state.dart`:

```dart
enum FakeCallDelay {
  // Add new delays here
  tenMinutes(duration: Duration(minutes: 10), label: '10 minutes'),
}
```

---

## 🎵 Adding Ringtone (Optional)

1. Get an MP3 ringtone file
2. Save it as `assets/ringtone.mp3`
3. Run `flutter pub get`

The app will use this ringtone. If not provided, it will still work (vibration + UI only).

---

## 🐛 Testing

### On Real Device (Recommended)

```bash
flutter run
```

### Test Scenarios

1. **Immediate Call**: Should trigger instantly
2. **Scheduled Call**: Wait for timer, should trigger even if app is closed
3. **Lock Screen**: Lock phone, call should appear
4. **Accept Call**: Should show ongoing call screen
5. **Reject Call**: Should dismiss immediately

---

## 📊 Dependencies Added

```yaml
workmanager: ^0.5.2 # Background tasks
flutter_local_notifications: ^18.0.1 # Notifications
vibration: ^2.0.0 # Haptic feedback
just_audio: ^0.9.42 # Audio playback
wakelock_plus: ^1.2.8 # Screen control
```

---

## ⚠️ Important Notes

1. **Test on Real Device**: Emulators may not support all features
2. **Battery Optimization**: Some phones may kill background tasks
3. **Permissions**: User must grant all permissions for full functionality
4. **Android Only**: This implementation is Android-focused

---

## 🔍 Troubleshooting

### Call doesn't trigger

- Check permissions are granted
- Verify WorkManager is initialized
- Check device battery optimization settings

### No sound

- Add `assets/ringtone.mp3` file
- Check device volume
- Verify audio permissions

### UI doesn't appear

- Check notification permissions
- Verify full-screen intent permission
- Test on physical device

---

## 📚 Full Documentation

See `FAKE_CALL_DOCUMENTATION.md` for comprehensive documentation including:

- Architecture details
- State flow diagrams
- Advanced customization
- Code quality guidelines
- Future enhancements

---

## 🎓 Next Steps

1. **Test the feature** on a real Android device
2. **Add ringtone** file to `assets/` folder
3. **Integrate** into your dashboard/safety features
4. **Customize** contacts and timing as needed
5. **Review** full documentation for advanced features

---

## ✨ Key Highlights

- **Zero visual indicators** that it's fake
- **Survives app kill** - scheduled calls will trigger
- **Production-ready** - clean code, error handling
- **Scalable** - easy to extend and customize
- **Premium UI** - matches Google Dialer exactly

---

**Built for Women's Safety** 🛡️

For questions or issues, refer to the full documentation or check debug logs with `[FakeCall]` prefix.
