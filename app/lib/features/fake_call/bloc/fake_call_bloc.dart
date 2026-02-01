import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/fake_call_state.dart';
import '../services/fake_call_scheduler.dart';
import '../services/fake_call_notification_service.dart';
import 'fake_call_event.dart';

/// BLoC for managing fake call state and logic
class FakeCallBloc extends Bloc<FakeCallEvent, FakeCallState> {
  final FakeCallScheduler _scheduler;
  final FakeCallNotificationService _notificationService;
  Timer? _callTimer;

  FakeCallBloc({
    required FakeCallScheduler scheduler,
    required FakeCallNotificationService notificationService,
  }) : _scheduler = scheduler,
       _notificationService = notificationService,
       super(const FakeCallState()) {
    on<ScheduleFakeCall>(_onScheduleFakeCall);
    on<TriggerFakeCall>(_onTriggerFakeCall);
    on<AcceptFakeCall>(_onAcceptFakeCall);
    on<RejectFakeCall>(_onRejectFakeCall);
    on<EndFakeCall>(_onEndFakeCall);
    on<UpdateCallDuration>(_onUpdateCallDuration);
    on<CancelScheduledCall>(_onCancelScheduledCall);
    on<ResetFakeCall>(_onResetFakeCall);
  }

  Future<void> _onScheduleFakeCall(
    ScheduleFakeCall event,
    Emitter<FakeCallState> emit,
  ) async {
    final scheduledTime = DateTime.now().add(event.delay.duration);

    emit(
      state.copyWith(
        status: FakeCallStatus.scheduled,
        callerName: event.callerName,
        callerNumber: event.callerNumber,
        scheduledTime: scheduledTime,
      ),
    );

    // Schedule the call
    await _scheduler.scheduleCall(
      delay: event.delay.duration,
      callerName: event.callerName,
      callerNumber: event.callerNumber,
    );
  }

  Future<void> _onTriggerFakeCall(
    TriggerFakeCall event,
    Emitter<FakeCallState> emit,
  ) async {
    emit(
      state.copyWith(
        status: FakeCallStatus.ringing,
        callerName: event.callerName,
        callerNumber: event.callerNumber,
        startTime: DateTime.now(),
      ),
    );

    // Show notification and start ringing
    await _notificationService.showIncomingCallNotification(
      callerName: event.callerName,
      callerNumber: event.callerNumber,
    );
  }

  Future<void> _onAcceptFakeCall(
    AcceptFakeCall event,
    Emitter<FakeCallState> emit,
  ) async {
    emit(
      state.copyWith(
        status: FakeCallStatus.accepted,
        startTime: DateTime.now(),
        callDuration: Duration.zero,
      ),
    );

    // Stop ringing
    await _notificationService.stopRinging();

    // Start call timer
    _startCallTimer();
  }

  Future<void> _onRejectFakeCall(
    RejectFakeCall event,
    Emitter<FakeCallState> emit,
  ) async {
    await _notificationService.stopRinging();
    await _notificationService.cancelNotification();

    emit(state.copyWith(status: FakeCallStatus.rejected));

    // Auto-reset after a short delay
    await Future.delayed(const Duration(milliseconds: 500));
    add(const ResetFakeCall());
  }

  Future<void> _onEndFakeCall(
    EndFakeCall event,
    Emitter<FakeCallState> emit,
  ) async {
    _callTimer?.cancel();
    await _notificationService.stopRinging();
    await _notificationService.cancelNotification();

    emit(state.copyWith(status: FakeCallStatus.ended));

    // Auto-reset after a short delay
    await Future.delayed(const Duration(milliseconds: 500));
    add(const ResetFakeCall());
  }

  void _onUpdateCallDuration(
    UpdateCallDuration event,
    Emitter<FakeCallState> emit,
  ) {
    emit(state.copyWith(callDuration: event.duration));
  }

  Future<void> _onCancelScheduledCall(
    CancelScheduledCall event,
    Emitter<FakeCallState> emit,
  ) async {
    await _scheduler.cancelScheduledCall();
    emit(const FakeCallState(status: FakeCallStatus.idle));
  }

  void _onResetFakeCall(ResetFakeCall event, Emitter<FakeCallState> emit) {
    _callTimer?.cancel();
    emit(const FakeCallState(status: FakeCallStatus.idle));
  }

  void _startCallTimer() {
    _callTimer?.cancel();
    _callTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      add(UpdateCallDuration(Duration(seconds: timer.tick)));
    });
  }

  @override
  Future<void> close() {
    _callTimer?.cancel();
    return super.close();
  }
}
