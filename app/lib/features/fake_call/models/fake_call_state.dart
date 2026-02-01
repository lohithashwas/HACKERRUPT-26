import 'package:equatable/equatable.dart';

/// Represents the state of a fake call
enum FakeCallStatus { idle, scheduled, ringing, accepted, rejected, ended }

/// Represents the delay before a fake call is triggered
enum FakeCallDelay {
  immediate(duration: Duration.zero, label: 'Immediate'),
  tenSeconds(duration: Duration(seconds: 10), label: '10 seconds'),
  oneMinute(duration: Duration(minutes: 1), label: '1 minute'),
  fiveMinutes(duration: Duration(minutes: 5), label: '5 minutes');

  final Duration duration;
  final String label;

  const FakeCallDelay({required this.duration, required this.label});
}

/// Represents the current state of a fake call session
class FakeCallState extends Equatable {
  final FakeCallStatus status;
  final String? callerName;
  final String? callerNumber;
  final DateTime? scheduledTime;
  final DateTime? startTime;
  final Duration callDuration;

  const FakeCallState({
    this.status = FakeCallStatus.idle,
    this.callerName,
    this.callerNumber,
    this.scheduledTime,
    this.startTime,
    this.callDuration = Duration.zero,
  });

  FakeCallState copyWith({
    FakeCallStatus? status,
    String? callerName,
    String? callerNumber,
    DateTime? scheduledTime,
    DateTime? startTime,
    Duration? callDuration,
  }) {
    return FakeCallState(
      status: status ?? this.status,
      callerName: callerName ?? this.callerName,
      callerNumber: callerNumber ?? this.callerNumber,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      startTime: startTime ?? this.startTime,
      callDuration: callDuration ?? this.callDuration,
    );
  }

  bool get isActive =>
      status == FakeCallStatus.ringing ||
      status == FakeCallStatus.accepted ||
      status == FakeCallStatus.scheduled;

  @override
  List<Object?> get props => [
    status,
    callerName,
    callerNumber,
    scheduledTime,
    startTime,
    callDuration,
  ];
}
