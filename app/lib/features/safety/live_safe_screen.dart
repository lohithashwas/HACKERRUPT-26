import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../contacts/contact_model.dart';

class LiveSafeScreen extends StatefulWidget {
  const LiveSafeScreen({Key? key}) : super(key: key);

  @override
  State<LiveSafeScreen> createState() => _LiveSafeScreenState();
}

class _LiveSafeScreenState extends State<LiveSafeScreen> {
  Position? _currentPosition;
  bool _isLoading = false;
  bool _isLiveSharing = false;
  Timer? _locationTimer;
  List<ContactModel> emergencyContacts = [];
  ContactModel? selectedContact;
  int _shareCount = 0;

  @override
  void initState() {
    super.initState();
    _loadContacts();
    _getCurrentLocation();
  }

  @override
  void dispose() {
    _locationTimer?.cancel();
    super.dispose();
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

  Future<void> _getCurrentLocation() async {
    setState(() => _isLoading = true);

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _showSnackBar('Location services are disabled', Colors.red);
        setState(() => _isLoading = false);
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _showSnackBar('Location permissions denied', Colors.red);
          setState(() => _isLoading = false);
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _showSnackBar('Location permissions permanently denied', Colors.red);
        setState(() => _isLoading = false);
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _currentPosition = position;
        _isLoading = false;
      });
    } catch (e) {
      _showSnackBar('Error getting location: $e', Colors.red);
      setState(() => _isLoading = false);
    }
  }

  Future<void> _shareLocationOnce() async {
    if (selectedContact == null) {
      _showSnackBar('Please select an emergency contact!', Colors.red);
      return;
    }

    if (_currentPosition == null) {
      await _getCurrentLocation();
      if (_currentPosition == null) return;
    }

    try {
      String message =
          '📍 Live Location Update\n\n'
          'I\'m sharing my location with you:\n'
          'https://www.google.com/maps/search/?api=1&query=${_currentPosition!.latitude},${_currentPosition!.longitude}\n\n'
          'Latitude: ${_currentPosition!.latitude.toStringAsFixed(6)}\n'
          'Longitude: ${_currentPosition!.longitude.toStringAsFixed(6)}';

      String phoneNumber = selectedContact!.number.replaceAll(
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
        _showSnackBar('Location shared via WhatsApp!', Colors.green);
      } else {
        _showSnackBar('Could not open WhatsApp', Colors.red);
      }
    } catch (e) {
      _showSnackBar('Error: $e', Colors.red);
    }
  }

  void _toggleLiveSharing(bool value) {
    if (selectedContact == null) {
      _showSnackBar('Please select an emergency contact!', Colors.red);
      return;
    }

    setState(() {
      _isLiveSharing = value;
      _shareCount = 0;
    });

    if (value) {
      // Start periodic sharing every 15 seconds (for testing)
      _shareLocationPeriodically();
      _locationTimer = Timer.periodic(const Duration(seconds: 15), (timer) {
        _shareLocationPeriodically();
      });
      _showSnackBar('Live sharing started! Updates every 15s', Colors.green);
    } else {
      _locationTimer?.cancel();
      _showSnackBar('Live sharing stopped', Colors.orange);
    }
  }

  Future<void> _shareLocationPeriodically() async {
    await _getCurrentLocation();
    if (_currentPosition == null) return;

    setState(() {
      _shareCount++;
    });

    try {
      String message =
          '🔴 LIVE LOCATION UPDATE #$_shareCount\n\n'
          'I\'m sharing my live location:\n'
          'https://www.google.com/maps/search/?api=1&query=${_currentPosition!.latitude},${_currentPosition!.longitude}\n\n'
          'Time: ${DateTime.now().toString().substring(11, 19)}\n'
          'Updates every 15 seconds';

      String phoneNumber = selectedContact!.number.replaceAll(
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
      }
    } catch (e) {
      debugPrint('Error sharing location: $e');
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
          'LiveSafe',
          style: TextStyle(
            color: Color(0xFF1a1a2e),
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Location Display Card
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4ECDC4), Color(0xFF44A08D)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4ECDC4).withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.location_on,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Current Location',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (_isLoading)
                    const CircularProgressIndicator(color: Colors.white)
                  else if (_currentPosition != null)
                    Column(
                      children: [
                        Text(
                          'Lat: ${_currentPosition!.latitude.toStringAsFixed(6)}',
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          'Long: ${_currentPosition!.longitude.toStringAsFixed(6)}',
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    )
                  else
                    const Text(
                      'Location not available',
                      style: TextStyle(color: Colors.white),
                    ),
                  if (_isLiveSharing) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'LIVE • Updates sent: $_shareCount',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
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
                      'No emergency contacts saved',
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
                          color: Color(0xFF4ECDC4),
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

            // Live Sharing Toggle
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
              child: SwitchListTile(
                contentPadding: const EdgeInsets.all(20),
                title: const Text(
                  'Live Location Sharing',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                    color: Color(0xFF1a1a2e),
                  ),
                ),
                subtitle: const Text(
                  'Share location every 15 seconds via WhatsApp',
                ),
                secondary: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _isLiveSharing
                        ? const Color(0xFF4ECDC4).withOpacity(0.1)
                        : Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.share_location,
                    color: _isLiveSharing
                        ? const Color(0xFF4ECDC4)
                        : Colors.grey,
                  ),
                ),
                value: _isLiveSharing,
                activeColor: const Color(0xFF4ECDC4),
                onChanged: emergencyContacts.isEmpty
                    ? null
                    : _toggleLiveSharing,
              ),
            ),
            const SizedBox(height: 20),

            // Share Once Button
            SizedBox(
              width: double.infinity,
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF4ECDC4), Color(0xFF44A08D)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4ECDC4).withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: emergencyContacts.isEmpty
                        ? null
                        : _shareLocationOnce,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.send, color: Colors.white),
                          SizedBox(width: 12),
                          Text(
                            'Share Location Once',
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
                color: const Color(0xFF4ECDC4).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFF4ECDC4).withOpacity(0.3),
                ),
              ),
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFF4ECDC4)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Location will be shared via WhatsApp to selected contact',
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
