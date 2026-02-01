import 'package:flutter/material.dart';
import 'core/style.dart';
import 'features/dashboard/dashboard_screen.dart';
import 'features/fake_call/services/fake_call_initializer.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize fake call services
  await FakeCallInitializer().initialize();

  runApp(const WomenSafetyApp());
}

class WomenSafetyApp extends StatelessWidget {
  const WomenSafetyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Women Safety App',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const DashboardScreen(),
    );
  }
}
