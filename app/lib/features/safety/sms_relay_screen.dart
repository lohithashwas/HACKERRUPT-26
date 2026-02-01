import 'package:flutter/material.dart';
import 'package:women_safety_app/features/safety/sms_relay_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:glassmorphism/glassmorphism.dart';

class SmsRelayScreen extends StatefulWidget {
  const SmsRelayScreen({super.key});

  @override
  State<SmsRelayScreen> createState() => _SmsRelayScreenState();
}

class _SmsRelayScreenState extends State<SmsRelayScreen> {
  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _codeController = TextEditingController();
  bool _isListening = false;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _urlController.text = prefs.getString(kTargetUrlKey) ?? 'http://192.168.1.34:5000/sms';
      _codeController.text = prefs.getString(kUniqueCodeKey) ?? 'ALERT';
      _isListening = prefs.getBool(kSmsRelayEnabledKey) ?? false;
      _isLoading = false;
    });
  }

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(kTargetUrlKey, _urlController.text);
    await prefs.setString(kUniqueCodeKey, _codeController.text);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings saved successfully')),
      );
    }
  }

  Future<void> _toggleListening(bool value) async {
    await _saveSettings();
    if (value) {
      bool success = await SmsRelayService().startListening();
      if (!success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to start listener. Check permissions.')),
          );
        }
        return;
      }
    } else {
      await SmsRelayService().stopListening();
    }
    setState(() {
      _isListening = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text("Secure SMS Relay", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFFD8090), Color(0xFFC84557)],
          ),
        ),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: Colors.white))
            : Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const SizedBox(height: 100),
                    GlassmorphicContainer(
                      width: double.infinity,
                      height: 350,
                      borderRadius: 20,
                      blur: 20,
                      alignment: Alignment.center,
                      border: 2,
                      linearGradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            const Color(0xFFffffff).withOpacity(0.1),
                            const Color(0xFFFFFFFF).withOpacity(0.05),
                          ],
                          stops: const [0.1, 1],
                      ),
                      borderGradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          const Color(0xFFffffff).withOpacity(0.5),
                          const Color((0xFFFFFFFF)).withOpacity(0.5),
                        ],
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Relay Configuration",
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 20),
                            TextField(
                              controller: _urlController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: "Target URL (Internal Server)",
                                labelStyle: TextStyle(color: Colors.white70),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.white30),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.white),
                                ),
                                prefixIcon: Icon(Icons.link, color: Colors.white70),
                              ),
                            ),
                            const SizedBox(height: 15),
                            TextField(
                              controller: _codeController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: "Secret Code (Filter)",
                                labelStyle: TextStyle(color: Colors.white70),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.white30),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.white),
                                ),
                                prefixIcon: Icon(Icons.password, color: Colors.white70),
                              ),
                            ),
                            const SizedBox(height: 30),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  "Enable Relay",
                                  style: TextStyle(fontSize: 18, color: Colors.white),
                                ),
                                Switch(
                                  value: _isListening,
                                  onChanged: _toggleListening,
                                  activeColor: Colors.white,
                                  activeTrackColor: Colors.greenAccent,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      "Note: This feature forwards incoming SMS containing your Secret Code to the Target URL. \n\nUseful for remotely retrieving OTPs or coordinates.",
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
