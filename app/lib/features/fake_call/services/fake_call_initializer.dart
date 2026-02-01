import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/fake_call_scheduler.dart';
import '../services/fake_call_notification_service.dart';

/// Helper class for initializing fake call services
class FakeCallInitializer {
  static final FakeCallInitializer _instance = FakeCallInitializer._internal();
  factory FakeCallInitializer() => _instance;
  FakeCallInitializer._internal();

  bool _isInitialized = false;

  /// Initialize all fake call services
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      debugPrint('[FakeCall] Initializing services...');

      // Initialize scheduler
      await FakeCallScheduler().initialize();

      // Initialize notification service
      await FakeCallNotificationService().initialize();

      // Request permissions
      await _requestPermissions();

      _isInitialized = true;
      debugPrint('[FakeCall] Services initialized successfully');
    } catch (e) {
      debugPrint('[FakeCall] Initialization error: $e');
    }
  }

  /// Request all necessary permissions
  Future<void> _requestPermissions() async {
    try {
      // Request notification permission
      await FakeCallNotificationService().requestPermissions();

      // Request other permissions
      final permissions = [
        Permission.notification,
        Permission.scheduleExactAlarm,
        Permission.systemAlertWindow,
      ];

      for (final permission in permissions) {
        final status = await permission.status;
        if (!status.isGranted) {
          await permission.request();
        }
      }

      debugPrint('[FakeCall] Permissions requested');
    } catch (e) {
      debugPrint('[FakeCall] Permission request error: $e');
    }
  }

  /// Check if all required permissions are granted
  Future<bool> hasAllPermissions() async {
    try {
      final notificationStatus = await Permission.notification.status;
      final systemAlertStatus = await Permission.systemAlertWindow.status;

      return notificationStatus.isGranted && systemAlertStatus.isGranted;
    } catch (e) {
      debugPrint('[FakeCall] Permission check error: $e');
      return false;
    }
  }
}
