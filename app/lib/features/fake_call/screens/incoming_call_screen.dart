import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../bloc/fake_call_bloc.dart';
import '../bloc/fake_call_event.dart';
import '../models/fake_call_state.dart';

/// Incoming call screen that mimics Google Dialer UI
class IncomingCallScreen extends StatefulWidget {
  final String callerName;
  final String callerNumber;

  const IncomingCallScreen({
    Key? key,
    required this.callerName,
    required this.callerNumber,
  }) : super(key: key);

  @override
  State<IncomingCallScreen> createState() => _IncomingCallScreenState();
}

class _IncomingCallScreenState extends State<IncomingCallScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();

    // Keep screen awake
    WakelockPlus.enable();

    // Setup pulse animation for avatar
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    WakelockPlus.disable();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E1E1E),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 60),

            // Caller info section
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  // Animated avatar
                  ScaleTransition(
                    scale: _pulseAnimation,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.grey[700],
                        border: Border.all(
                          color: Colors.white.withOpacity(0.3),
                          width: 3,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          widget.callerName[0].toUpperCase(),
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.w300,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Caller name
                  Text(
                    widget.callerName,
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w400,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Caller number
                  Text(
                    widget.callerNumber,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                      color: Colors.grey[400],
                      letterSpacing: 0.3,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // "Incoming call" text
                  Text(
                    'Incoming call',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
            ),

            // Action buttons section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 48),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Reject button
                  _buildActionButton(
                    icon: Icons.call_end,
                    label: 'Decline',
                    color: const Color(0xFFE53935),
                    onTap: () {
                      context.read<FakeCallBloc>().add(const RejectFakeCall());
                      Navigator.of(context).pop();
                    },
                  ),

                  // Accept button
                  _buildActionButton(
                    icon: Icons.call,
                    label: 'Accept',
                    color: const Color(0xFF4CAF50),
                    onTap: () {
                      context.read<FakeCallBloc>().add(const AcceptFakeCall());
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(
                          builder: (_) => BlocProvider.value(
                            value: context.read<FakeCallBloc>(),
                            child: OngoingCallScreen(
                              callerName: widget.callerName,
                              callerNumber: widget.callerNumber,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: color,
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.4),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 32),
          ),
          const SizedBox(height: 12),
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

/// Ongoing call screen after accepting
class OngoingCallScreen extends StatelessWidget {
  final String callerName;
  final String callerNumber;

  const OngoingCallScreen({
    Key? key,
    required this.callerName,
    required this.callerNumber,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E1E1E),
      body: SafeArea(
        child: BlocBuilder<FakeCallBloc, FakeCallState>(
          builder: (context, state) {
            return Column(
              children: [
                const SizedBox(height: 60),

                // Caller info
                Column(
                  children: [
                    // Avatar
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.grey[700],
                      ),
                      child: Center(
                        child: Text(
                          callerName[0].toUpperCase(),
                          style: const TextStyle(
                            fontSize: 42,
                            fontWeight: FontWeight.w300,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Caller name
                    Text(
                      callerName,
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w400,
                        color: Colors.white,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Call duration
                    Text(
                      _formatDuration(state.callDuration),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.grey[400],
                      ),
                    ),
                  ],
                ),

                const Spacer(),

                // Control buttons
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildControlButton(
                            icon: Icons.mic_off,
                            label: 'Mute',
                            onTap: () {},
                          ),
                          _buildControlButton(
                            icon: Icons.volume_up,
                            label: 'Speaker',
                            onTap: () {},
                          ),
                          _buildControlButton(
                            icon: Icons.dialpad,
                            label: 'Keypad',
                            onTap: () {},
                          ),
                        ],
                      ),

                      const SizedBox(height: 48),

                      // End call button
                      GestureDetector(
                        onTap: () {
                          context.read<FakeCallBloc>().add(const EndFakeCall());
                          Navigator.of(context).pop();
                        },
                        child: Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(0xFFE53935),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFE53935).withOpacity(0.4),
                                blurRadius: 16,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.call_end,
                            color: Colors.white,
                            size: 32,
                          ),
                        ),
                      ),

                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[800],
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Colors.grey[400],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes.toString().padLeft(2, '0');
    final seconds = (duration.inSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }
}
