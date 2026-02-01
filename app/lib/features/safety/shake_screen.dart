import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../contacts/contact_model.dart';
import 'shake_service.dart';

class ShakeScreen extends StatefulWidget {
  const ShakeScreen({Key? key}) : super(key: key);

  @override
  State<ShakeScreen> createState() => _ShakeScreenState();
}

class _ShakeScreenState extends State<ShakeScreen> {
  bool isShakeEnabled = false;
  int sensitivity = 5;
  List<ContactModel> emergencyContacts = [];
  ContactModel? selectedContact;

  @override
  void initState() {
    super.initState();
    _loadContacts();
  }

  Future<void> _loadContacts() async {
    final prefs = await SharedPreferences.getInstance();
    final String? contactsJson = prefs.getString('contacts');
    if (contactsJson != null) {
      final List<dynamic> decoded = jsonDecode(contactsJson);
      setState(() {
        emergencyContacts = decoded
            .map((e) => ContactModel.fromJson(e))
            .toList();
        if (emergencyContacts.isNotEmpty) {
          selectedContact = emergencyContacts[0];
        }
      });
    }
  }

  Future<void> _sendWhatsAppSOS() async {
    if (selectedContact == null) {
      _showSnackBar('Please select an emergency contact first!', Colors.red);
      return;
    }

    try {
      // Get current location
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      String message =
          '🚨 EMERGENCY ALERT 🚨\n\n'
          'I need help! This is an automatic SOS alert.\n\n'
          '📍 My Location:\n'
          'https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}\n\n'
          'Please check on me immediately!';

      // Clean phone number (remove spaces, dashes, etc.)
      String phoneNumber = selectedContact!.number.replaceAll(
        RegExp(r'[^\d+]'),
        '',
      );

      // Add country code if not present
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+91$phoneNumber'; // India country code
      }

      final Uri whatsappUrl = Uri.parse(
        'https://wa.me/$phoneNumber?text=${Uri.encodeComponent(message)}',
      );

      if (await canLaunchUrl(whatsappUrl)) {
        await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
        _showSnackBar('SOS sent via WhatsApp!', Colors.green);
      } else {
        _showSnackBar('Could not open WhatsApp', Colors.red);
      }
    } catch (e) {
      _showSnackBar('Error: $e', Colors.red);
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1a1a2e)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Shake Alert',
          style: TextStyle(
            color: Color(0xFF1a1a2e),
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Shake Detection Card
            Container(
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
                children: [
                  SwitchListTile(
                    contentPadding: const EdgeInsets.all(20),
                    title: const Text(
                      'Shake Detection',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 18,
                        color: Color(0xFF1a1a2e),
                      ),
                    ),
                    subtitle: const Text(
                      'Shake device to send SOS via WhatsApp',
                    ),
                    secondary: Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: isShakeEnabled
                            ? const Color(0xFFFF6B6B).withOpacity(0.1)
                            : Colors.grey.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.vibration,
                        color: isShakeEnabled
                            ? const Color(0xFFFF6B6B)
                            : Colors.grey,
                      ),
                    ),
                    value: isShakeEnabled,
                    activeColor: const Color(0xFFFF6B6B),
                    onChanged: emergencyContacts.isEmpty
                        ? null
                        : (val) {
                            setState(() {
                              isShakeEnabled = val;
                            });
                            if (val) {
                              ShakeService().listenToShake(() {
                                _sendWhatsAppSOS();
                              });
                              _showSnackBar(
                                'Shake detection activated!',
                                Colors.green,
                              );
                            } else {
                              _showSnackBar(
                                'Shake detection deactivated',
                                Colors.orange,
                              );
                            }
                          },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Emergency Contact Selection
            Container(
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
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Emergency Contact',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1a1a2e),
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (emergencyContacts.isEmpty)
                    Text(
                      'No emergency contacts saved. Please add contacts first.',
                      style: TextStyle(
                        color: const Color(0xFF1a1a2e).withOpacity(0.6),
                      ),
                    )
                  else
                    DropdownButtonFormField<ContactModel>(
                      value: selectedContact,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFFF5F7FA),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        prefixIcon: const Icon(
                          Icons.person,
                          color: Color(0xFFFF6B6B),
                        ),
                      ),
                      items: emergencyContacts.map((contact) {
                        return DropdownMenuItem(
                          value: contact,
                          child: Text('${contact.name} - ${contact.number}'),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedContact = value;
                        });
                      },
                    ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Sensitivity Slider
            Container(
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
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sensitivity Level: $sensitivity',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1a1a2e),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Higher = More sensitive to shaking',
                    style: TextStyle(
                      fontSize: 14,
                      color: const Color(0xFF1a1a2e).withOpacity(0.6),
                    ),
                  ),
                  Slider(
                    value: sensitivity.toDouble(),
                    min: 1,
                    max: 10,
                    divisions: 9,
                    label: sensitivity.toString(),
                    activeColor: const Color(0xFFFF6B6B),
                    onChanged: (val) {
                      setState(() {
                        sensitivity = val.toInt();
                      });
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Test Button
            SizedBox(
              width: double.infinity,
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFF6B6B), Color(0xFFFF5252)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFF5252).withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: emergencyContacts.isEmpty ? null : _sendWhatsAppSOS,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.send, color: Colors.white),
                          SizedBox(width: 12),
                          Text(
                            'Test SOS Alert',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Info Card
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFFF6B6B).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFFFF6B6B).withOpacity(0.3),
                ),
              ),
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFFFF6B6B)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Shake your phone vigorously to trigger the SOS alert',
                      style: TextStyle(
                        color: const Color(0xFF1a1a2e).withOpacity(0.8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
