import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import '../../core/style.dart';

class SpyCamScreen extends StatefulWidget {
  const SpyCamScreen({Key? key}) : super(key: key);

  @override
  State<SpyCamScreen> createState() => _SpyCamScreenState();
}

class _SpyCamScreenState extends State<SpyCamScreen> {
  double _magneticField = 0;
  Color _statusColor = Colors.green;
  String _statusText = "Safe";
  StreamSubscription<MagnetometerEvent>? _magnetometerSubscription;

  @override
  void initState() {
    super.initState();
    _magnetometerSubscription = magnetometerEvents.listen((
      MagnetometerEvent event,
    ) {
      double x = event.x;
      double y = event.y;
      double z = event.z;

      double magnitude = sqrt(x * x + y * y + z * z);

      // Check if widget is still mounted before calling setState
      if (mounted) {
        setState(() {
          _magneticField = magnitude;
          if (magnitude > 80) {
            _statusColor = Colors.red;
            _statusText = "DETECTED! Potentially a Spy Cam or Speaker";
          } else if (magnitude > 60) {
            _statusColor = Colors.orange;
            _statusText = "Suspicious Device Nearby";
          } else {
            _statusColor = Colors.green;
            _statusText = "Area Safe";
          }
        });
      }
    });
  }

  @override
  void dispose() {
    // Cancel the stream subscription to prevent memory leaks
    _magnetometerSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Spy Camera Detector')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              height: 250,
              width: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _statusColor.withOpacity(0.2),
                border: Border.all(color: _statusColor, width: 4),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.wifi_tethering, size: 80, color: _statusColor),
                    SizedBox(height: 10),
                    Text(
                      "${_magneticField.toStringAsFixed(1)} µT",
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: _statusColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 40),
            Text(
              _statusText,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: _statusColor,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0),
              child: Text(
                "Move your phone around suspected objects. High magnetic readings may indicate hidden electronics like cameras.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[700]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
