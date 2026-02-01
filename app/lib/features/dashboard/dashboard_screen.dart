import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants.dart';
import '../contacts/contact_screen.dart';
import '../safety/shake_screen.dart';
import '../safety/scream_screen.dart';
import '../tools/spy_cam_screen.dart';
import '../tools/fake_call_screen.dart';
import '../content/article_screen.dart';
import '../safety/live_safe_screen.dart';
import '../bot/ai_bot_screen.dart';
import '../safety/sms_relay_screen.dart';
import 'settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String? emergencyWhatsAppNumber;

  @override
  void initState() {
    super.initState();
    _loadEmergencyNumber();
  }

  Future<void> _loadEmergencyNumber() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      emergencyWhatsAppNumber = prefs.getString('emergency_whatsapp');
    });
  }

  Future<void> _sendSOSAlert() async {
    if (emergencyWhatsAppNumber == null || emergencyWhatsAppNumber!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please set emergency WhatsApp number in Settings'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      // Get current location
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      String message =
          '🚨 EMERGENCY SOS ALERT 🚨\n\n'
          'I NEED HELP URGENTLY!\n\n'
          '📍 My Current Location:\n'
          'https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}\n\n'
          'Please respond immediately!';

      String phoneNumber = emergencyWhatsAppNumber!.replaceAll(
        RegExp(r'[^\d+]'),
        '',
      );
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+91$phoneNumber';
      }

      final Uri whatsappUrl = Uri.parse(
        'https://wa.me/$phoneNumber?text=${Uri.encodeComponent(message)}',
      );

      if (await canLaunchUrl(whatsappUrl)) {
        await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('SOS Alert Sent!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Could not open WhatsApp'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          AppConstants.appName,
          style: TextStyle(
            color: Color(0xFF1a1a2e),
            fontWeight: FontWeight.w700,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings, color: Color(0xFF1a1a2e)),
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
              _loadEmergencyNumber(); // Reload after returning from settings
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // SOS Button Section
              _buildSOSButton(context),
              const SizedBox(height: 24),

              // Features Grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                childAspectRatio: 1.3,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildFeatureCard(
                    context,
                    AppConstants.emergencyContacts,
                    Icons.contact_phone,
                    const Color(0xFFFF6B6B),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ContactScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.shake,
                    Icons.vibration,
                    const Color(0xFFFFA726),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ShakeScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.screamAlert,
                    Icons.record_voice_over,
                    const Color(0xFF9C27B0),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ScreamScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.spyCam,
                    Icons.remove_red_eye,
                    const Color(0xFF4ECDC4),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SpyCamScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.fakeCall,
                    Icons.call_end,
                    const Color(0xFF2196F3),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const FakeCallScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.corNirbhaya,
                    Icons.location_on,
                    const Color(0xFF4CAF50),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const LiveSafeScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.articles,
                    Icons.article,
                    const Color(0xFF3F51B5),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ArticleScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    AppConstants.bot,
                    Icons.mic_external_on,
                    const Color(0xFF00BCD4),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AiBotScreen()),
                    ),
                  ),
                  _buildFeatureCard(
                    context,
                    "SMS Relay",
                    Icons.sms_failed,
                    const Color(0xFFF44336),
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SmsRelayScreen()),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSOSButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.heavyImpact();
        _sendSOSAlert();
      },
      child: Container(
        width: 180,
        height: 180,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [Color(0xFFFF6B6B), Color(0xFFFF5252)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFFF5252).withOpacity(0.4),
              blurRadius: 30,
              spreadRadius: 10,
            ),
          ],
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.warning_amber_rounded, size: 50, color: Colors.white),
              SizedBox(height: 8),
              Text(
                'SOS',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
                color: Color(0xFF1a1a2e),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
