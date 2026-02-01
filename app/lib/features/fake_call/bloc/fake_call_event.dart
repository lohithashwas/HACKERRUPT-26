import 'package:equatable/equatable.dart';
import '../models/fake_call_state.dart';

/// Events for FakeCallBloc
abstract class FakeCallEvent extends Equatable {
  const FakeCallEvent();

  @override
  List<Object?> get props => [];
}

/// Schedule a fake call with specified delay
class ScheduleFakeCall extends FakeCallEvent {
  final FakeCallDelay delay;
  final String callerName;
  final String callerNumber;

  const ScheduleFakeCall({
    required this.delay,
    required this.callerName,
    required this.callerNumber,
  });

  @override
  List<Object?> get props => [delay, callerName, callerNumber];
}

/// Trigger the fake call to start ringing
class TriggerFakeCall extends FakeCallEvent {
  final String callerName;
  final String callerNumber;

  const TriggerFakeCall({required this.callerName, required this.callerNumber});

  @override
  List<Object?> get props => [callerName, callerNumber];
}

/// Accept the incoming fake call
class AcceptFakeCall extends FakeCallEvent {
  const AcceptFakeCall();
}

/// Reject the incoming fake call
class RejectFakeCall extends FakeCallEvent {
  const RejectFakeCall();
}

/// End the ongoing fake call
class EndFakeCall extends FakeCallEvent {
  const EndFakeCall();
}

/// Update call duration (for timer)
class UpdateCallDuration extends FakeCallEvent {
  final Duration duration;

  const UpdateCallDuration(this.duration);

  @override
  List<Object?> get props => [duration];
}

/// Cancel a scheduled fake call
class CancelScheduledCall extends FakeCallEvent {
  const CancelScheduledCall();
}

/// Reset fake call to idle state
class ResetFakeCall extends FakeCallEvent {
  const ResetFakeCall();
}
