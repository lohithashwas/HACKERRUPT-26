import 'package:flutter/material.dart';

class ArticleScreen extends StatelessWidget {
  const ArticleScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1a1a2e)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Safety Articles',
          style: TextStyle(
            color: Color(0xFF1a1a2e),
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: const [
          ArticleCard(
            title: 'Self Defense Techniques',
            subtitle: 'Essential skills every woman should know',
            imageUrl:
                'https://img.freepik.com/free-vector/self-defense-concept-illustration_114360-7798.jpg',
            color: Color(0xFFFF6B6B),
            article: SelfDefenseArticle(),
          ),
          SizedBox(height: 16),
          ArticleCard(
            title: 'Stay Safe at Night',
            subtitle: 'Tips for walking alone after dark',
            imageUrl:
                'https://img.freepik.com/free-vector/woman-walking-night-city-street-flat-vector-illustration_1284-74936.jpg',
            color: Color(0xFF4ECDC4),
            article: NightSafetyArticle(),
          ),
          SizedBox(height: 16),
          ArticleCard(
            title: 'Emergency Numbers',
            subtitle: 'Important contacts to save',
            imageUrl:
                'https://img.freepik.com/free-vector/emergency-call-concept-illustration_114360-7634.jpg',
            color: Color(0xFFFFA726),
            article: EmergencyNumbersArticle(),
          ),
          SizedBox(height: 16),
          ArticleCard(
            title: 'Technology for Safety',
            subtitle: 'Apps and tools to protect yourself',
            imageUrl:
                'https://img.freepik.com/free-vector/mobile-security-concept-illustration_114360-4663.jpg',
            color: Color(0xFF9C27B0),
            article: TechnologySafetyArticle(),
          ),
        ],
      ),
    );
  }
}

class ArticleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String imageUrl;
  final Color color;
  final Widget article;

  const ArticleCard({
    Key? key,
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    required this.color,
    required this.article,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => article));
          },
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Cover Image
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                child: Image.network(
                  imageUrl,
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    height: 150,
                    color: color.withOpacity(0.1),
                    child: Icon(
                      Icons.image,
                      size: 50,
                      color: color.withOpacity(0.5),
                    ),
                  ),
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Container(
                      height: 150,
                      color: color.withOpacity(0.1),
                      child: Center(
                        child: CircularProgressIndicator(
                          value: loadingProgress.expectedTotalBytes != null
                              ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                              : null,
                          color: color,
                        ),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1a1a2e),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 14,
                        color: const Color(0xFF1a1a2e).withOpacity(0.6),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Text(
                          'Read More',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: color,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(Icons.arrow_forward, size: 16, color: color),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Article Detail Template
class ArticleDetailScreen extends StatelessWidget {
  final String title;
  final String imageUrl;
  final Color color;
  final List<ArticleSection> sections;

  const ArticleDetailScreen({
    Key? key,
    required this.title,
    required this.imageUrl,
    required this.color,
    required this.sections,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            backgroundColor: color,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                  shadows: [
                    Shadow(
                      color: Colors.black26,
                      blurRadius: 4,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [color, color.withOpacity(0.7)],
                        ),
                      ),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final section = sections[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (section.number != null)
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: color.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(
                                section.number!,
                                style: TextStyle(
                                  color: color,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ),
                        if (section.number != null) const SizedBox(height: 12),
                        Text(
                          section.title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1a1a2e),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          section.content,
                          style: TextStyle(
                            fontSize: 15,
                            height: 1.6,
                            color: const Color(0xFF1a1a2e).withOpacity(0.8),
                          ),
                        ),
                        if (section.tips != null) ...[
                          const SizedBox(height: 16),
                          ...section.tips!.map(
                            (tip) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    margin: const EdgeInsets.only(top: 6),
                                    width: 6,
                                    height: 6,
                                    decoration: BoxDecoration(
                                      color: color,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      tip,
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: const Color(
                                          0xFF1a1a2e,
                                        ).withOpacity(0.7),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              }, childCount: sections.length),
            ),
          ),
        ],
      ),
    );
  }
}

class ArticleSection {
  final String? number;
  final String title;
  final String content;
  final List<String>? tips;

  ArticleSection({
    this.number,
    required this.title,
    required this.content,
    this.tips,
  });
}

// Article 1: Self Defense
class SelfDefenseArticle extends StatelessWidget {
  const SelfDefenseArticle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ArticleDetailScreen(
      title: 'Self Defense Techniques',
      imageUrl:
          'https://img.freepik.com/free-vector/self-defense-concept-illustration_114360-7798.jpg',
      color: const Color(0xFFFF6B6B),
      sections: [
        ArticleSection(
          title: 'Why Self Defense Matters',
          content:
              'Self-defense is not just about physical techniques—it\'s about awareness, confidence, and preparedness. Every woman should have the knowledge and skills to protect herself in dangerous situations.',
        ),
        ArticleSection(
          number: '1',
          title: 'Stay Alert & Aware',
          content:
              'The best defense is prevention. Always be aware of your surroundings and trust your instincts.',
          tips: [
            'Avoid distractions like phones when walking alone',
            'Make eye contact with people around you',
            'Walk confidently with your head up',
            'Trust your gut feeling if something feels wrong',
          ],
        ),
        ArticleSection(
          number: '2',
          title: 'Vulnerable Points',
          content:
              'If attacked, target these vulnerable areas to create an opportunity to escape:',
          tips: [
            'Eyes: Poke or gouge with fingers',
            'Nose: Strike upward with palm heel',
            'Throat: Punch or chop to disable breathing',
            'Groin: Kick or knee with force',
            'Knees: Kick from the side to break balance',
          ],
        ),
        ArticleSection(
          number: '3',
          title: 'Escape Techniques',
          content:
              'Your goal is always to escape, not to win a fight. Use these techniques to break free:',
          tips: [
            'If grabbed from behind: Stomp on attacker\'s foot, elbow to ribs',
            'If wrist is grabbed: Rotate toward thumb (weakest point)',
            'If choked: Strike throat, eyes, or groin immediately',
            'If on ground: Kick legs and scream loudly',
          ],
        ),
        ArticleSection(
          number: '4',
          title: 'Use Your Voice',
          content:
              'Your voice is a powerful weapon. Yelling attracts attention and can deter attackers.',
          tips: [
            'Shout "FIRE!" or "HELP!" loudly',
            'Use a firm, commanding voice to set boundaries',
            'Make noise to attract attention',
          ],
        ),
        ArticleSection(
          title: 'Remember',
          content:
              'The goal of self-defense is to escape safely, not to fight. Run to a safe place and call for help immediately. Consider taking a self-defense class to practice these techniques properly.',
        ),
      ],
    );
  }
}

// Article 2: Night Safety
class NightSafetyArticle extends StatelessWidget {
  const NightSafetyArticle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ArticleDetailScreen(
      title: 'Stay Safe at Night',
      imageUrl:
          'https://img.freepik.com/free-vector/woman-walking-night-city-street-flat-vector-illustration_1284-74936.jpg',
      color: const Color(0xFF4ECDC4),
      sections: [
        ArticleSection(
          title: 'Walking Alone at Night',
          content:
              'Walking alone after dark requires extra caution and awareness. Follow these essential safety tips to protect yourself.',
        ),
        ArticleSection(
          number: '1',
          title: 'Plan Your Route',
          content: 'Always plan ahead and choose the safest path possible.',
          tips: [
            'Stick to well-lit, populated areas',
            'Avoid shortcuts through dark alleys or isolated areas',
            'Know where police stations and safe places are located',
            'Share your route with a trusted friend or family member',
          ],
        ),
        ArticleSection(
          number: '2',
          title: 'Stay Connected',
          content: 'Keep your phone charged and accessible at all times.',
          tips: [
            'Keep phone battery above 50%',
            'Have emergency contacts on speed dial',
            'Consider sharing live location with trusted contacts',
            'Keep phone in hand, not in bag',
          ],
        ),
        ArticleSection(
          number: '3',
          title: 'Be Aware of Surroundings',
          content: 'Constant awareness is your best defense.',
          tips: [
            'Don\'t wear headphones or earbuds',
            'Walk facing traffic to see approaching vehicles',
            'Check behind you periodically',
            'Notice people around you and their behavior',
          ],
        ),
        ArticleSection(
          number: '4',
          title: 'Look Confident',
          content:
              'Attackers often target people who appear vulnerable or distracted.',
          tips: [
            'Walk with purpose and confidence',
            'Keep your head up and shoulders back',
            'Make brief eye contact with people',
            'Avoid looking lost or confused',
          ],
        ),
        ArticleSection(
          number: '5',
          title: 'Transportation Safety',
          content: 'If using public transport or ride-sharing:',
          tips: [
            'Verify driver details before getting in',
            'Sit behind the driver in taxis',
            'Share trip details with someone',
            'Trust your instincts—cancel if something feels wrong',
          ],
        ),
        ArticleSection(
          title: 'Emergency Preparedness',
          content:
              'Always have a backup plan. Know emergency numbers, carry a whistle or personal alarm, and don\'t hesitate to call for help if you feel unsafe.',
        ),
      ],
    );
  }
}

// Article 3: Emergency Numbers
class EmergencyNumbersArticle extends StatelessWidget {
  const EmergencyNumbersArticle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ArticleDetailScreen(
      title: 'Emergency Numbers',
      imageUrl:
          'https://img.freepik.com/free-vector/emergency-call-concept-illustration_114360-7634.jpg',
      color: const Color(0xFFFFA726),
      sections: [
        ArticleSection(
          title: 'Save These Numbers Now',
          content:
              'In an emergency, every second counts. Having these numbers saved can make all the difference. Add them to your phone immediately.',
        ),
        ArticleSection(
          number: '1',
          title: 'National Emergency Numbers',
          content: 'These numbers work across India:',
          tips: [
            '112 - National Emergency Number (All emergencies)',
            '100 - Police',
            '101 - Fire',
            '102 - Ambulance',
            '108 - Ambulance (Alternative)',
          ],
        ),
        ArticleSection(
          number: '2',
          title: 'Women\'s Helplines',
          content: 'Dedicated helplines for women in distress:',
          tips: [
            '1091 - Women Helpline',
            '181 - Women Helpline (One Stop Centre)',
            '7827-170-170 - Women Helpline (Delhi)',
            '103 - Women & Child Helpline',
          ],
        ),
        ArticleSection(
          number: '3',
          title: 'Cyber Crime & Harassment',
          content: 'For online harassment and cyber crimes:',
          tips: [
            '1930 - Cyber Crime Helpline',
            'Report at: cybercrime.gov.in',
            '155260 - Cyber Crime (Alternative)',
          ],
        ),
        ArticleSection(
          number: '4',
          title: 'Legal Aid & Support',
          content: 'Free legal assistance and counseling:',
          tips: [
            '15100 - National Commission for Women',
            '1800-11-2372 - Legal Services Authority',
            '9152-987-821 - Domestic Violence Helpline',
          ],
        ),
        ArticleSection(
          number: '5',
          title: 'How to Use Emergency Numbers',
          content: 'Tips for making emergency calls:',
          tips: [
            'Stay calm and speak clearly',
            'State your exact location first',
            'Describe the emergency briefly',
            'Don\'t hang up until told to do so',
            'Follow dispatcher\'s instructions',
          ],
        ),
        ArticleSection(
          title: 'Add to Emergency Contacts',
          content:
              'Most smartphones have an "Emergency Contacts" feature that can be accessed from the lock screen. Add these numbers and trusted family/friends to this list for quick access.',
        ),
      ],
    );
  }
}

// Article 4: Technology for Safety
class TechnologySafetyArticle extends StatelessWidget {
  const TechnologySafetyArticle({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ArticleDetailScreen(
      title: 'Technology for Safety',
      imageUrl:
          'https://img.freepik.com/free-vector/mobile-security-concept-illustration_114360-4663.jpg',
      color: const Color(0xFF9C27B0),
      sections: [
        ArticleSection(
          title: 'Use Technology to Stay Safe',
          content:
              'Modern technology offers powerful tools to enhance your safety. Learn how to use your smartphone and apps effectively for protection.',
        ),
        ArticleSection(
          number: '1',
          title: 'Safety Apps',
          content: 'Essential apps every woman should have:',
          tips: [
            'Women Safety App - This app you\'re using!',
            'Himmat Plus - Delhi Police safety app',
            'bSafe - Share location with guardians',
            'Raksha - One-touch SOS alert',
            'My Safetipin - Rate safety of areas',
          ],
        ),
        ArticleSection(
          number: '2',
          title: 'Location Sharing',
          content: 'Share your real-time location with trusted contacts:',
          tips: [
            'Google Maps - Share live location',
            'WhatsApp - Share live location for up to 8 hours',
            'Find My (iPhone) - Share location with family',
            'Trusted Contacts (Google) - Auto-share in emergencies',
          ],
        ),
        ArticleSection(
          number: '3',
          title: 'Emergency Features',
          content: 'Built-in smartphone safety features:',
          tips: [
            'SOS Emergency (iPhone): Press power button 5 times',
            'Emergency SOS (Android): Press power button 3 times',
            'Medical ID: Add emergency info to lock screen',
            'Emergency Contacts: Quick access from lock screen',
          ],
        ),
        ArticleSection(
          number: '4',
          title: 'Smart Wearables',
          content: 'Wearable devices for added safety:',
          tips: [
            'Smartwatches with SOS features',
            'Personal safety alarms',
            'GPS tracking jewelry',
            'Panic button accessories',
          ],
        ),
        ArticleSection(
          number: '5',
          title: 'Online Safety',
          content: 'Protect yourself in the digital world:',
          tips: [
            'Use strong, unique passwords',
            'Enable two-factor authentication',
            'Don\'t share personal info publicly',
            'Be cautious of strangers online',
            'Report harassment immediately',
          ],
        ),
        ArticleSection(
          number: '6',
          title: 'Privacy Settings',
          content: 'Protect your digital footprint:',
          tips: [
            'Review social media privacy settings',
            'Disable location tagging on photos',
            'Limit who can see your posts',
            'Don\'t accept unknown friend requests',
            'Turn off "last seen" on messaging apps',
          ],
        ),
        ArticleSection(
          title: 'Stay Updated',
          content:
              'Technology evolves rapidly. Regularly update your apps, learn about new safety features, and teach others about digital safety. Your smartphone is a powerful safety tool—use it wisely!',
        ),
      ],
    );
  }
}
