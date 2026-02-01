import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type Language = 'en' | 'hi' | 'ta'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
    en: {
        // Header
        'header.title': 'Women Safety Dashboard',
        'header.subtitle': 'Privacy-first, hands-free protection built for real-world emergencies.',
        'header.search': 'Search by User ID or phone...',
        'header.logout': 'Logout',
        'header.adminUser': 'Admin User',
        'header.authorized': 'Authorized',

        // Sidebar - User
        'sidebar.dashboard': 'Dashboard',
        'sidebar.vitals': 'Health Vitals',
        'sidebar.safetyZones': 'Safety Zones',
        'sidebar.sosBeacon': 'SOS Beacon',
        'sidebar.guardianVoice': 'GuardianVoice',
        'sidebar.predictions': 'Predictions',
        'sidebar.efir': 'E-FIR',
        'sidebar.fileEFIR': 'File E-FIR',
        'sidebar.settings': 'Settings',

        // Sidebar - Police
        'sidebar.emergencyAlerts': 'Emergency Alerts',
        'sidebar.analytics': 'Analytics',
        'sidebar.surveillanceHub': 'Surveillance Hub',
        'sidebar.auditLogs': 'Audit Logs',
        'sidebar.firRegistry': 'FIR Registry',
        'sidebar.safetyZonesAdmin': 'Safety Zones (Admin)',
        'sidebar.systemSettings': 'System Settings',
        'sidebar.policeCommand': 'POLICE COMMAND',
        'sidebar.protectR': 'Protect-R',
        'sidebar.officialTerminal': 'Official Terminal',
        'sidebar.womenSafetyPlatform': 'Women Safety Platform',

        // Alerts Page
        'alerts.title': 'Emergency Alerts',
        'alerts.subtitle': 'Monitor and respond to user emergencies',
        'alerts.active': 'Active',
        'alerts.resolved': 'Resolved',
        'alerts.critical': 'Critical',
        'alerts.warning': 'Warning',
        'alerts.all': 'All',
        'alerts.note': 'Note',
        'alerts.noteText': 'For User/Family only 1 user details to be shown. For other login modules All users details can be shown.',
        'alerts.userDetails': 'User Details & Active Alerts',
        'alerts.userId': 'User ID',
        'alerts.nationality': 'Nationality',
        'alerts.location': 'Current Location',
        'alerts.contact': 'Contact',
        'alerts.incident': 'INCIDENT',
        'alerts.respond': 'Respond',
        'alerts.validate': 'Validate',
        'alerts.markResolved': 'Mark as Resolved',
        'alerts.responding': 'RESPONDING',

        // Alert Types
        'alerts.medicalEmergency': 'Medical Emergency',
        'alerts.safetyThreat': 'Safety Threat',
        'alerts.accident': 'Accident',
        'alerts.suspiciousActivity': 'Suspicious Activity',
        'alerts.harassment': 'Harassment',

        // Risk Assessment
        'risk.title': 'Risk Assessment Overview',
        'risk.highRisk': 'High Risk Areas',
        'risk.mediumRisk': 'Medium Risk Areas',
        'risk.safeAreas': 'Safe Areas',
        'risk.activeUsers': 'Active Users',
        'risk.weatherRisk': 'Weather risk',
        'risk.treeFalling': 'Prone to trees falling',
        'risk.friendlyLocations': 'Friendly locations',
        'risk.liveUsers': 'Live users currently monitor',

        // Regional Risk
        'regional.title': 'Regional Risk Analysis',
        'regional.highRisk': 'High Risk',
        'regional.medium': 'Medium',

        // Response Stats
        'stats.title': 'Emergency Response Statistics',
        'stats.avgResponse': 'Avg Response Time',
        'stats.activeTeams': 'Active Teams',
        'stats.successRate': 'Success Rate',

        // Respond Modal
        'modal.dispatchResponse': 'Dispatch Response',
        'modal.sendResponse': 'Send emergency response to',
        'modal.selectUnit': 'Select Response Unit',
        'modal.estimatedTime': 'Estimated Arrival Time (minutes)',
        'modal.responseNotes': 'Response Notes (Optional)',
        'modal.notesPlaceholder': 'Add any additional instructions or notes for the response team...',
        'modal.dispatchUnit': 'Dispatch Unit',
        'modal.cancel': 'Cancel',

        // Response Units
        'units.patrol1': 'Patrol Unit 1 - T. Nagar Station',
        'units.patrol2': 'Patrol Unit 2 - Velachery Station',
        'units.ambulance1': 'Ambulance Unit 1 - Apollo Hospital',
        'units.ambulance2': 'Ambulance Unit 2 - SIMS Hospital',
        'units.fire1': 'Fire & Rescue Unit - Anna Nagar',

        // Validate Modal
        'validate.title': 'Validate Alert',
        'validate.subtitle': 'Verify alert authenticity',
        'validate.question': 'Is this alert legitimate and requires action?',
        'validate.confirmValid': 'Confirm Valid',
        'validate.falseAlarm': 'False Alarm',

        // Settings Page
        'settings.title': 'System Settings',
        'settings.subtitle': 'Configure system preferences and security',
        'settings.systemOverview': 'System Overview',
        'settings.version': 'Version',
        'settings.uptime': 'System Uptime',
        'settings.activeUsers': 'Active Users',
        'settings.totalAlerts': 'Total Alerts',
        'settings.storageUsed': 'Storage Used',

        // Service Status
        'service.title': 'Service Status',
        'service.database': 'Database',
        'service.apiServer': 'API Server',
        'service.authentication': 'Authentication',
        'service.mapServices': 'Map Services',
        'service.smsGateway': 'SMS Gateway',
        'service.emailService': 'Email Service',
        'service.active': 'Active',
        'service.checking': 'Checking...',
        'service.offline': 'Offline',

        // Security & Privacy
        'security.title': 'Security & Privacy',
        'security.authentication': 'Authentication',
        'security.twoFactor': 'Two-Factor Authentication',
        'security.sessionTimeout': 'Session Timeout',
        'security.changePassword': 'Change Password',
        'security.privacyControls': 'Privacy Controls',
        'security.locationTracking': 'Location Tracking',
        'security.autoBackups': 'Automatic Backups',
        'security.dataRetention': 'Data Retention',

        // Notifications
        'notifications.title': 'Notifications & Alerts',
        'notifications.channels': 'Notification Channels',
        'notifications.soundAlerts': 'Sound Alerts',
        'notifications.desktopNotifications': 'Desktop Notifications',
        'notifications.emailAlerts': 'Email Alerts',
        'notifications.smsAlerts': 'SMS Alerts',
        'notifications.priority': 'Alert Priority Levels',
        'notifications.criticalPriority': 'Critical',
        'notifications.highPriority': 'High',
        'notifications.normalPriority': 'Normal',
        'notifications.allChannels': 'All channels enabled',
        'notifications.pushSound': 'Push + Sound only',
        'notifications.silentNotif': 'Silent notifications',

        // Appearance
        'appearance.title': 'Appearance & Display',
        'appearance.theme': 'Theme',
        'appearance.darkMode': 'Dark Mode',
        'appearance.lightMode': 'Light Mode',
        'appearance.accentColor': 'Accent Color',
        'appearance.language': 'Language',
        'appearance.dateFormat': 'Date Format',

        // Advanced Config
        'advanced.title': 'Advanced Configuration',
        'advanced.systemEndpoints': 'System Endpoints',
        'advanced.backendApi': 'Backend API Endpoint',
        'advanced.websocket': 'WebSocket Server',
        'advanced.database': 'Database Connection',
        'advanced.dataRefresh': 'Data Refresh Interval',
        'advanced.realtime': 'Real-time (WebSocket)',
        'advanced.dataManagement': 'Data Management',
        'advanced.exportData': 'Export Data',
        'advanced.importData': 'Import Data',
        'advanced.clearCache': 'Clear Cache',
        'advanced.resetSettings': 'Reset All Settings',

        // Common
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.confirm': 'Confirm',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.close': 'Close',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.indian': 'Indian',

        // Login Page
        'login.selectLanguage': 'Select Language',
        'login.secureAccess': 'Secure Access V2.4',
        'login.tagline': 'The centralized command center for the',
        'login.taglineStrong': 'Proactive Safety Wearable',
        'login.taglineEnd': 'ecosystem. Rapid response, redefined.',
        'login.activeOfficers': 'Active Officers',
        'login.realTimeCoverage': 'Real-time Coverage',
        'login.identity': 'Identity',
        'login.keyPhrase': 'Key Phrase',
        'login.rememberMe': 'Remember me',
        'login.lostAccess': 'Lost access?',
        'login.authenticateAccess': 'Authenticate Access',
        'login.invalidCredentials': 'Invalid credentials. Please try again.',

        // Login Roles
        'login.role.user': 'Citizen Portal',
        'login.role.userDesc': 'Secure access for public safety services',
        'login.role.userPlaceholder': 'Aadhaar / Mobile Number',
        'login.role.police': 'Police Department',
        'login.role.policeDesc': 'Law enforcement authorized access only',
        'login.role.policePlaceholder': 'Badge ID / Official Email',
        'login.role.admin': 'System Admin',
        'login.role.adminDesc': 'System configuration and oversight',
        'login.role.adminPlaceholder': 'Admin ID',
        'login.role.emergency': 'Emergency Response',
        'login.role.emergencyDesc': 'Rapid response coordination unit',
        'login.role.emergencyPlaceholder': 'Service ID',
        'login.role.volunteer': 'P-R Volunteer',
        'login.role.volunteerDesc': 'Community support network access',
        'login.role.volunteerPlaceholder': 'Volunteer ID',

        // Dashboard
        'dashboard.emergencyServicesFilter': 'Emergency Services Filter',
        'dashboard.liveData': 'Live Data',
        'dashboard.show': 'Show:',
        'dashboard.allServices': '🏥 All Services',
        'dashboard.policeStations': '🚔 Police Stations',
        'dashboard.hospitals': '🏥 Hospitals',
        'dashboard.police': 'Police',
        'dashboard.hospitalsLabel': 'Hospitals',
        'dashboard.policeHospitalsTitle': 'Police Stations & Hospitals',
        'dashboard.realTimeEmergency': 'Real-time emergency services coverage',
        'dashboard.refreshMap': 'Refresh Map',
        'dashboard.activeUsers': 'Active Users',
        'dashboard.safetyScore': 'Safety Score',
        'dashboard.avgResponse': 'Avg Response',
        'dashboard.criticalAlert': 'CRITICAL ALERT',
        'dashboard.activeEmergencies': 'Active Emergencies',
        'dashboard.requireImmediatePlanning': 'Requiring immediate planning & police area',
        'dashboard.viewDetails': 'VIEW DETAILS',

        // Logout
        'logout.confirm': 'Are you sure you want to logout?',
    },

    hi: {
        // Header
        'header.title': 'महिला सुरक्षा डैशबोर्ड',
        'header.subtitle': 'गोपनीयता-प्रथम, हैंड्स-फ्री सुरक्षा वास्तविक आपात स्थितियों के लिए बनाई गई।',
        'header.search': 'यूजर आईडी या फोन से खोजें...',
        'header.logout': 'लॉगआउट',
        'header.adminUser': 'एडमिन यूजर',
        'header.authorized': 'अधिकृत',

        // Sidebar - User
        'sidebar.dashboard': 'डैशबोर्ड',
        'sidebar.vitals': 'स्वास्थ्य संकेतक',
        'sidebar.safetyZones': 'सुरक्षा क्षेत्र',
        'sidebar.sosBeacon': 'एसओएस बीकन',
        'sidebar.guardianVoice': 'गार्डियनवॉय्स',
        'sidebar.predictions': 'पूर्वानुमान',
        'sidebar.efir': 'ई-एफआईआर',
        'sidebar.fileEFIR': 'E-FIR दर्ज करें',
        'sidebar.settings': 'सेटिंग्स',

        // Sidebar - Police
        'sidebar.emergencyAlerts': 'आपातकालीन अलर्ट',
        'sidebar.analytics': 'विश्लेषण',
        'sidebar.surveillanceHub': 'निगरानी केंद्र',
        'sidebar.auditLogs': 'ऑडिट लॉग',
        'sidebar.firRegistry': 'एफआईआर रजिस्ट्री',
        'sidebar.safetyZonesAdmin': 'सुरक्षा क्षेत्र (एडमिन)',
        'sidebar.systemSettings': 'सिस्टम सेटिंग्स',
        'sidebar.policeCommand': 'पुलिस कमांड',
        'sidebar.protectR': 'Protect-R',
        'sidebar.officialTerminal': 'आधिकारिक टर्मिनल',
        'sidebar.womenSafetyPlatform': 'महिला सुरक्षा मंच',

        // Alerts Page
        'alerts.title': 'आपातकालीन अलर्ट',
        'alerts.subtitle': 'उपयोगकर्ता आपात स्थितियों की निगरानी और प्रतिक्रिया करें',
        'alerts.active': 'सक्रिय',
        'alerts.resolved': 'हल किया गया',
        'alerts.critical': 'गंभीर',
        'alerts.warning': 'चेतावनी',
        'alerts.all': 'सभी',
        'alerts.note': 'नोट',
        'alerts.noteText': 'उपयोगकर्ता/परिवार के लिए केवल 1 उपयोगकर्ता विवरण दिखाया जाना चाहिए। अन्य लॉगिन मॉड्यूल के लिए सभी उपयोगकर्ता विवरण दिखाए जा सकते हैं।',
        'alerts.userDetails': 'उपयोगकर्ता विवरण और सक्रिय अलर्ट',
        'alerts.userId': 'यूजर आईडी',
        'alerts.nationality': 'राष्ट्रीयता',
        'alerts.location': 'वर्तमान स्थान',
        'alerts.contact': 'संपर्क',
        'alerts.incident': 'घटना',
        'alerts.respond': 'प्रतिक्रिया दें',
        'alerts.validate': 'सत्यापित करें',
        'alerts.markResolved': 'हल के रूप में चिह्नित करें',
        'alerts.responding': 'प्रतिक्रिया दे रहे हैं',

        // Alert Types
        'alerts.medicalEmergency': 'चिकित्सा आपातकाल',
        'alerts.safetyThreat': 'सुरक्षा खतरा',
        'alerts.accident': 'दुर्घटना',
        'alerts.suspiciousActivity': 'संदिग्ध गतिविधि',
        'alerts.harassment': 'उत्पीड़न',

        // Risk Assessment
        'risk.title': 'जोखिम मूल्यांकन अवलोकन',
        'risk.highRisk': 'उच्च जोखिम क्षेत्र',
        'risk.mediumRisk': 'मध्यम जोखिम क्षेत्र',
        'risk.safeAreas': 'सुरक्षित क्षेत्र',
        'risk.activeUsers': 'सक्रिय उपयोगकर्ता',
        'risk.weatherRisk': 'मौसम जोखिम',
        'risk.treeFalling': 'पेड़ गिरने की संभावना',
        'risk.friendlyLocations': 'मित्रवत स्थान',
        'risk.liveUsers': 'वर्तमान में निगरानी कर रहे लाइव उपयोगकर्ता',

        // Regional Risk
        'regional.title': 'क्षेत्रीय जोखिम विश्लेषण',
        'regional.highRisk': 'उच्च जोखिम',
        'regional.medium': 'मध्यम',

        // Response Stats
        'stats.title': 'आपातकालीन प्रतिक्रिया आंकड़े',
        'stats.avgResponse': 'औसत प्रतिक्रिया समय',
        'stats.activeTeams': 'सक्रिय टीमें',
        'stats.successRate': 'सफलता दर',

        // Respond Modal
        'modal.dispatchResponse': 'प्रतिक्रिया भेजें',
        'modal.sendResponse': 'आपातकालीन प्रतिक्रिया भेजें',
        'modal.selectUnit': 'प्रतिक्रिया इकाई चुनें',
        'modal.estimatedTime': 'अनुमानित आगमन समय (मिनट)',
        'modal.responseNotes': 'प्रतिक्रिया नोट्स (वैकल्पिक)',
        'modal.notesPlaceholder': 'प्रतिक्रिया टीम के लिए कोई अतिरिक्त निर्देश या नोट्स जोड़ें...',
        'modal.dispatchUnit': 'इकाई भेजें',
        'modal.cancel': 'रद्द करें',

        // Response Units
        'units.patrol1': 'पेट्रोल यूनिट 1 - टी. नगर स्टेशन',
        'units.patrol2': 'पेट्रोल यूनिट 2 - वेलाचेरी स्टेशन',
        'units.ambulance1': 'एम्बुलेंस यूनिट 1 - अपोलो अस्पताल',
        'units.ambulance2': 'एम्बुलेंस यूनिट 2 - एसआईएमएस अस्पताल',
        'units.fire1': 'अग्निशमन और बचाव इकाई - अन्ना नगर',

        // Validate Modal
        'validate.title': 'अलर्ट सत्यापित करें',
        'validate.subtitle': 'अलर्ट की प्रामाणिकता सत्यापित करें',
        'validate.question': 'क्या यह अलर्ट वैध है और कार्रवाई की आवश्यकता है?',
        'validate.confirmValid': 'वैध की पुष्टि करें',
        'validate.falseAlarm': 'झूठा अलार्म',

        // Settings Page
        'settings.title': 'सिस्टम सेटिंग्स',
        'settings.subtitle': 'सिस्टम प्राथमिकताएं और सुरक्षा कॉन्फ़िगर करें',
        'settings.systemOverview': 'सिस्टम अवलोकन',
        'settings.version': 'संस्करण',
        'settings.uptime': 'सिस्टम अपटाइम',
        'settings.activeUsers': 'सक्रिय उपयोगकर्ता',
        'settings.totalAlerts': 'कुल अलर्ट',
        'settings.storageUsed': 'उपयोग किया गया स्टोरेज',

        // Service Status
        'service.title': 'सेवा स्थिति',
        'service.database': 'डेटाबेस',
        'service.apiServer': 'एपीआई सर्वर',
        'service.authentication': 'प्रमाणीकरण',
        'service.mapServices': 'मानचित्र सेवाएं',
        'service.smsGateway': 'एसएमएस गेटवे',
        'service.emailService': 'ईमेल सेवा',
        'service.active': 'सक्रिय',
        'service.checking': 'जांच रहे हैं...',
        'service.offline': 'ऑफलाइन',

        // Security & Privacy
        'security.title': 'सुरक्षा और गोपनीयता',
        'security.authentication': 'प्रमाणीकरण',
        'security.twoFactor': 'दो-कारक प्रमाणीकरण',
        'security.sessionTimeout': 'सत्र समय समाप्ति',
        'security.changePassword': 'पासवर्ड बदलें',
        'security.privacyControls': 'गोपनीयता नियंत्रण',
        'security.locationTracking': 'स्थान ट्रैकिंग',
        'security.autoBackups': 'स्वचालित बैकअप',
        'security.dataRetention': 'डेटा प्रतिधारण',

        // Notifications
        'notifications.title': 'सूचनाएं और अलर्ट',
        'notifications.channels': 'सूचना चैनल',
        'notifications.soundAlerts': 'ध्वनि अलर्ट',
        'notifications.desktopNotifications': 'डेस्कटॉप सूचनाएं',
        'notifications.emailAlerts': 'ईमेल अलर्ट',
        'notifications.smsAlerts': 'एसएमएस अलर्ट',
        'notifications.priority': 'अलर्ट प्राथमिकता स्तर',
        'notifications.criticalPriority': 'गंभीर',
        'notifications.highPriority': 'उच्च',
        'notifications.normalPriority': 'सामान्य',
        'notifications.allChannels': 'सभी चैनल सक्षम',
        'notifications.pushSound': 'केवल पुश + ध्वनि',
        'notifications.silentNotif': 'मूक सूचनाएं',

        // Appearance
        'appearance.title': 'रूप और प्रदर्शन',
        'appearance.theme': 'थीम',
        'appearance.darkMode': 'डार्क मोड',
        'appearance.lightMode': 'लाइट मोड',
        'appearance.accentColor': 'एक्सेंट रंग',
        'appearance.language': 'भाषा',
        'appearance.dateFormat': 'तिथि प्रारूप',

        // Advanced Config
        'advanced.title': 'उन्नत कॉन्फ़िगरेशन',
        'advanced.systemEndpoints': 'सिस्टम एंडपॉइंट्स',
        'advanced.backendApi': 'बैकएंड एपीआई एंडपॉइंट',
        'advanced.websocket': 'वेबसॉकेट सर्वर',
        'advanced.database': 'डेटाबेस कनेक्शन',
        'advanced.dataRefresh': 'डेटा रिफ्रेश अंतराल',
        'advanced.realtime': 'रीयल-टाइम (वेबसॉकेट)',
        'advanced.dataManagement': 'डेटा प्रबंधन',
        'advanced.exportData': 'डेटा निर्यात करें',
        'advanced.importData': 'डेटा आयात करें',
        'advanced.clearCache': 'कैश साफ़ करें',
        'advanced.resetSettings': 'सभी सेटिंग्स रीसेट करें',

        // Common
        'common.save': 'सहेजें',
        'common.cancel': 'रद्द करें',
        'common.confirm': 'पुष्टि करें',
        'common.delete': 'हटाएं',
        'common.edit': 'संपादित करें',
        'common.close': 'बंद करें',
        'common.yes': 'हां',
        'common.no': 'नहीं',
        'common.loading': 'लोड हो रहा है...',
        'common.error': 'त्रुटि',
        'common.success': 'सफलता',
        'common.indian': 'भारतीय',

        // Login Page
        'login.selectLanguage': 'भाषा चुनें',
        'login.secureAccess': 'सुरक्षित एक्सेस V2.4',
        'login.tagline': 'के लिए केंद्रीकृत कमांड सेंटर',
        'login.taglineStrong': 'प्रोएक्टिव सेफ्टी वियरेबल',
        'login.taglineEnd': 'पारिस्थितिकी तंत्र। तेज़ प्रतिक्रिया, फिर से परिभाषित।',
        'login.activeOfficers': 'सक्रिय अधिकारी',
        'login.realTimeCoverage': 'रीयल-टाइम कवरेज',
        'login.identity': 'पहचान',
        'login.keyPhrase': 'कुंजी वाक्यांश',
        'login.rememberMe': 'मुझे याद रखें',
        'login.lostAccess': 'एक्सेस खो गया?',
        'login.authenticateAccess': 'एक्सेस प्रमाणित करें',
        'login.invalidCredentials': 'अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।',

        // Login Roles
        'login.role.user': 'नागरिक पोर्टल',
        'login.role.userDesc': 'सार्वजनिक सुरक्षा सेवाओं के लिए सुरक्षित पहुंच',
        'login.role.userPlaceholder': 'आधार / मोबाइल नंबर',
        'login.role.police': 'पुलिस विभाग',
        'login.role.policeDesc': 'केवल कानून प्रवर्तन अधिकृत पहुंच',
        'login.role.policePlaceholder': 'बैज आईडी / आधिकारिक ईमेल',
        'login.role.admin': 'सिस्टम एडमिन',
        'login.role.adminDesc': 'सिस्टम कॉन्फ़िगरेशन और निगरानी',
        'login.role.adminPlaceholder': 'एडमिन आईडी',
        'login.role.emergency': 'आपातकालीन प्रतिक्रिया',
        'login.role.emergencyDesc': 'तीव्र प्रतिक्रिया समन्वय इकाई',
        'login.role.emergencyPlaceholder': 'सेवा आईडी',
        'login.role.volunteer': 'पी-आर स्वयंसेवक',
        'login.role.volunteerDesc': 'सामुदायिक समर्थन नेटवर्क पहुंच',
        'login.role.volunteerPlaceholder': 'स्वयंसेवक आईडी',

        // Dashboard
        'dashboard.emergencyServicesFilter': 'आपातकालीन सेवा फ़िल्टर',
        'dashboard.liveData': 'लाइव डेटा',
        'dashboard.show': 'दिखाएं:',
        'dashboard.allServices': '🏥 सभी सेवाएं',
        'dashboard.policeStations': '🚔 पुलिस स्टेशन',
        'dashboard.hospitals': '🏥 अस्पताल',
        'dashboard.police': 'पुलिस',
        'dashboard.hospitalsLabel': 'अस्पताल',
        'dashboard.policeHospitalsTitle': 'पुलिस स्टेशन और अस्पताल',
        'dashboard.realTimeEmergency': 'रीयल-टाइम आपातकालीन सेवाओं का कवरेज',
        'dashboard.refreshMap': 'मानचित्र रीफ्रेश करें',
        'dashboard.activeUsers': 'सक्रिय उपयोगकर्ता',
        'dashboard.safetyScore': 'सुरक्षा स्कोर',
        'dashboard.avgResponse': 'औसत प्रतिक्रिया',
        'dashboard.criticalAlert': 'गंभीर चेतावनी',
        'dashboard.activeEmergencies': 'सक्रिय आपातकाल',
        'dashboard.requireImmediatePlanning': 'तत्काल योजना और पुलिस क्षेत्र की आवश्यकता',
        'dashboard.viewDetails': 'विवरण देखें',

        // Logout
        'logout.confirm': 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
    },

    ta: {
        // Header
        'header.title': 'பெண்கள் பாதுகாப்பு டாஷ்போர்டு',
        'header.subtitle': 'தனியுரிமை-முதல், கைகள்-இல்லாத பாதுகாப்பு உண்மையான அவசரநிலைகளுக்காக உருவாக்கப்பட்டது.',
        'header.search': 'பயனர் ஐடி அல்லது தொலைபேசி மூலம் தேடுங்கள்...',
        'header.logout': 'வெளியேறு',
        'header.adminUser': 'நிர்வாக பயனர்',
        'header.authorized': 'அங்கீகரிக்கப்பட்டது',

        // Sidebar - User
        'sidebar.dashboard': 'டாஷ்போர்ட்',
        'sidebar.vitals': 'உடல்நலக் குறிகள்',
        'sidebar.safetyZones': 'பாதுகாப்பு மண்டலங்கள்',
        'sidebar.sosBeacon': 'எஸ்ஓஎஸ் பீக்கன்',
        'sidebar.guardianVoice': 'காவலர்குரல்',
        'sidebar.predictions': 'கணிப்புகள்',
        'sidebar.efir': 'இ-எஃப்ஐஆர்',
        'sidebar.fileEFIR': 'E-FIR தாகல் செய்க',
        'sidebar.settings': 'அமைப்புகள்',

        // Sidebar - Police
        'sidebar.emergencyAlerts': 'அவசர எச்சரிக்கைகள்',
        'sidebar.analytics': 'பகுப்பாய்வு',
        'sidebar.surveillanceHub': 'கண்காணிப்பு மையம்',
        'sidebar.auditLogs': 'தணிக்கை பதிவுகள்',
        'sidebar.firRegistry': 'எஃப்ஐஆர் பதிவேடு',
        'sidebar.safetyZonesAdmin': 'பாதுகாப்பு மண்டலங்கள் (நிர்வாகி)',
        'sidebar.systemSettings': 'கணினி அமைப்புகள்',
        'sidebar.policeCommand': 'காவல் கட்டளை',
        'sidebar.protectR': 'Protect-R',
        'sidebar.officialTerminal': 'அதிகாரபூர்வ டெர்மினல்',
        'sidebar.womenSafetyPlatform': 'பெண்கள் பாதுகாப்பு மெஞ்சியம்',

        // Alerts Page
        'alerts.title': 'அவசர எச்சரிக்கைகள்',
        'alerts.subtitle': 'பயனர் அவசரநிலைகளை கண்காணித்து பதிலளிக்கவும்',
        'alerts.active': 'செயலில்',
        'alerts.resolved': 'தீர்க்கப்பட்டது',
        'alerts.critical': 'முக்கியமான',
        'alerts.warning': 'எச்சரிக்கை',
        'alerts.all': 'அனைத்தும்',
        'alerts.note': 'குறிப்பு',
        'alerts.noteText': 'பயனர்/குடும்பத்திற்கு 1 பயனர் விவரங்கள் மட்டுமே காட்டப்பட வேண்டும். மற்ற உள்நுழைவு தொகுதிகளுக்கு அனைத்து பயனர் விவரங்களும் காட்டப்படலாம்.',
        'alerts.userDetails': 'பயனர் விவரங்கள் மற்றும் செயலில் உள்ள எச்சரிக்கைகள்',
        'alerts.userId': 'பயனர் ஐடி',
        'alerts.nationality': 'தேசியம்',
        'alerts.location': 'தற்போதைய இடம்',
        'alerts.contact': 'தொடர்பு',
        'alerts.incident': 'சம்பவம்',
        'alerts.respond': 'பதிலளி',
        'alerts.validate': 'சரிபார்',
        'alerts.markResolved': 'தீர்க்கப்பட்டதாக குறி',
        'alerts.responding': 'பதிலளிக்கிறது',

        // Alert Types
        'alerts.medicalEmergency': 'மருத்துவ அவசரநிலை',
        'alerts.safetyThreat': 'பாதுகாப்பு அச்சுறுத்தல்',
        'alerts.accident': 'விபத்து',
        'alerts.suspiciousActivity': 'சந்தேகத்திற்குரிய செயல்பாடு',
        'alerts.harassment': 'துன்புறுத்தல்',

        // Risk Assessment
        'risk.title': 'ஆபத்து மதிப்பீடு கண்ணோட்டம்',
        'risk.highRisk': 'அதிக ஆபத்து பகுதிகள்',
        'risk.mediumRisk': 'நடுத்தர ஆபத்து பகுதிகள்',
        'risk.safeAreas': 'பாதுகாப்பான பகுதிகள்',
        'risk.activeUsers': 'செயலில் உள்ள பயனர்கள்',
        'risk.weatherRisk': 'வானிலை ஆபத்து',
        'risk.treeFalling': 'மரங்கள் விழும் வாய்ப்பு',
        'risk.friendlyLocations': 'நட்பு இடங்கள்',
        'risk.liveUsers': 'தற்போது கண்காணிக்கும் நேரடி பயனர்கள்',

        // Regional Risk
        'regional.title': 'பிராந்திய ஆபத்து பகுப்பாய்வு',
        'regional.highRisk': 'அதிக ஆபத்து',
        'regional.medium': 'நடுத்தர',

        // Response Stats
        'stats.title': 'அவசர பதில் புள்ளிவிவரங்கள்',
        'stats.avgResponse': 'சராசரி பதில் நேரம்',
        'stats.activeTeams': 'செயலில் உள்ள குழுக்கள்',
        'stats.successRate': 'வெற்றி விகிதம்',

        // Respond Modal
        'modal.dispatchResponse': 'பதிலை அனுப்பு',
        'modal.sendResponse': 'அவசர பதிலை அனுப்பு',
        'modal.selectUnit': 'பதில் அலகு தேர்ந்தெடு',
        'modal.estimatedTime': 'மதிப்பிடப்பட்ட வருகை நேரம் (நிமிடங்கள்)',
        'modal.responseNotes': 'பதில் குறிப்புகள் (விருப்பம்)',
        'modal.notesPlaceholder': 'பதில் குழுவிற்கு கூடுதல் வழிமுறைகள் அல்லது குறிப்புகளை சேர்க்கவும்...',
        'modal.dispatchUnit': 'அலகு அனுப்பு',
        'modal.cancel': 'ரத்து செய்',

        // Response Units
        'units.patrol1': 'ரோந்து அலகு 1 - டி. நகர் நிலையம்',
        'units.patrol2': 'ரோந்து அலகு 2 - வேளச்சேரி நிலையம்',
        'units.ambulance1': 'ஆம்புலன்ஸ் அலகு 1 - அப்போலோ மருத்துவமனை',
        'units.ambulance2': 'ஆம்புலன்ஸ் அலகு 2 - எஸ்ஐஎம்எஸ் மருத்துவமனை',
        'units.fire1': 'தீயணைப்பு மற்றும் மீட்பு அலகு - அண்ணா நகர்',

        // Validate Modal
        'validate.title': 'எச்சரிக்கையை சரிபார்',
        'validate.subtitle': 'எச்சரிக்கை நம்பகத்தன்மையை சரிபார்க்கவும்',
        'validate.question': 'இந்த எச்சரிக்கை சட்டபூர்வமானதா மற்றும் நடவடிக்கை தேவையா?',
        'validate.confirmValid': 'செல்லுபடியாகும் என உறுதிப்படுத்து',
        'validate.falseAlarm': 'தவறான எச்சரிக்கை',

        // Settings Page
        'settings.title': 'கணினி அமைப்புகள்',
        'settings.subtitle': 'கணினி விருப்பத்தேர்வுகள் மற்றும் பாதுகாப்பை உள்ளமை',
        'settings.systemOverview': 'கணினி கண்ணோட்டம்',
        'settings.version': 'பதிப்பு',
        'settings.uptime': 'கணினி இயக்க நேரம்',
        'settings.activeUsers': 'செயலில் உள்ள பயனர்கள்',
        'settings.totalAlerts': 'மொத்த எச்சரிக்கைகள்',
        'settings.storageUsed': 'பயன்படுத்தப்பட்ட சேமிப்பு',

        // Service Status
        'service.title': 'சேவை நிலை',
        'service.database': 'தரவுத்தளம்',
        'service.apiServer': 'ஏபிஐ சேவையகம்',
        'service.authentication': 'அங்கீகாரம்',
        'service.mapServices': 'வரைபட சேவைகள்',
        'service.smsGateway': 'எஸ்எம்எஸ் நுழைவாயில்',
        'service.emailService': 'மின்னஞ்சல் சேவை',
        'service.active': 'செயலில்',
        'service.checking': 'சரிபார்க்கிறது...',
        'service.offline': 'ஆஃப்லைன்',

        // Security & Privacy
        'security.title': 'பாதுகாப்பு மற்றும் தனியுரிமை',
        'security.authentication': 'அங்கீகாரம்',
        'security.twoFactor': 'இரு-காரணி அங்கீகாரம்',
        'security.sessionTimeout': 'அமர்வு காலாவதி',
        'security.changePassword': 'கடவுச்சொல்லை மாற்று',
        'security.privacyControls': 'தனியுரிமை கட்டுப்பாடுகள்',
        'security.locationTracking': 'இடம் கண்காணிப்பு',
        'security.autoBackups': 'தானியங்கு காப்புப்பிரதிகள்',
        'security.dataRetention': 'தரவு தக்கவைப்பு',

        // Notifications
        'notifications.title': 'அறிவிப்புகள் மற்றும் எச்சரிக்கைகள்',
        'notifications.channels': 'அறிவிப்பு சேனல்கள்',
        'notifications.soundAlerts': 'ஒலி எச்சரிக்கைகள்',
        'notifications.desktopNotifications': 'டெஸ்க்டாப் அறிவிப்புகள்',
        'notifications.emailAlerts': 'மின்னஞ்சல் எச்சரிக்கைகள்',
        'notifications.smsAlerts': 'எஸ்எம்எஸ் எச்சரிக்கைகள்',
        'notifications.priority': 'எச்சரிக்கை முன்னுரிமை நிலைகள்',
        'notifications.criticalPriority': 'முக்கியமான',
        'notifications.highPriority': 'உயர்',
        'notifications.normalPriority': 'சாதாரண',
        'notifications.allChannels': 'அனைத்து சேனல்களும் இயக்கப்பட்டன',
        'notifications.pushSound': 'புஷ் + ஒலி மட்டும்',
        'notifications.silentNotif': 'அமைதியான அறிவிப்புகள்',

        // Appearance
        'appearance.title': 'தோற்றம் மற்றும் காட்சி',
        'appearance.theme': 'தீம்',
        'appearance.darkMode': 'இருண்ட பயன்முறை',
        'appearance.lightMode': 'ஒளி பயன்முறை',
        'appearance.accentColor': 'உச்சரிப்பு நிறம்',
        'appearance.language': 'மொழி',
        'appearance.dateFormat': 'தேதி வடிவம்',

        // Advanced Config
        'advanced.title': 'மேம்பட்ட உள்ளமைவு',
        'advanced.systemEndpoints': 'கணினி இறுதிப்புள்ளிகள்',
        'advanced.backendApi': 'பின்தள ஏபிஐ இறுதிப்புள்ளி',
        'advanced.websocket': 'வெப்சாக்கெட் சேவையகம்',
        'advanced.database': 'தரவுத்தள இணைப்பு',
        'advanced.dataRefresh': 'தரவு புதுப்பிப்பு இடைவெளி',
        'advanced.realtime': 'நேரடி (வெப்சாக்கெட்)',
        'advanced.dataManagement': 'தரவு மேலாண்மை',
        'advanced.exportData': 'தரவை ஏற்றுமதி செய்',
        'advanced.importData': 'தரவை இறக்குமதி செய்',
        'advanced.clearCache': 'தற்காலிக சேமிப்பை அழி',
        'advanced.resetSettings': 'அனைத்து அமைப்புகளையும் மீட்டமை',

        // Common
        'common.save': 'சேமி',
        'common.cancel': 'ரத்து செய்',
        'common.confirm': 'உறுதிப்படுத்து',
        'common.delete': 'நீக்கு',
        'common.edit': 'திருத்து',
        'common.close': 'மூடு',
        'common.yes': 'ஆம்',
        'common.no': 'இல்லை',
        'common.loading': 'ஏற்றுகிறது...',
        'common.error': 'பிழை',
        'common.success': 'வெற்றி',
        'common.indian': 'இந்தியன்',

        // Login Page
        'login.selectLanguage': 'மொழி தேர்ந்தெடு',
        'login.secureAccess': 'பாதுகாப்பான அணுகல் V2.4',
        'login.tagline': 'க்கான மையப்படுத்தப்பட்ட கட்டளை மையம்',
        'login.taglineStrong': 'ப்ரோஆக்டிவ் சேஃப்டி வியரபிள்',
        'login.taglineEnd': 'சுற்றுச்சூழல் அமைப்பு. விரைவான பதில், மறுவரையறை.',
        'login.activeOfficers': 'செயலில் உள்ள அதிகாரிகள்',
        'login.realTimeCoverage': 'நேரடி கவரேஜ்',
        'login.identity': 'அடையாளம்',
        'login.keyPhrase': 'முக்கிய சொற்றொடர்',
        'login.rememberMe': 'என்னை நினைவில் கொள்',
        'login.lostAccess': 'அணுகல் இழந்தீர்களா?',
        'login.authenticateAccess': 'அணுகலை அங்கீகரி',
        'login.invalidCredentials': 'தவறான சான்றுகள். மீண்டும் முயற்சிக்கவும்.',

        // Login Roles
        'login.role.user': 'குடிமக்கள் போர்ட்டல்',
        'login.role.userDesc': 'பொது பாதுகாப்பு சேவைகளுக்கான பாதுகாப்பான அணுகல்',
        'login.role.userPlaceholder': 'ஆதார் / மொபைல் எண்',
        'login.role.police': 'காவல் துறை',
        'login.role.policeDesc': 'சட்ட அமலாக்க அங்கீகரிக்கப்பட்ட அணுகல் மட்டும்',
        'login.role.policePlaceholder': 'பேட்ஜ் ஐடி / அதிகாரபூர்வ மின்னஞ்சல்',
        'login.role.admin': 'கணினி நிர்வாகி',
        'login.role.adminDesc': 'கணினி உள்ளமைவு மற்றும் மேற்பார்வை',
        'login.role.adminPlaceholder': 'நிர்வாகி ஐடி',
        'login.role.emergency': 'அவசர பதில்',
        'login.role.emergencyDesc': 'விரைவான பதில் ஒருங்கிணைப்பு அலகு',
        'login.role.emergencyPlaceholder': 'சேவை ஐடி',
        'login.role.volunteer': 'பி-ஆர் தன்னார்வலர்',
        'login.role.volunteerDesc': 'சமூக ஆதரவு நெட்வொர்க் அணுகல்',
        'login.role.volunteerPlaceholder': 'தன்னார்வலர் ஐடி',

        // Dashboard
        'dashboard.emergencyServicesFilter': 'அவசர சேவைகள் வடிகட்டி',
        'dashboard.liveData': 'நேரடி தரவு',
        'dashboard.show': 'காட்டு:',
        'dashboard.allServices': '🏥 அனைத்து சேவைகள்',
        'dashboard.policeStations': '🚔 காவல் நிலையங்கள்',
        'dashboard.hospitals': '🏥 மருத்துவமனைகள்',
        'dashboard.police': 'காவல்துறை',
        'dashboard.hospitalsLabel': 'மருத்துவமனைகள்',
        'dashboard.policeHospitalsTitle': 'காவல் நிலையங்கள் & மருத்துவமனைகள்',
        'dashboard.realTimeEmergency': 'நேரடி அவசர சேவைகள் கவரேஜ்',
        'dashboard.refreshMap': 'வரைபடத்தை புதுப்பி',
        'dashboard.activeUsers': 'செயலில் உள்ள பயனர்கள்',
        'dashboard.safetyScore': 'பாதுகாப்பு மதிப்பெண்',
        'dashboard.avgResponse': 'சராசரி பதில்',
        'dashboard.criticalAlert': 'முக்கிய எச்சரிக்கை',
        'dashboard.activeEmergencies': 'செயலில் உள்ள அவசரநிலைகள்',
        'dashboard.requireImmediatePlanning': 'உடனடி திட்டமிடல் மற்றும் காவல் பகுதி தேவை',
        'dashboard.viewDetails': 'விவரங்களைக் காண்க',

        // Logout
        'logout.confirm': 'நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?',
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language')
        return (saved as Language) || 'en'
    })

    useEffect(() => {
        localStorage.setItem('language', language)
        document.documentElement.lang = language
    }, [language])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
    }

    const t = (key: string): string => {
        return (translations[language] as Record<string, string>)[key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
