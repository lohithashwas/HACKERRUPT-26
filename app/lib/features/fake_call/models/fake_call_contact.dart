import 'package:equatable/equatable.dart';

/// Represents a fake caller's contact information
class FakeCallContact extends Equatable {
  final String name;
  final String phoneNumber;

  const FakeCallContact({required this.name, required this.phoneNumber});

  @override
  List<Object?> get props => [name, phoneNumber];

  /// Predefined realistic contacts for fake calls
  static const List<FakeCallContact> defaultContacts = [
    FakeCallContact(name: 'Mom', phoneNumber: '+91 98765 43210'),
    FakeCallContact(name: 'Dad', phoneNumber: '+91 98765 43211'),
    FakeCallContact(name: 'Sister', phoneNumber: '+91 98765 43212'),
    FakeCallContact(name: 'Brother', phoneNumber: '+91 98765 43213'),
    FakeCallContact(name: 'Best Friend', phoneNumber: '+91 98765 43214'),
    FakeCallContact(name: 'Office', phoneNumber: '+91 11 2345 6789'),
    FakeCallContact(name: 'Doctor', phoneNumber: '+91 80 4567 8901'),
    FakeCallContact(name: 'Colleague', phoneNumber: '+91 98765 43215'),
    FakeCallContact(name: 'Roommate', phoneNumber: '+91 98765 43216'),
    FakeCallContact(name: 'Aunt', phoneNumber: '+91 98765 43217'),
  ];

  /// Get a random contact from the default list
  static FakeCallContact getRandomContact() {
    final random =
        DateTime.now().millisecondsSinceEpoch % defaultContacts.length;
    return defaultContacts[random];
  }
}
