import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';
import 'package:vibration/vibration.dart';

/// Service for managing fake call notifications, ringtone, and vibration
class FakeCallNotificationService {
  static final FakeCallNotificationService _instance =
      FakeCallNotificationService._internal();
  factory FakeCallNotificationService() => _instance;
  FakeCallNotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;
  bool _isRinging = false;

  /// Initialize the notification service
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      const androidSettings = AndroidInitializationSettings(
        '@mipmap/ic_launcher',
      );
      const initSettings = InitializationSettings(android: androidSettings);

      await _notifications.initialize(
        initSettings,
        onDidReceiveNotificationResponse: _onNotificationTapped,
      );

      _isInitialized = true;
      debugPrint('[FakeCall] Notification service initialized');
    } catch (e) {
      debugPrint('[FakeCall] Notification init error: $e');
    }
  }

  /// Show incoming call notification with full-screen intent
  Future<void> showIncomingCallNotification({
    required String callerName,
    required String callerNumber,
  }) async {
    if (!_isInitialized) {
      await initialize();
    }

    try {
      // Start ringing and vibration
      await startRinging();

      // Create full-screen notification
      const androidDetails = AndroidNotificationDetails(
        'fake_call_channel',
        'Fake Call',
        channelDescription: 'Incoming fake call notifications',
        importance: Importance.max,
        priority: Priority.max,
        category: AndroidNotificationCategory.call,
        fullScreenIntent: true,
        ongoing: true,
        autoCancel: false,
        playSound: false, // We handle sound separately
        enableVibration: false, // We handle vibration separately
        actions: <AndroidNotificationAction>[
          AndroidNotificationAction(
            'accept',
            'Accept',
            showsUserInterface: true,
            cancelNotification: false,
          ),
          AndroidNotificationAction(
            'reject',
            'Reject',
            showsUserInterface: true,
            cancelNotification: true,
          ),
        ],
      );

      const notificationDetails = NotificationDetails(android: androidDetails);

      await _notifications.show(
        0,
        callerName,
        callerNumber,
        notificationDetails,
        payload: 'fake_call',
      );

      debugPrint('[FakeCall] Notification shown for $callerName');
    } catch (e) {
      debugPrint('[FakeCall] Show notification error: $e');
    }
  }

  /// Start ringtone and vibration
  Future<void> startRinging() async {
    if (_isRinging) return;

    try {
      _isRinging = true;

      // Play system ringtone with looping
      FlutterRingtonePlayer().playRingtone(looping: true, asAlarm: false);

      // Check if device supports vibration
      final hasVibrator = await Vibration.hasVibrator() ?? false;
      if (hasVibrator) {
        // Vibrate with pattern: [wait, vibrate, wait, vibrate, ...]
        // Pattern mimics real phone call vibration
        Vibration.vibrate(
          pattern: [0, 1000, 500, 1000, 500, 1000],
          repeat: 0, // Repeat from index 0
        );
      }

      debugPrint('[FakeCall] Ringing started with system ringtone');
    } catch (e) {
      debugPrint('[FakeCall] Start ringing error: $e');
    }
  }

  /// Stop ringtone and vibration
  Future<void> stopRinging() async {
    if (!_isRinging) return;

    try {
      _isRinging = false;

      // Stop ringtone
      FlutterRingtonePlayer().stop();

      // Stop vibration
      await Vibration.cancel();

      debugPrint('[FakeCall] Ringing stopped');
    } catch (e) {
      debugPrint('[FakeCall] Stop ringing error: $e');
    }
  }

  /// Cancel notification
  Future<void> cancelNotification() async {
    try {
      await _notifications.cancel(0);
      debugPrint('[FakeCall] Notification cancelled');
    } catch (e) {
      debugPrint('[FakeCall] Cancel notification error: $e');
    }
  }

  /// Handle notification tap
  void _onNotificationTapped(NotificationResponse response) {
    debugPrint('[FakeCall] Notification tapped: ${response.actionId}');

    if (response.actionId == 'accept') {
      // Handle accept action
      debugPrint('[FakeCall] Call accepted from notification');
    } else if (response.actionId == 'reject') {
      // Handle reject action
      debugPrint('[FakeCall] Call rejected from notification');
      stopRinging();
    }
  }

  /// Request notification permissions
  Future<bool> requestPermissions() async {
    try {
      final androidImplementation = _notifications
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >();

      if (androidImplementation != null) {
        final granted = await androidImplementation
            .requestNotificationsPermission();
        debugPrint('[FakeCall] Notification permission: $granted');
        return granted ?? false;
      }
      return false;
    } catch (e) {
      debugPrint('[FakeCall] Permission request error: $e');
      return false;
    }
  }
}
