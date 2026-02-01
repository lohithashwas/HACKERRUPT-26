import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/fake_call_bloc.dart';
import '../bloc/fake_call_event.dart';
import '../models/fake_call_contact.dart';
import '../models/fake_call_state.dart';
import '../services/fake_call_scheduler.dart';
import '../services/fake_call_notification_service.dart';
import '../screens/fake_call_setup_screen.dart';

/// Example widget showing how to integrate Fake Call feature into your dashboard
class FakeCallIntegrationExample extends StatelessWidget {
  const FakeCallIntegrationExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Safety Features')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Example 1: Simple Button
            _buildSimpleButton(context),

            const SizedBox(height: 20),

            // Example 2: Card Style
            _buildCardStyle(context),

            const SizedBox(height: 20),

            // Example 3: Icon Button
            _buildIconButton(context),
          ],
        ),
      ),
    );
  }

  /// Simple elevated button
  Widget _buildSimpleButton(BuildContext context) {
    return ElevatedButton(
      onPressed: () => _navigateToFakeCall(context),
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF4CAF50),
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: const Text(
        'Fake Call',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
    );
  }

  /// Card style with icon and description
  Widget _buildCardStyle(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () => _navigateToFakeCall(context),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: const Color(0xFF4CAF50).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.call,
                  color: Color(0xFF4CAF50),
                  size: 28,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Fake Call',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Create a realistic incoming call',
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16),
            ],
          ),
        ),
      ),
    );
  }

  /// Floating action button style
  Widget _buildIconButton(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: () => _navigateToFakeCall(context),
      backgroundColor: const Color(0xFF4CAF50),
      icon: const Icon(Icons.call),
      label: const Text('Fake Call'),
    );
  }

  /// Navigate to Fake Call screen with BLoC provider
  void _navigateToFakeCall(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BlocProvider(
          create: (_) => FakeCallBloc(
            scheduler: FakeCallScheduler(),
            notificationService: FakeCallNotificationService(),
          ),
          child: const FakeCallSetupScreen(),
        ),
      ),
    );
  }
}

/// Example: Quick trigger button (for emergency situations)
class QuickFakeCallButton extends StatelessWidget {
  const QuickFakeCallButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        // Trigger immediate fake call without setup screen
        final bloc = FakeCallBloc(
          scheduler: FakeCallScheduler(),
          notificationService: FakeCallNotificationService(),
        );

        // Use a random contact
        final contact = FakeCallContact.getRandomContact();

        // Schedule and trigger immediately
        bloc.add(
          ScheduleFakeCall(
            delay: FakeCallDelay.immediate,
            callerName: contact.name,
            callerNumber: contact.phoneNumber,
          ),
        );

        bloc.add(
          TriggerFakeCall(
            callerName: contact.name,
            callerNumber: contact.phoneNumber,
          ),
        );
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.red,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
      child: const Text('EMERGENCY CALL NOW'),
    );
  }
}
