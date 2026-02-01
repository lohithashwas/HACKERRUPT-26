# Fake Call Feature - Implementation Documentation

## 🎯 Overview

This is a production-grade **Fake Incoming Call** system designed for the Women's Safety App. The feature creates realistic incoming calls that are indistinguishable from real phone calls, providing a discreet safety mechanism.

---

## 📁 Architecture

### Clean Architecture Structure

```
lib/features/fake_call/
├── models/
│   ├── fake_call_contact.dart      # Contact data model
│   └── fake_call_state.dart        # State management model
├── bloc/
│   ├── fake_call_event.dart        # BLoC events
│   └── fake_call_bloc.dart         # BLoC logic
├── services/
│   ├── fake_call_scheduler.dart            # Background scheduling
│   ├── fake_call_notification_service.dart # Notifications & ringtone
│   └── fake_call_initializer.dart          # Service initialization
└── screens/
    ├── fake_call_setup_screen.dart         # Setup UI
    └── incoming_call_screen.dart           # Call UI (incoming & ongoing)
```

---

## ✨ Features Implemented

### 1. **Call Trigger Modes**

- ✅ Immediate call
- ✅ After 10 seconds
- ✅ After 1 minute
- ✅ After 5 minutes

Uses **WorkManager** for reliable background scheduling that survives app kills.

### 2. **Realistic Caller Identity**

- 10 predefined realistic contacts (Mom, Dad, Sister, etc.)
- Random selection for each call
- Customizable contact list

### 3. **Ringtone & Vibration**

- System-like ringtone using `just_audio`
- Realistic vibration pattern matching real calls
- Looping until answered/rejected

### 4. **Lock Screen & Full Screen**

- Full-screen incoming call notification
- Works on lock screen
- Wakes the screen
- Overlays other apps

### 5. **UI Design - Google Dialer Clone**

- **Incoming Call Screen:**
  - Animated pulsing avatar
  - Caller name & number display
  - Green Accept / Red Decline buttons
  - Dark theme matching Google Dialer
- **Ongoing Call Screen:**
  - Call timer
  - Mute, Speaker, Keypad buttons
  - End call button
  - Realistic layout and styling

### 6. **Call Flow**

```
Schedule → Trigger → Incoming Screen → Accept/Reject
                                      ↓
                                 Ongoing Call → End
```

### 7. **State Management**

- **BLoC Pattern** for clean separation
- Proper state transitions
- Timer management for call duration
- Auto-reset after call ends

### 8. **Android Integration**

- Full-screen intent notifications
- Foreground service support
- Proper notification channels
- Wake lock for screen control

### 9. **Permissions Handled**

- POST_NOTIFICATIONS (Android 13+)
- USE_FULL_SCREEN_INTENT
- SYSTEM_ALERT_WINDOW
- SCHEDULE_EXACT_ALARM
- WAKE_LOCK
- RECEIVE_BOOT_COMPLETED

### 10. **Reliability**

- Background scheduling survives app kill
- WorkManager ensures delivery
- Proper error handling
- Debug logging for troubleshooting

---

## 🚀 Usage

### Integration in Dashboard

Add this to your dashboard or safety features screen:

```dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/fake_call/bloc/fake_call_bloc.dart';
import 'features/fake_call/services/fake_call_scheduler.dart';
import 'features/fake_call/services/fake_call_notification_service.dart';
import 'features/fake_call/screens/fake_call_setup_screen.dart';

// In your widget:
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

### Programmatic Trigger

```dart
// Get the BLoC
final fakeCallBloc = context.read<FakeCallBloc>();

// Schedule immediate call
fakeCallBloc.add(ScheduleFakeCall(
  delay: FakeCallDelay.immediate,
  callerName: 'Mom',
  callerNumber: '+91 98765 43210',
));

// Trigger the call
fakeCallBloc.add(TriggerFakeCall(
  callerName: 'Mom',
  callerNumber: '+91 98765 43210',
));
```

---

## 🔧 Configuration

### Adding Custom Contacts

Edit `lib/features/fake_call/models/fake_call_contact.dart`:

```dart
static const List<FakeCallContact> defaultContacts = [
  FakeCallContact(name: 'Your Name', phoneNumber: '+91 XXXXX XXXXX'),
  // Add more contacts...
];
```

### Customizing Delays

Edit `lib/features/fake_call/models/fake_call_state.dart`:

```dart
enum FakeCallDelay {
  immediate(duration: Duration.zero, label: 'Immediate'),
  custom(duration: Duration(minutes: 10), label: '10 minutes'),
  // Add more delays...
}
```

---

## 📱 Android Setup

### Required Permissions (Already Added)

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```

### Notification Channel

The app automatically creates a notification channel named "Fake Call" with maximum priority for full-screen intents.

---

## 🎨 UI Customization

### Colors

The UI uses a dark theme matching Google Dialer:

- Background: `#1E1E1E`
- Accept Button: `#4CAF50` (Green)
- Decline Button: `#E53935` (Red)
- Text: White with varying opacity

### Animations

- Pulsing avatar animation (1.0 to 1.1 scale)
- Smooth transitions between screens
- Button press feedback

---

## 🐛 Debugging

Enable debug logs by checking the console for `[FakeCall]` prefixed messages:

```
[FakeCall] Scheduler initialized
[FakeCall] Scheduling call in 60 seconds
[FakeCall] Notification shown for Mom
[FakeCall] Ringing started
[FakeCall] Call accepted from notification
```

---

## 🔒 Security & Privacy

- No actual phone calls are made
- No data is transmitted externally
- All processing happens locally
- Permissions are requested transparently

---

## 📊 State Flow

```
IDLE → SCHEDULED → RINGING → ACCEPTED/REJECTED → ENDED → IDLE
                      ↓
                  (ongoing call with timer)
```

---

## 🎯 Best Practices

1. **Always initialize services** in `main()` before `runApp()`
2. **Request permissions** before scheduling calls
3. **Test on real devices** - emulators may not support all features
4. **Handle permission denials** gracefully
5. **Provide user feedback** for scheduled calls

---

## 🚨 Known Limitations

1. **Ringtone**: Currently uses a placeholder asset. Add `assets/ringtone.mp3` for custom sound.
2. **iOS Support**: This implementation is Android-focused. iOS requires different approach.
3. **Battery Optimization**: Some manufacturers may kill background tasks aggressively.

---

## 🔮 Future Enhancements

- [ ] Custom ringtone selection
- [ ] Voice playback during call
- [ ] Call history
- [ ] Multiple scheduled calls
- [ ] iOS implementation
- [ ] Widget for quick access
- [ ] Emergency auto-trigger based on sensors

---

## 📦 Dependencies

```yaml
workmanager: ^0.5.2 # Background scheduling
flutter_local_notifications: ^18.0.1 # Notifications
vibration: ^2.0.0 # Haptic feedback
just_audio: ^0.9.42 # Audio playback
wakelock_plus: ^1.2.8 # Screen wake control
flutter_bloc: ^9.1.1 # State management
permission_handler: ^12.0.1 # Permission handling
```

---

## 👨‍💻 Code Quality

- ✅ Null-safe
- ✅ Clean architecture
- ✅ Separation of concerns
- ✅ Proper error handling
- ✅ Comprehensive documentation
- ✅ Scalable and maintainable

---

## 🎓 Learning Resources

- [WorkManager Documentation](https://pub.dev/packages/workmanager)
- [Flutter Local Notifications](https://pub.dev/packages/flutter_local_notifications)
- [BLoC Pattern Guide](https://bloclibrary.dev)

---

## 📞 Support

For issues or questions:

1. Check debug logs
2. Verify permissions are granted
3. Test on physical device
4. Review this documentation

---

**Built with ❤️ for Women's Safety**
