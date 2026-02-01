import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../fake_call/bloc/fake_call_bloc.dart';
import '../fake_call/services/fake_call_scheduler.dart';
import '../fake_call/services/fake_call_notification_service.dart';
import '../fake_call/screens/fake_call_setup_screen.dart';

/// Fake Call Screen - Redirects to new implementation
/// This maintains backward compatibility with existing navigation
class FakeCallScreen extends StatelessWidget {
  const FakeCallScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Redirect to new BLoC-based implementation
    return BlocProvider(
      create: (_) => FakeCallBloc(
        scheduler: FakeCallScheduler(),
        notificationService: FakeCallNotificationService(),
      ),
      child: const FakeCallSetupScreen(),
    );
  }
}
