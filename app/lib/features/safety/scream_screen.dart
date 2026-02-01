import 'dart:async';
import 'package:flutter/material.dart';
import 'package:noise_meter/noise_meter.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../core/style.dart';

class ScreamScreen extends StatefulWidget {
  const ScreamScreen({Key? key}) : super(key: key);

  @override
  State<ScreamScreen> createState() => _ScreamScreenState();
}

class _ScreamScreenState extends State<ScreamScreen> {
  bool _isListening = false;
  NoiseMeter? _noiseMeter;
  StreamSubscription<NoiseReading>? _noiseSubscription;
  double _db = 0;
  final double _thresholdDb = 85.0; // Loud scream threshold

  @override
  void initState() {
    super.initState();
    _noiseMeter = NoiseMeter();
  }

  @override
  void dispose() {
    _noiseSubscription?.cancel();
    super.dispose();
  }

  void _onError(Object error) {
    print(error);
    _numberOfRetries++;
    if (_numberOfRetries < 3) { // Retry logic
       _start();
    } else {
       setState(() { _isListening = false; });
    }
  }
  
  int _numberOfRetries = 0;

  Future<void> _start() async {
    try {
      if (await Permission.microphone.request().isGranted) {
        // _noiseMeter ??= NoiseMeter(); // Initialize if null - already valid in init
        _noiseSubscription = _noiseMeter!.noise.listen(
          (NoiseReading noiseReading) {
            if (!mounted) return;
             setState(() {
              _db = noiseReading.meanDecibel;
            });
            if (_db > _thresholdDb) {
              // Trigger Alert
              _triggerScreamAlert();
            }
          },
          onError: _onError,
        );
        setState(() => _isListening = true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Microphone permission required")));
      }
    } catch (e) {
      print(e);
    }
  }

  void _stop() async {
    try {
      if (_noiseSubscription != null) {
        _noiseSubscription!.cancel();
        _noiseSubscription = null;
      }
      setState(() => _isListening = false);
    } catch (e) {
      print(e);
    }
  }
  
  void _triggerScreamAlert() {
     // Prevent multiple triggers
     _stop();
     ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("SCREAM DETECTED! SOS TRIGGERED!"), backgroundColor: Colors.red, duration: Duration(seconds: 5)));
     // Navigate to SOS or auto-dial
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Scream Alert')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(30),
               decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isListening ? Colors.red.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                border: Border.all(color: _isListening ? Colors.red : Colors.grey, width: 2),
              ),
              child: Column(
                children: [
                   Icon(
                      _isListening ? Icons.mic : Icons.mic_off, 
                      size: 60, 
                      color: _isListening ? Colors.red : Colors.grey
                   ),
                   SizedBox(height: 10),
                   Text("${_db.toStringAsFixed(1)} dB", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold))
                ],
              ),
            ),
           
            SizedBox(height: 40),
            SwitchListTile(
              title: Text("Scream Detection Mode"),
              subtitle: Text("Listen for loud noises (screams) to trigger SOS"),
              value: _isListening,
              onChanged: (val) {
                if (val) _start(); else _stop();
              },
            ),
             Padding(
               padding: const EdgeInsets.all(16.0),
               child: Text(
                 "Keep the app open or in background (with persistent service enabled) to detect screams.",
                 textAlign: TextAlign.center,
                 style: TextStyle(color: Colors.grey),
               ),
             )
          ],
        ),
      ),
    );
  }
}
