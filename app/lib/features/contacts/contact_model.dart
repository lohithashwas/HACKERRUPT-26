class ContactModel {
  final String name;
  final String number;

  ContactModel({required this.name, required this.number});

  Map<String, dynamic> toJson() => {'name': name, 'number': number};

  factory ContactModel.fromJson(Map<String, dynamic> json) {
    return ContactModel(
      name: json['name'],
      number: json['number'],
    );
  }
}
