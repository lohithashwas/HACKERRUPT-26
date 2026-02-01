import 'dart:async';
import 'package:flutter/material.dart';
import 'fake_call_notification_service.dart';

/// Service for scheduling fake calls using Timers
class FakeCallScheduler {
  static final FakeCallScheduler _instance = FakeCallScheduler._internal();
  factory FakeCallScheduler() => _instance;
  FakeCallScheduler._internal();

  Timer? _scheduledTimer;
  bool _isInitialized = false;

  /// Initialize the scheduler
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      _isInitialized = true;
      debugPrint('[FakeCall] Scheduler initialized');
    } catch (e) {
      debugPrint('[FakeCall] Scheduler initialization error: $e');
    }
  }

  /// Schedule a fake call with specified delay
  Future<void> scheduleCall({
    required Duration delay,
    required String callerName,
    required String callerNumber,
  }) async {
    if (!_isInitialized) {
      await initialize();
    }

    try {
      // Cancel any existing scheduled call
      await cancelScheduledCall();

      if (delay == Duration.zero) {
        // Immediate call - trigger directly
        debugPrint('[FakeCall] Triggering immediate call');
        final notificationService = FakeCallNotificationService();
        await notificationService.showIncomingCallNotification(
          callerName: callerName,
          callerNumber: callerNumber,
        );
      } else {
        // Scheduled call - use Timer
        debugPrint('[FakeCall] Scheduling call in ${delay.inSeconds} seconds');

        _scheduledTimer = Timer(delay, () async {
          debugPrint('[FakeCall] Timer triggered for scheduled call');
          final notificationService = FakeCallNotificationService();
          await notificationService.showIncomingCallNotification(
            callerName: callerName,
            callerNumber: callerNumber,
          );
        });
      }
    } catch (e) {
      debugPrint('[FakeCall] Schedule error: $e');
    }
  }

  /// Cancel any scheduled fake call
  Future<void> cancelScheduledCall() async {
    try {
      _scheduledTimer?.cancel();
      _scheduledTimer = null;
      debugPrint('[FakeCall] Scheduled call cancelled');
    } catch (e) {
      debugPrint('[FakeCall] Cancel error: $e');
    }
  }

  /// Cancel all scheduled tasks
  Future<void> cancelAll() async {
    await cancelScheduledCall();
  }
}
