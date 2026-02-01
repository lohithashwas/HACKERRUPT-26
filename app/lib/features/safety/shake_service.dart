import 'dart:math';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:flutter/foundation.dart';

class ShakeService {
  static final ShakeService _instance = ShakeService._internal();
  factory ShakeService() => _instance;
  ShakeService._internal();

  UserAccelerometerEvent? _lastEvent;
  DateTime? _lastShakeTime;
  final double _shakeThresholdGravity = 2.7;
  final int _minTimeBetweenShakes = 1000; // ms

  void listenToShake(Function onShake) {
    userAccelerometerEvents.listen((UserAccelerometerEvent event) {
      double gX = event.x / 9.8;
      double gY = event.y / 9.8;
      double gZ = event.z / 9.8;

      double gForce = sqrt(gX * gX + gY * gY + gZ * gZ);

      if (gForce > _shakeThresholdGravity) {
        DateTime now = DateTime.now();
        if (_lastShakeTime == null || 
            now.difference(_lastShakeTime!).inMilliseconds > _minTimeBetweenShakes) {
          _lastShakeTime = now;
          onShake();
        }
      }
    });
  }
}
