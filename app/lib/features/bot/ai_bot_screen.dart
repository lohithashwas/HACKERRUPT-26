import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../../core/style.dart';

class AiBotScreen extends StatefulWidget {
  const AiBotScreen({Key? key}) : super(key: key);

  @override
  State<AiBotScreen> createState() => _AiBotScreenState();
}

class _AiBotScreenState extends State<AiBotScreen> {
  late stt.SpeechToText _speech;
  bool _isListening = false;
  String _text = 'Press the button and start speaking';
  final List<Map<String, String>> _messages = [];
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
    _addBotMessage("Hello! I am your personal safety assistant. How can I help you today?");
  }

  void _addBotMessage(String text) {
    setState(() {
      _messages.add({'sender': 'bot', 'text': text});
    });
  }

  void _addUserMessage(String text) {
    setState(() {
      _messages.add({'sender': 'user', 'text': text});
    });
    _processCommand(text);
  }

  void _processCommand(String command) {
    String lower = command.toLowerCase();
    if (lower.contains('help') || lower.contains('sos') || lower.contains('emergency')) {
      _addBotMessage("Triggering Emergency Protocol! Sending alerts to your contacts...");
      // Logic to trigger SOS
    } else if (lower.contains('police')) {
      _addBotMessage("Finding nearest police stations...");
      // Logic to open maps
    } else if (lower.contains('hello') || lower.contains('hi')) {
       _addBotMessage("Hi there! Stay safe. You can say 'Help' or 'Police' for assistance.");
    } else {
       _addBotMessage("I didn't quite catch that. Try saying 'Help' or 'Location'.");
    }
  }

  void _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: (val) => print('onStatus: $val'),
        onError: (val) => print('onError: $val'),
      );
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (val) => setState(() {
            _text = val.recognizedWords;
            if (val.hasConfidenceRating && val.confidence > 0) { // live update
               _controller.text = val.recognizedWords;
            }
          }),
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
      if (_controller.text.isNotEmpty) {
        _addUserMessage(_controller.text);
        _controller.clear();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('AI Safety Assistant')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                bool isUser = msg['sender'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: EdgeInsets.symmetric(vertical: 4),
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: isUser ? AppColors.primary : Colors.grey[200],
                      borderRadius: BorderRadius.circular(20).copyWith(
                        bottomRight: isUser ? Radius.zero : Radius.circular(20),
                        bottomLeft: isUser ? Radius.circular(20) : Radius.zero,
                      ),
                    ),
                    child: Text(
                      msg['text']!,
                      style: TextStyle(color: isUser ? Colors.white : Colors.black87),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Type or speak...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),
                      contentPadding: EdgeInsets.symmetric(horizontal: 20),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                FloatingActionButton(
                  onPressed: _listen,
                  backgroundColor: _isListening ? Colors.red : AppColors.primary,
                  child: Icon(_isListening ? Icons.mic : Icons.mic_none),
                  mini: true,
                ),
                SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppColors.secondary,
                   child: IconButton(
                    icon: Icon(Icons.send, color: Colors.white, size: 20),
                    onPressed: () {
                      if (_controller.text.isNotEmpty) {
                        _addUserMessage(_controller.text);
                        _controller.clear();
                      }
                    },
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
