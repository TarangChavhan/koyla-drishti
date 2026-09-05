export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'or' | 'mr' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'National / Official' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'National / Coal Belt (JH/MP/CG)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal (Raniganj / ECL)' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha (Talcher / MCL)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra (WCL)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Telangana (SCCL)' }
];

/**
 * Key-based translations used by t('key_name')
 */
export const KEY_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Sovereign & Header
    gov_india: 'Government of India',
    ministry_coal: 'Ministry of Coal',
    dgms_title: 'Directorate General of Mines Safety (DGMS)',
    portal_system_name: 'KOYLA DRISHTI',
    portal_system_sub: 'Smart Governance & Compliance Intelligence System for Coal Mines',
    satyameva_jayate: 'Satyameva Jayate',
    telemetry_status: 'Sentinel Radar 2A & 2B Live Telemetry',
    toll_free_help: 'Toll-Free DGMS Helpline: 1800-345-MINE',
    national_portal: 'National Coal Portal',
    
    // Navigation
    nav_home: 'Home',
    nav_overview: 'Overview',
    nav_portals: 'Portals',
    nav_capabilities: 'AI Sentinel',
    nav_basins: 'Coal Basins',
    nav_circulars: 'DGMS Circulars',
    nav_helpdesk: 'Helpdesk',
    nav_login: 'Portal Login',
    nav_dashboard: 'Go to Dashboard',
    nav_logout: 'Sign Out',
    nav_public_home: 'Public Home',
    select_language: 'Select Language',
    language_label: 'Language',

    // Hero Section
    hero_statutory_badge: 'Statutory Mine Safety & Digital Governance · CMR 2017 & Mines Act 1952',
    hero_title: 'National AI-Powered Coal Mine Surveillance & Compliance System',
    hero_subtitle: 'Empowering the Ministry of Coal, DGMS Regulatory Inspectorate, and Colliery Leaseholders with automated satellite lease-boundary intrusion monitoring, real-time IoT gas & dust telemetry, and statutory digital audit dossiers.',
    hero_btn_explore: 'Explore Portals & Capabilities',
    hero_btn_login: 'Access Stakeholder Portal',
    hero_btn_circulars: 'Latest DGMS Directives',
    
    // Hero Gateway Card
    gateway_title: 'Stakeholder Login & Gateway',
    gateway_subtitle: 'Sign in to access authorized operational desk',
    role_admin: 'Admin HQ',
    role_inspector: 'Inspector',
    role_mine: 'Mine Desk',
    role_admin_dept: 'Ministry of Coal (HQ) · New Delhi',
    role_inspector_dept: 'DGMS Regulatory Arm · Statutory Inspections',
    role_mine_dept: 'Colliery Operators · BCCL / ECL / NCL',
    label_email: 'Official Email / Government ID',
    label_password: 'Password',
    remember_id: 'Remember ID',
    forgot_password: 'Forgot Password?',
    btn_sign_in_prefix: 'Sign In as',
    btn_sign_in_suffix: '& Enter Operations',
    btn_authenticating: 'Authenticating Officer...',
    btn_quick_demo: 'Instant 1-Click Demo Login (No Password Needed)',
    ssl_notice: '256-Bit SSL Encrypted Statutory Node',
    dedicated_login: 'Dedicated Login Page →',
    active_session: 'Active Session',
    continue_dashboard: 'Continue to Operations Dashboard',
    switch_officer: 'Sign Out / Switch Officer Account',
    
    // Hero Stats
    stat_mines: 'Monitored Collieries',
    stat_mines_sub: 'BCCL, CCL, ECL, NCL, SECL, MCL, WCL',
    stat_accuracy: 'Sat-Change Accuracy',
    stat_accuracy_sub: 'Sentinel-2 & SAR High Res Ground Truth',
    stat_sensors: 'Real-Time Gas & Dust Feeds',
    stat_sensors_sub: 'CH4, PM10, Blast PPV Continuous Streams',
    stat_compliance: 'Mines Act Statutory Tracking',
    stat_compliance_sub: 'DGMS CMR 2017 Regulatory Protocol',

    // Portals Section
    portals_heading: 'Authorized Stakeholder Portals',
    portals_subheading: 'Dedicated operational workflows designed specifically for the Ministry of Coal, DGMS Regulators, and Coal Mine Authority Teams.',
    portal_admin_title: 'Ministry of Coal & Executive Apex Council',
    portal_admin_role: 'Central Governance & Oversight Desk',
    portal_admin_desc: 'Central supervisory command for national coal reserves. Monitors state-wise compliance indexes, schedules statutory audits, and manages nationwide colliery licenses.',
    
    portal_insp_title: 'DGMS Regulatory Field Inspectorate',
    portal_insp_role: 'Statutory Regulatory & Audit Arm',
    portal_insp_desc: 'Empowered statutory officers executing on-ground safety audits, investigating AI-detected boundary intrusions, and serving digital legal notices.',

    portal_mine_title: 'Colliery Management & Leaseholder Portal',
    portal_mine_role: 'Colliery Compliance & Reporting Desk',
    portal_mine_desc: 'Operational portal for mine managers and safety officers to upload shift telemetry, manage environmental logs, and respond to regulatory notices.',

    // Common UI Labels
    action_open_desk: 'Open Stakeholder Desk',
    action_search: 'Search...',
    action_filter: 'Filter',
    action_download: 'Download',
    action_submit: 'Submit',
    action_cancel: 'Cancel',
    action_close: 'Close',
    action_save: 'Save Changes',
    action_refresh: 'Refresh Feed',
    status_compliant: 'Compliant',
    status_critical: 'Critical',
    status_moderate: 'Moderate',
    status_pending: 'Pending Review',
    status_resolved: 'Resolved',
    footer_rights: 'Ministry of Coal, Government of India. All Rights Reserved.',
    footer_developed: 'National Informatics Centre (NIC) & CMPDI Compliance Intelligence Cell'
  },
  hi: {
    gov_india: 'भारत सरकार',
    ministry_coal: 'कोयला मंत्रालय',
    dgms_title: 'खान सुरक्षा महानिदेशालय (DGMS)',
    portal_system_name: 'कोयला दृष्टि',
    portal_system_sub: 'कोयला खदानों के लिए स्मार्ट शासन एवं अनुपालन आसूचना प्रणाली',
    satyameva_jayate: 'सत्यमेव जयते',
    telemetry_status: 'सेंटिनल रडार 2A एवं 2B लाइव टेलीमेट्री',
    toll_free_help: 'टोल-फ्री डीजीएमएस हेल्पलाइन: 1800-345-MINE',
    national_portal: 'राष्ट्रीय कोयला पोर्टल',
    nav_home: 'होम',
    nav_overview: 'अवलोकन',
    nav_portals: 'पोर्टल',
    nav_capabilities: 'एआई प्रहरी',
    nav_basins: 'कोयला बेसिन',
    nav_circulars: 'डीजीएमएस परिपत्र',
    nav_helpdesk: 'हेल्पडेस्क',
    nav_login: 'पोर्टल लॉगिन',
    nav_dashboard: 'डैशबोर्ड पर जाएं',
    nav_logout: 'लॉग आउट',
    nav_public_home: 'सार्वजनिक होम',
    select_language: 'भाषा चुनें',
    language_label: 'भाषा',
    hero_statutory_badge: 'वैधानिक खदान सुरक्षा एवं डिजिटल शासन · सीएमआर 2017 एवं खान अधिनियम 1952',
    hero_title: 'राष्ट्रीय एआई-संचालित कोयला खदान निगरानी एवं अनुपालन प्रणाली',
    hero_subtitle: 'कोयला मंत्रालय, डीजीएमएस नियामक निरीक्षणालय और खदान पट्टाधारकों को स्वचालित उपग्रह पट्टा-सीमा अतिक्रमण निगरानी, रीयल-टाइम आईओटी गैस व धूल टेलीमेट्री और डिजिटल वैधानिक ऑडिट डॉसियर से सशक्त बनाना।',
    hero_btn_explore: 'पोर्टल एवं क्षमताएं देखें',
    hero_btn_login: 'हितधारक पोर्टल में प्रवेश करें',
    hero_btn_circulars: 'नवीनतम डीजीएमएस निर्देश',
    gateway_title: 'हितधारक लॉगिन एवं गेटवे',
    gateway_subtitle: 'अधिकृत परिचालन डेस्क तक पहुंचने के लिए साइन इन करें',
    role_admin: 'प्रशासन मुख्यालय',
    role_inspector: 'निरीक्षक',
    role_mine: 'खदान डेस्क',
    role_admin_dept: 'कोयला मंत्रालय (मुख्यालय) · नई दिल्ली',
    role_inspector_dept: 'डीजीएमएस विनियामक शाखा · सांविधिक निरीक्षण',
    role_mine_dept: 'कोलियरी संचालक · बीसीसीएल / ईसीएल / एनसीएल',
    label_email: 'आधिकारिक ईमेल / सरकारी पहचान संख्या',
    label_password: 'पासवर्ड',
    remember_id: 'आईडी याद रखें',
    forgot_password: 'पासवर्ड भूल गए?',
    btn_sign_in_prefix: 'साइन इन करें -',
    btn_sign_in_suffix: 'एवं कार्यस्थल में प्रवेश करें',
    btn_authenticating: 'अधिकारी प्रमाणीकरण जारी...',
    btn_quick_demo: 'तुरंत 1-क्लिक डेमो लॉगिन (पासवर्ड आवश्यक नहीं)',
    ssl_notice: '256-बिट एसएसएल एन्क्रिप्टेड वैधानिक नोड',
    dedicated_login: 'समर्पित लॉगिन पृष्ठ →',
    active_session: 'सक्रिय सत्र',
    continue_dashboard: 'परिचालन डैशबोर्ड पर जारी रखें',
    switch_officer: 'लॉग आउट करें / अधिकारी खाता बदलें',
    stat_mines: 'निगरानी अधीन कोलियरी',
    stat_mines_sub: 'बीसीसीएल, सीसीएल, ईसीएल, एनसीएल, एसईसीएल, एमसीएल, डब्ल्यूसीएल',
    stat_accuracy: 'उपग्रह विसंगति सटीकता',
    stat_accuracy_sub: 'सेंटिनल-2 एवं एसएआर उच्च विभेदन ग्राउंड ट्रुथ',
    stat_sensors: 'रीयल-टाइम गैस एवं धूल फीड',
    stat_sensors_sub: 'CH4, PM10, ब्लास्ट कंपन निरंतर डेटा',
    stat_compliance: 'खान अधिनियम सांविधिक ट्रैकिंग',
    stat_compliance_sub: 'डीजीएमएस सीएमआर 2017 नियामक प्रोटोकॉल',
    portals_heading: 'अधिकृत हितधारक पोर्टल',
    portals_subheading: 'कोयला मंत्रालय, डीजीएमएस नियामकों और खदान प्राधिकरण टीमों के लिए विशेष रूप से डिज़ाइन की गई परिचालन प्रणाली।',
    portal_admin_title: 'कोयला मंत्रालय एवं कार्यकारी शीर्ष परिषद',
    portal_admin_role: 'केंद्रीय शासन एवं पर्यवेक्षण डेस्क',
    portal_admin_desc: 'राष्ट्रीय कोयला भंडार के लिए केंद्रीय पर्यवेक्षी कमान। राज्य-वार अनुपालन सूचकांक की निगरानी, वैधानिक ऑडिट का निर्धारण और खदान लाइसेंस प्रबंधन।',
    portal_insp_title: 'डीजीएमएस नियामक फील्ड निरीक्षणालय',
    portal_insp_role: 'सांविधिक नियामक एवं ऑडिट शाखा',
    portal_insp_desc: 'जमीनी स्तर पर सुरक्षा ऑडिट करने, उपग्रह अतिक्रमण की जांच करने और डिजिटल वैधानिक नोटिस जारी करने के लिए सशक्त वैधानिक अधिकारी।',
    portal_mine_title: 'कोलियरी प्रबंधन एवं पट्टाधारक पोर्टल',
    portal_mine_role: 'कोलियरी अनुपालन एवं रिपोर्टिंग डेस्क',
    portal_mine_desc: 'खदान प्रबंधकों और सुरक्षा अधिकारियों के लिए पाली टेलीमेट्री डेटा अपलोड करने, पर्यावरण लॉग बनाए रखने और नियामक नोटिस का जवाब देने का पोर्टल।',
    action_open_desk: 'हितधारक डेस्क खोलें',
    action_search: 'खोजें...',
    action_filter: 'फ़िल्टर',
    action_download: 'डाउनलोड',
    action_submit: 'जमा करें',
    action_cancel: 'रद्द करें',
    action_close: 'बंद करें',
    action_save: 'परिवर्तन सहेजें',
    action_refresh: 'ताज़ा करें',
    status_compliant: 'अनुपालित',
    status_critical: 'गंभीर',
    status_moderate: 'मध्यम',
    status_pending: 'समीक्षा लंबित',
    status_resolved: 'हल किया गया',
    footer_rights: 'कोयला मंत्रालय, भारत सरकार। सर्वाधिकार सुरक्षित।',
    footer_developed: 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) एवं सीएमपीडीआई अनुपालन आसूचना प्रकोष्ठ'
  },
  bn: {
    gov_india: 'ভারত সরকার',
    ministry_coal: 'কয়লা মন্ত্রক',
    dgms_title: 'খনি সুরক্ষা মহানির্দেশালয় (DGMS)',
    portal_system_name: 'কয়লা দৃষ্টি',
    portal_system_sub: 'কয়লা খনির জন্য স্মার্ট শাসন ও বিধিবিধান নজরদারি ব্যবস্থা',
    satyameva_jayate: 'সত্যমেব জয়তে',
    telemetry_status: 'সেন্টিনেল রাডার ২এ এবং ২বি লাইভ টেলিমেট্রি',
    toll_free_help: 'টোল-ফ্রি ডিজিএমএস হেল্পলাইন: 1800-345-MINE',
    national_portal: 'জাতীয় কয়লা পোর্টাল',
    nav_home: 'হোম',
    nav_overview: 'সারসংক্ষেপ',
    nav_portals: 'পোর্টালসমূহ',
    nav_capabilities: 'এআই প্রহরী',
    nav_basins: 'কয়লা অববাহিকা',
    nav_circulars: 'ডিজিএমএস পরিপত্র',
    nav_helpdesk: 'সহায়তা কেন্দ্র',
    nav_login: 'পোর্টাল লগইন',
    nav_dashboard: 'ড্যাশবোর্ডে যান',
    nav_logout: 'লগ আউট',
    nav_public_home: 'পাবলিক হোম',
    select_language: 'ভাষা নির্বাচন করুন',
    language_label: 'ভাষা',
    hero_statutory_badge: 'বিধিবদ্ধ খনি সুরক্ষা ও ডিজিটাল শাসন · সিএমআর ২০১৭ এবং খনি আইন ১৯৫২',
    hero_title: 'জাতীয় এআই-চালিত কয়লা খনি নজরদারি ও অনুপালন ব্যবস্থা',
    hero_subtitle: 'কয়লা মন্ত্রক, ডিজিএমএস নিয়ন্ত্রক পরিদর্শক দল এবং কোলিয়ারি ইজারাগ্রহীতাদের স্বয়ংক্রিয় উপগ্রহ নজরদারি ও রিয়েল-টাইম আইওটি ডেটা দ্বারা ক্ষমতায়ন।',
    hero_btn_explore: 'পোর্টাল ও ক্ষমতা অন্বেষণ করুন',
    hero_btn_login: 'অংশীদার পোর্টালে প্রবেশ করুন',
    hero_btn_circulars: 'সাম্প্রতিক নির্দেশনাবলী',
    gateway_title: 'অংশীদার লগইন ও প্রবেশদ্বার',
    gateway_subtitle: 'অনুমোদিত কর্মক্ষেত্র অ্যাক্সেস করতে সাইন ইন করুন',
    role_admin: 'প্রশাসন সদর',
    role_inspector: 'পরিদর্শক',
    role_mine: 'খনি ডেস্ক',
    role_admin_dept: 'কয়লা মন্ত্রক (সদর দপ্তর) · নয়াদিল্লি',
    role_inspector_dept: 'ডিজিএমএস নিয়ন্ত্রক শাখা · বিধিবদ্ধ পরিদর্শন',
    role_mine_dept: 'কোলিয়ারি অপারেটর · বিসিসিএল / ইসিএল / এনসিএল',
    label_email: 'অফিসিয়াল ইমেল / সরকারি আইডি',
    label_password: 'পাসওয়ার্ড',
    remember_id: 'আইডি মনে রাখুন',
    forgot_password: 'পাসওয়ার্ড ভুলে গেছেন?',
    btn_sign_in_prefix: 'সাইন ইন করুন -',
    btn_sign_in_suffix: 'ও কার্যকলাপে প্রবেশ করুন',
    btn_authenticating: 'কর্মকর্তা যাচাইকরণ চলছে...',
    btn_quick_demo: 'তাত্ক্ষণিক ১-ক্লিক ডেমো লগইন',
    ssl_notice: '২৫৬-বিট এসএসএল এনক্রিপ্ট করা নিরাপদ নোড',
    dedicated_login: 'ডেডিকেটেড লগইন পৃষ্ঠা →',
    active_session: 'সক্রিয় সেশন',
    continue_dashboard: 'অপারেশন ড্যাশবোর্ডে এগিয়ে যান',
    switch_officer: 'লগ আউট করুন / অ্যাকাউন্ট পরিবর্তন করুন',
    stat_mines: 'নজরদারিকৃত খনিসমূহ',
    stat_mines_sub: 'বিসিসিএল, সিসিএল, ইসিএল, এনসিএল, এসইসিএল, এমসিএল',
    stat_accuracy: 'স্যাটেলাইট নির্ভুলতা',
    stat_accuracy_sub: 'সেন্টিনেল-২ ও এসএআর উচ্চ রেজোলিউশন সত্যতা',
    stat_sensors: 'রিয়েল-টাইম গ্যাস ও ধূলিকণা ফিড',
    stat_sensors_sub: 'CH4, PM10, ব্লাস্টিং কম্পন অবিচ্ছিন্ন ডেটা',
    stat_compliance: 'খনি আইন বিধিবদ্ধ ট্র্যাকিং',
    stat_compliance_sub: 'ডিজিএমএস সিএমআর ২০১৭ রেগুলেটরি প্রোটোকল',
    portals_heading: 'অনুমোদিত স্টেকহোল্ডার পোর্টাল',
    portals_subheading: 'কয়লা মন্ত্রক, ডিজিএমএস নিয়ন্ত্রক এবং খনি কর্তৃপক্ষের জন্য সুনির্দিষ্ট কর্মপ্রবাহ।',
    portal_admin_title: 'কয়লা মন্ত্রক ও শীর্ষ প্রশাসনিক পরিষদ',
    portal_admin_role: 'কেন্দ্রীয় শাসন ও তদারকি ডেস্ক',
    portal_admin_desc: 'জাতীয় কয়লা মজুদের জন্য কেন্দ্রীয় তত্ত্বাবধান নিয়ন্ত্রণ ব্যবস্থা। রাজ্যভিত্তিক অনুপালন ও অডিট পর্যালোচনা।',
    portal_insp_title: 'ডিজিএমএস নিয়ন্ত্রক ফিল্ড পরিদর্শকদল',
    portal_insp_role: 'বিধিবদ্ধ নিয়ন্ত্রক ও অডিট শাখা',
    portal_insp_desc: 'মাঠপর্যায়ে সুরক্ষা অডিট পরিচালনা, এআই-চিহ্নিত সীমানা লঙ্ঘন তদন্ত এবং ডিজিটাল নোটিশ জারি।',
    portal_mine_title: 'কোলিয়ারি ব্যবস্থাপনা ও ইজারাগ্রহীতা পোর্টাল',
    portal_mine_role: 'কোলিয়ারি অনুপালন ও প্রতিবেদন ডেস্ক',
    portal_mine_desc: 'খনি কর্মকর্তা ও সুরক্ষা অফিসারদের জন্য দৈনিক সেন্সর ডেটা আপলোড এবং নিয়ন্ত্রক সংক্রান্ত নোটিশের উত্তর প্রদান।',
    action_open_desk: 'ডেস্ক খুলুন',
    action_search: 'অনুসন্ধান করুন...',
    action_filter: 'ফিল্টার',
    action_download: 'ডাউনলোড',
    action_submit: 'জমা দিন',
    action_cancel: 'বাতিল',
    action_close: 'বন্ধ করুন',
    action_save: 'সংরক্ষণ করুন',
    action_refresh: 'রিফ্রেশ',
    status_compliant: 'অনুপালিত',
    status_critical: 'সংকটপূর্ণ',
    status_moderate: 'মাঝারি',
    status_pending: 'পর্যালোচনাধীন',
    status_resolved: 'মীমাংসিত',
    footer_rights: 'কয়লা মন্ত্রক, ভারত সরকার। সর্বস্বত্ব সংরক্ষিত।',
    footer_developed: 'ন্যাশনাল ইনফরমেটিক্স সেন্টার (NIC) ও সিএমপিডিআই অনুপালন সেল'
  },
  or: {
    gov_india: 'ଭାରତ ସରକାର',
    ministry_coal: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ',
    dgms_title: 'ଖଣି ସୁରକ୍ଷା ମହାନିର୍ଦ୍ଦେଶାଳୟ (DGMS)',
    portal_system_name: 'କୋଇଲା ଦୃଷ୍ଟି',
    portal_system_sub: 'କୋଇଲା ଖଣି ପାଇଁ ସ୍ମାର୍ଟ ଶାସନ ଓ ଅନୁପାଳନ ଗୁଇନ୍ଦା ବ୍ୟବସ୍ଥା',
    satyameva_jayate: 'ସତ୍ୟମେବ ଜୟତେ',
    telemetry_status: 'ସେଣ୍ଟିନେଲ୍ ରାଡାର ୨ଏ ଏବଂ ୨ବି ଲାଇଭ୍ ଟେଲିମେଟ୍ରି',
    toll_free_help: 'ଟୋଲ୍-ଫ୍ରି ଡିଜିଏମ୍ଏସ୍ ହେଲ୍ପଲାଇନ୍: 1800-345-MINE',
    national_portal: 'ଜାତୀୟ କୋଇଲା ପୋର୍ଟାଲ୍',
    nav_home: 'ମୂଳପୃଷ୍ଠା',
    nav_overview: 'ଅବଲୋକନ',
    nav_portals: 'ପୋର୍ଟାଲ୍ ସମୂହ',
    nav_capabilities: 'ଏଆଇ ପ୍ରହରୀ',
    nav_basins: 'କୋଇଲା ବେସିନ୍',
    nav_circulars: 'ଡିଜିଏମ୍ଏସ୍ ପରିପତ୍ର',
    nav_helpdesk: 'ସହାୟତା କେନ୍ଦ୍ର',
    nav_login: 'ପୋର୍ଟାଲ୍ ଲଗଇନ୍',
    nav_dashboard: 'ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ',
    nav_logout: 'ଲଗ୍ ଆଉଟ୍',
    nav_public_home: 'ସାର୍ବଜନୀନ ଗୃହପୃଷ୍ଠା',
    select_language: 'ଭାଷା ବାଛନ୍ତୁ',
    language_label: 'ଭାଷା',
    hero_statutory_badge: 'ବିଧିବଦ୍ଧ ଖଣି ସୁରକ୍ଷା ଓ ଡିଜିଟାଲ୍ ପ୍ରଶାସନ · ସିଏମଆର ୨୦୧୭ ଏବଂ ଖଣି ଆଇନ ୧୯୫୨',
    hero_title: 'ଜାତୀୟ ଏଆଇ-ଚାଳିତ କୋଇଲା ଖଣି ନିରୀକ୍ଷଣ ଓ ଅନୁପାଳନ ବ୍ୟବସ୍ଥା',
    hero_subtitle: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ, ଡିଜିଏମଏସ ନିୟାମକ ଏବଂ ଖଣି ଲିଜଧାରୀମାନଙ୍କୁ ଉପଗ୍ରହ ନଜର ଓ ରିଅଲ-ଟାଇମ ସେନସର ତଥ୍ୟ ସହିତ ସଶକ୍ତ କରିବା।',
    hero_btn_explore: 'ପୋର୍ଟାଲ୍ ଓ କ୍ଷମତା ଦେଖନ୍ତୁ',
    hero_btn_login: 'ଅଂଶୀଦାର ପୋର୍ଟାଲ୍ ପ୍ରବେଶ',
    hero_btn_circulars: 'ନୂତନ ନିର୍ଦ୍ଦେଶାବଳୀ',
    gateway_title: 'ଅଂଶୀଦାର ଲଗଇନ୍ ଓ ଗେଟୱେ',
    gateway_subtitle: 'ଅଧିକୃତ କାର୍ଯ୍ୟକ୍ଷେତ୍ର ପ୍ରବେଶ ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    role_admin: 'ପ୍ରଶାସନ ମୁଖ୍ୟାଳୟ',
    role_inspector: 'ନିରୀକ୍ଷକ',
    role_mine: 'ଖଣି ଡେସ୍କ',
    role_admin_dept: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ (ମୁଖ୍ୟାଳୟ) · ନୂଆଦିଲ୍ଲୀ',
    role_inspector_dept: 'ଡିଜିଏମଏସ ନିୟାମକ ଶାଖା · ବିଧିବଦ୍ଧ ନିରୀକ୍ଷଣ',
    role_mine_dept: 'କୋଲିୟରୀ ଅପରେଟର · ଏମସିଏଲ୍ / ବିସିସିଏଲ୍ / ଇସିଏଲ୍',
    label_email: 'ଅଫିସିଆଲ୍ ଇମେଲ୍ / ସରକାରୀ ଆଇଡି',
    label_password: 'ପାସୱାର୍ଡ',
    remember_id: 'ଆଇଡି ମନେ ରଖନ୍ତୁ',
    forgot_password: 'ପାସୱାର୍ଡ ଭୁଲିଗଲେ କି?',
    btn_sign_in_prefix: 'ସାଇନ୍ ଇନ୍ କରନ୍ତୁ -',
    btn_sign_in_suffix: 'ଏବଂ କାର୍ଯ୍ୟକ୍ଷେତ୍ର ପ୍ରବେଶ',
    btn_authenticating: 'ଅଧିକାରୀ ପ୍ରମାଣୀକରଣ ଚାଲିଛି...',
    btn_quick_demo: 'ତୁରନ୍ତ ୧-କ୍ଲିକ୍ ଡେମୋ ଲଗଇନ୍',
    ssl_notice: '୨୫୬-ବିଟ୍ ଏସଏସଏଲ୍ ସୁରକ୍ଷିତ ନୋଡ୍',
    dedicated_login: 'ସମର୍ପିତ ଲଗଇନ୍ ପୃଷ୍ଠା →',
    active_session: 'ସକ୍ରିୟ ସେସନ୍',
    continue_dashboard: 'ଡ୍ୟାସବୋର୍ଡ ଜାରି ରଖନ୍ତୁ',
    switch_officer: 'ଲଗ୍ ଆଉଟ୍ / ୟୁଜର ବଦଳାନ୍ତୁ',
    stat_mines: 'ତଦାରଖ ଅଧୀନ ଖଣି',
    stat_mines_sub: 'ଏମସିଏଲ୍, ବିସିସିଏଲ୍, ସିସିଏଲ୍, ଇସିଏଲ୍, ଏନସିଏଲ୍',
    stat_accuracy: 'ସାଟେଲାଇଟ୍ ସଠିକତା',
    stat_accuracy_sub: 'ସେଣ୍ଟିନେଲ-୨ ଏବଂ ଏସଏଆର ଗ୍ରାଉଣ୍ଡ ଟ୍ରୁଥ୍',
    stat_sensors: 'ରିଅଲ-ଟାଇମ ଗ୍ୟାସ ଓ ଧୂଳିକଣା',
    stat_sensors_sub: 'CH4, PM10, ବ୍ଲାଷ୍ଟ କମ୍ପନ ତଥ୍ୟ ଫିଡ୍',
    stat_compliance: 'ଖଣି ଆଇନ ଅନୁପାଳନ ଟ୍ରାକିଂ',
    stat_compliance_sub: 'ଡିଜିଏମଏସ ସିଏମଆର ୨୦୧୭ ପ୍ରୋଟୋକଲ୍',
    portals_heading: 'ଅଧିକୃତ ଅଂଶୀଦାର ପୋର୍ଟାଲ୍',
    portals_subheading: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ, ଡିଜିଏମଏସ ନିୟାମକ ଏବଂ ଖଣି ପରିଚାଳନା ପାଇଁ ଉଦ୍ଦିଷ୍ଟ କାର୍ଯ୍ୟପ୍ରଣାଳୀ।',
    portal_admin_title: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ ଓ କାର୍ଯ୍ୟନିର୍ବାହୀ ପରିଷଦ',
    portal_admin_role: 'କେନ୍ଦ୍ରୀୟ ପ୍ରଶାସନ ଓ ତଦାରଖ ଡେସ୍କ',
    portal_admin_desc: 'ଜାତୀୟ କୋଇଲା ସମ୍ପଦ ପାଇଁ କେନ୍ଦ୍ରୀୟ ତଦାରଖ ନିୟନ୍ତ୍ରଣ। ରାଜ୍ୟସ୍ତରୀୟ ଅନୁପାଳନ ଏବଂ ଅଡିଟ୍ ସମୀକ୍ଷା।',
    portal_insp_title: 'ଡିଜିଏମଏସ ନିୟାମକ ଫିଲ୍ଡ ନିରୀକ୍ଷକଦଳ',
    portal_insp_role: 'ବିଧିବଦ୍ଧ ନିୟାମକ ଓ ଅଡିଟ୍ ଶାଖା',
    portal_insp_desc: 'କ୍ଷେତ୍ରସ୍ତରରେ ସୁରକ୍ଷା ଅଡିଟ୍ କରିବା, ଉଲ୍ଲଂଘନ ତଦନ୍ତ କରିବା ଏବଂ ଡିଜିଟାଲ୍ ନୋଟିସ୍ ଜାରି କରିବା।',
    portal_mine_title: 'ଖଣି ପରିଚାଳନା ଓ ଲିଜଧାରୀ ପୋର୍ଟାଲ୍',
    portal_mine_role: 'ଖଣି ଅନୁପାଳନ ଓ ରିପୋର୍ଟିଂ ଡେସ୍କ',
    portal_mine_desc: 'ଖଣି ଅଧିକାରୀଙ୍କ ପାଇଁ ଦୈନିକ ସେନସର ଡାଟା ଅପଲୋଡ୍ କରିବା ଏବଂ ନିୟାମକ ନୋଟିସର ଉତ୍ତର ଦେବା ପାଇଁ ପୋର୍ଟାଲ୍।',
    action_open_desk: 'ଡେସ୍କ ଖୋଲନ୍ତୁ',
    action_search: 'ଖୋଜନ୍ତୁ...',
    action_filter: 'ଫିଲ୍ଟର',
    action_download: 'ଡାଉନଲୋଡ୍',
    action_submit: 'ଦାଖଲ କରନ୍ତୁ',
    action_cancel: 'ବାତିଲ୍',
    action_close: 'ବନ୍ଦ କରନ୍ତୁ',
    action_save: 'ସଂରକ୍ଷଣ କରନ୍ତୁ',
    action_refresh: 'ତାଜା କରନ୍ତୁ',
    status_compliant: 'ଅନୁପାଳିତ',
    status_critical: 'ସଙ୍କଟଜନକ',
    status_moderate: 'ମଧ୍ୟମ',
    status_pending: 'ବିଚାରାଧୀନ',
    status_resolved: 'ସମାଧାନ ହୋଇଛି',
    footer_rights: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର। ସର୍ବସ୍ୱତ୍ୱ ସଂରକ୍ଷିତ।',
    footer_developed: 'ଜାତୀୟ ସୂଚନା ବିଜ୍ଞାନ କେନ୍ଦ୍ର (NIC) ଓ CMPDI ଅନୁପାଳନ ସେଲ୍'
  },
  mr: {
    gov_india: 'भारत सरकार',
    ministry_coal: 'कोळसा मंत्रालय',
    dgms_title: 'खाण सुरक्षा महासंचालनालय (DGMS)',
    portal_system_name: 'कोयला दृष्टी',
    portal_system_sub: 'कोळसा खाणींसाठी स्मार्ट प्रशासन व अनुपालन बुद्धिमत्ता प्रणाली',
    satyameva_jayate: 'सत्यमेव जयते',
    telemetry_status: 'सेंटिनेल रडार 2A आणि 2B थेट टेलिमेट्री',
    toll_free_help: 'टोल-फ्री डीजीएमएस हेल्पलाईन: 1800-345-MINE',
    national_portal: 'राष्ट्रीय कोळसा पोर्टल',
    nav_home: 'मुख्यपृष्ठ',
    nav_overview: 'आढावा',
    nav_portals: 'पोर्टल्स',
    nav_capabilities: 'एआय सुरक्षा',
    nav_basins: 'कोळसा खोरे',
    nav_circulars: 'डीजीएमएस परिपत्रके',
    nav_helpdesk: 'मदत केंद्र',
    nav_login: 'पोर्टल लॉगिन',
    nav_dashboard: 'डॅशबोर्डवर जा',
    nav_logout: 'लॉग आउट',
    nav_public_home: 'सार्वजनिक मुख्यपृष्ठ',
    select_language: 'भाषा निवडा',
    language_label: 'भाषा',
    hero_statutory_badge: 'वैधानिक खाण सुरक्षा आणि डिजिटल प्रशासन · सीएमआर २०१७ आणि खाण कायदा १९५२',
    hero_title: 'राष्ट्रीय एआय-सक्षम कोळसा खाण देखरेख आणि अनुपालन प्रणाली',
    hero_subtitle: 'कोळसा मंत्रालय, डीजीएमएस नियामक तपासणी पथक आणि खाण पट्टाधारकांसाठी उपग्रह सीमा देखरेख, रिअल-टाइम आयओटी टेलिमेट्री व डिजिटल ऑडिट व्यवस्था.',
    hero_btn_explore: 'पोर्टल आणि क्षमता एक्सप्लोर करा',
    hero_btn_login: 'हितधारक पोर्टलवर जा',
    hero_btn_circulars: 'नवीनतम डीजीएमएस निर्देश',
    gateway_title: 'हितधारक लॉगिन आणि गेटवे',
    gateway_subtitle: 'अधिकृत कार्यक्षेत्रात प्रवेश करण्यासाठी साइन इन करा',
    role_admin: 'प्रशासन मुख्यालय',
    role_inspector: 'निरीक्षक',
    role_mine: 'खाण डेस्क',
    role_admin_dept: 'कोळसा मंत्रालय (मुख्यालय) · नवी दिल्ली',
    role_inspector_dept: 'डीजीएमएस नियामक शाखा · वैधानिक तपासणी',
    role_mine_dept: 'कोलियरी ऑपरेटर · डब्ल्यूसीएल / बीसीसीएल / ईसीएल',
    label_email: 'अधिकृत ईमेल / सरकारी ओळख क्रमांक',
    label_password: 'पासवर्ड',
    remember_id: 'आयडी लक्षात ठेवा',
    forgot_password: 'पासवर्ड विसरलात?',
    btn_sign_in_prefix: 'साइन इन करा -',
    btn_sign_in_suffix: 'आणि कार्यप्रणालीत प्रवेश करा',
    btn_authenticating: 'अधिकारी प्रमाणीकरण सुरू आहे...',
    btn_quick_demo: 'त्वरित १-क्लिक डेमो लॉगिन',
    ssl_notice: '२५६-बिट एसएसएल सुरक्षित नोड',
    dedicated_login: 'समर्पित लॉगिन पृष्ठ →',
    active_session: 'सक्रिय सत्र',
    continue_dashboard: 'डॅशबोर्डवर पुढे जा',
    switch_officer: 'लॉग आउट / अधिकारी बदला',
    stat_mines: 'निरीक्षणाखालील खाणी',
    stat_mines_sub: 'डब्ल्यूसीएल, बीसीसीएल, सीसीएल, ईसीएल, एनसीएल, एसईसीएल',
    stat_accuracy: 'उपग्रह विसंगती अचूकता',
    stat_accuracy_sub: 'सेंटिनेल-२ आणि एसएआर उच्च रिझोल्यूशन डेटा',
    stat_sensors: 'रिअल-टाइम वायू व धूळ फीड',
    stat_sensors_sub: 'CH4, PM10, स्फोट कंपन निरंतर प्रवाह',
    stat_compliance: 'खाण कायदा वैधानिक ट्रॅकिंग',
    stat_compliance_sub: 'डीजीएमएस सीएमआर २०१७ नियामक प्रोटोकॉल',
    portals_heading: 'अधिकृत हितधारक पोर्टल्स',
    portals_subheading: 'कोळसा मंत्रालय, डीजीएमएस नियामक आणि खाण प्राधिकरणासाठी समर्पित कार्यप्रणाली.',
    portal_admin_title: 'कोळसा मंत्रालय आणि सर्वोच्च कार्यकारी परिषद',
    portal_admin_role: 'केंद्रीय प्रशासन आणि पर्यवेक्षण डेस्क',
    portal_admin_desc: 'राष्ट्रीय कोळसा साठ्यासाठी केंद्रीय पर्यवेक्षी नियंत्रण. राज्यस्तरीय अनुपालन निर्देशांक आणि ऑडिट वेळापत्रक व्यवस्थापन.',
    portal_insp_title: 'डीजीएमएस नियामक फील्ड निरीक्षणालय',
    portal_insp_role: 'वैधानिक नियामक आणि ऑडिट शाखा',
    portal_insp_desc: 'सुरक्षा ऑडिट करणे, उपग्रह अतिक्रमण तपासणे आणि डिजिटल वैधानिक नोटीस जारी करणे.',
    portal_mine_title: 'कोलियरी व्यवस्थापन आणि पट्टाधारक पोर्टल',
    portal_mine_role: 'कोलियरी अनुपालन आणि अहवाल डेस्क',
    portal_mine_desc: 'खाण व्यवस्थापक आणि सुरक्षा अधिकाऱ्यांसाठी दैनंदिन सेन्सर डेटा अपलोड करणे व नियामक नोटिसांना उत्तर देणे.',
    action_open_desk: 'डेस्क उघडा',
    action_search: 'शोधा...',
    action_filter: 'फिल्टर',
    action_download: 'डाउनलोड',
    action_submit: 'सादर करा',
    action_cancel: 'रद्द करा',
    action_close: 'बंद करा',
    action_save: 'बदल जतन करा',
    action_refresh: 'ताजे करा',
    status_compliant: 'अनुपालित',
    status_critical: 'गंभीर',
    status_moderate: 'मध्यम',
    status_pending: 'प्रलंबित पुनरावलोकन',
    status_resolved: 'निराकरण झाले',
    footer_rights: 'कोळसा मंत्रालय, भारत सरकार. सर्व हक्क राखीव.',
    footer_developed: 'राष्ट्रीय माहिती विज्ञान केंद्र (NIC) व सीएमपीडीआय अनुपालन कक्ष'
  },
  te: {
    gov_india: 'భారత ప్రభుత్వం',
    ministry_coal: 'బొగ్గు మంత్రిత్వ శాఖ',
    dgms_title: 'గనుల భద్రత డైరెక్టరేట్ జనరల్ (DGMS)',
    portal_system_name: 'కోయిలా దృష్టి',
    portal_system_sub: 'బొగ్గు గనుల కోసం స్మార్ట్ పాలన మరియు సమ్మతి ఇంటెలిజెన్స్ వ్యవస్థ',
    satyameva_jayate: 'సత్యమేవ జయతే',
    telemetry_status: 'సెంటినెల్ రాడార్ 2A & 2B ప్రత్యక్ష టెలిమెట్రీ',
    toll_free_help: 'టోల్-ఫ్రీ DGMS హెల్ప్‌లైన్: 1800-345-MINE',
    national_portal: 'జాతీయ బొగ్గు పోర్టల్',
    nav_home: 'హోమ్',
    nav_overview: 'అవలోకనం',
    nav_portals: 'పోర్టల్స్',
    nav_capabilities: 'ఏఐ భద్రత',
    nav_basins: 'బొగ్గు బేసిన్లు',
    nav_circulars: 'DGMS సర్క్యులర్లు',
    nav_helpdesk: 'సహాయ కేంద్రం',
    nav_login: 'పోర్టల్ లాగిన్',
    nav_dashboard: 'డాష్‌బోర్డ్‌కు వెళ్ళండి',
    nav_logout: 'లాగ్ అవుట్',
    nav_public_home: 'పబ్లిక్ హోమ్',
    select_language: 'భాషను ఎంచుకోండి',
    language_label: 'భాష',
    hero_statutory_badge: 'చట్టబద్ధమైన గని భద్రత & డిజిటల్ పాలన · CMR 2017 & గనుల చట్టం 1952',
    hero_title: 'జాతీయ ఏఐ-ఆధారిత బొగ్గు గనుల నిఘా మరియు సమ్మతి వ్యవస్థ',
    hero_subtitle: 'బొగ్గు మంత్రిత్వ శాఖ, డీజీఎంఎస్ నియంత్రణ పర్యవేక్షకులు మరియు గని లీజుదారులకు ఆటోమేటెడ్ శాటిలైట్ లీజు-సరిహద్దు నిఘా మరియు రియల్-టైమ్ సెన్సార్ టెలిమెట్రీ ద్వారా సాధికారత.',
    hero_btn_explore: 'పోర్టల్స్ & సామర్థ్యాలను అన్వేషించండి',
    hero_btn_login: 'స్టేక్‌హోల్డర్ పోర్టల్ ప్రవేశం',
    hero_btn_circulars: 'తాజా DGMS ఆదేశాలు',
    gateway_title: 'స్టేక్‌హోల్డర్ లాగిన్ & గేట్‌వే',
    gateway_subtitle: 'అధీకృత కార్యస్థలాన్ని ప్రాప్యత చేయడానికి సైన్ ఇన్ చేయండి',
    role_admin: 'పరిపాలనా ప్రధాన కార్యాలయం',
    role_inspector: 'ఇన్‌స్పెక్టర్',
    role_mine: 'గని డెస్క్',
    role_admin_dept: 'బొగ్గు మంత్రిత్వ శాఖ (HQ) · న్యూఢిల్లీ',
    role_inspector_dept: 'DGMS నియంత్రణ విభాగం · చట్టబద్ధమైన తనిఖీలు',
    role_mine_dept: 'కోలియరీ ఆపరేటర్లు · SCCL / BCCL / ECL',
    label_email: 'అధికారిక ఇమెయిల్ / ప్రభుత్వ ఐడీ',
    label_password: 'పాస్‌వర్డ్',
    remember_id: 'ఐడీని గుర్తుంచుకోండి',
    forgot_password: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    btn_sign_in_prefix: 'సైన్ ఇన్ చేయండి -',
    btn_sign_in_suffix: '& కార్యకలాపాలలో ప్రవేశించండి',
    btn_authenticating: 'అధికారి ధృవీకరణ కొనసాగుతోంది...',
    btn_quick_demo: 'తక్షణ 1-క్లిక్ డెమో లాగిన్',
    ssl_notice: '256-బిట్ SSL ఎన్‌క్రిప్టెడ్ సురక్షిత నోడ్',
    dedicated_login: 'ప్రత్యేక లాగిన్ పేజీ →',
    active_session: 'క్రియాశీల సెషన్',
    continue_dashboard: 'డాష్‌బోర్డ్‌లో కొనసాగండి',
    switch_officer: 'లాగ్ అవుట్ / అధికారిని మార్చండి',
    stat_mines: 'పర్యవేక్షణలోని గనులు',
    stat_mines_sub: 'SCCL, BCCL, CCL, ECL, NCL, SECL, MCL',
    stat_accuracy: 'ఉపగ్రహ ఖచ్చితత్వం',
    stat_accuracy_sub: 'సెంటినెల్-2 & SAR హై రిజల్యూషన్ డేటా',
    stat_sensors: 'రియల్-టైమ్ గ్యాస్ & డస్ట్ ఫీడ్‌లు',
    stat_sensors_sub: 'CH4, PM10, బ్లాస్ట్ వైబ్రేషన్ నిరంతర డేటా',
    stat_compliance: 'గనుల చట్టం చట్టబద్ధమైన ట్రాకింగ్',
    stat_compliance_sub: 'DGMS CMR 2017 నియంత్రణ ప్రోటోకాల్',
    portals_heading: 'అధీకృత స్టేక్‌హోల్డర్ పోర్టల్స్',
    portals_subheading: 'బొగ్గు మంత్రిత్వ శాఖ, డీజీఎంఎస్ నియంత్రకులు మరియు గని అధికారుల కోసం ప్రత్యేక కార్యాచరణ.',
    portal_admin_title: 'బొగ్గు మంత్రిత్వ శాఖ & అపెక్స్ కౌన్సిల్',
    portal_admin_role: 'కేంద్ర పాలన & పర్యవేక్షణ డెస్క్',
    portal_admin_desc: 'జాతీయ బొగ్గు నిల్వల కోసం కేంద్ర పర్యవేక్షణ నియంత్రణ. రాష్ట్రాల వారీగా సమ్మతి సూచికలు మరియు చట్టబద్ధమైన ఆడిట్‌ల నిర్వహణ.',
    portal_insp_title: 'DGMS నియంత్రణ ఫీల్డ్ ఇన్‌స్పెక్టరేట్',
    portal_insp_role: 'చట్టబద్ధమైన నియంత్రణ & ఆడిట్ విభాగం',
    portal_insp_desc: 'క్షేత్రస్థాయి భద్రతా ఆడిట్‌లు నిర్వహించడం, సరిహద్దు ఉల్లంఘనలను పరిశోధించడం మరియు డిజిటల్ చట్టపరమైన నోటీసులను జారీ చేయడం.',
    portal_mine_title: 'కోలియరీ నిర్వహణ & లీజుదారుల పోర్టల్',
    portal_mine_role: 'కోలియరీ సమ్మతి & నివేదికల డెస్క్',
    portal_mine_desc: 'గని నిర్వాహకులు రోజువారీ సెన్సార్ టెలిమెట్రీని అప్‌లోడ్ చేయడానికి మరియు నియంత్రణ నోటీసులకు ప్రతిస్పందించడానికి పోర్టల్.',
    action_open_desk: 'డెస్క్ తెరవండి',
    action_search: 'శోధించండి...',
    action_filter: 'ఫిల్టర్',
    action_download: 'డౌన్‌లోడ్',
    action_submit: 'సమర్పించండి',
    action_cancel: 'రద్దు చేయండి',
    action_close: 'మూసివేయండి',
    action_save: 'మార్పులను సేవ్ చేయండి',
    action_refresh: 'రిఫ్రెష్ చేయండి',
    status_compliant: 'సమ్మతమైనది',
    status_critical: 'క్లిష్టమైనది',
    status_moderate: 'మితమైనది',
    status_pending: 'సమీక్ష పెండింగ్‌లో ఉంది',
    status_resolved: 'పరిష్కరించబడింది',
    footer_rights: 'బొగ్గు మంత్రిత్వ శాఖ, భారత ప్రభుత్వం. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
    footer_developed: 'నేషనల్ ఇన్‌ఫర్మేటిక్స్ సెంటర్ (NIC) & CMPDI సమ్మతి విభాగం'
  }
};

/**
 * Universal phrase translation map.
 * Translates exact phrases matching rendered text in the UI (e.g. sidebar navigation,
 * table headers, status badges, buttons, cards, section titles).
 */
export const PHRASE_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  // Navigation & Sidebar
  'Dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    bn: 'ড্যাশবোর্ড',
    or: 'ଡ୍ୟାସବୋର୍ଡ',
    mr: 'डॅशबोर्ड',
    te: 'డాష్‌బోర్డ్'
  },
  'Overview': {
    en: 'Overview',
    hi: 'अवलोकन',
    bn: 'সারসংক্ষেপ',
    or: 'ଅବଲୋକନ',
    mr: 'आढावा',
    te: 'అవలోకనం'
  },
  'Operations': {
    en: 'Operations',
    hi: 'परिचालन',
    bn: 'অপারেশনসমূহ',
    or: 'ପରିଚାଳନା',
    mr: 'ऑपरेशन्स',
    te: 'కార్యకలాపాలు'
  },
  'Administration': {
    en: 'Administration',
    hi: 'प्रशासन',
    bn: 'প্রশাসন',
    or: 'ପ୍ରଶାସନ',
    mr: 'प्रशासन',
    te: 'పరిపాలన'
  },
  'Inspector Workspace': {
    en: 'Inspector Workspace',
    hi: 'निरीक्षक कार्यक्षेत्र',
    bn: 'পরিদর্শক কর্মক্ষেত্র',
    or: 'ନିରୀକ୍ଷକ କାର୍ଯ୍ୟକ୍ଷେତ୍ର',
    mr: 'निरीक्षक कार्यक्षेत्र',
    te: 'ఇన్‌స్పెక్టర్ వర్క్‌స్పేస్'
  },
  'Case Management': {
    en: 'Case Management',
    hi: 'प्रकरण प्रबंधन',
    bn: 'কেস ব্যবস্থাপনা',
    or: 'କେସ୍ ପରିଚାଳନା',
    mr: 'प्रकरण व्यवस्थापन',
    te: 'కేసు నిర్వహణ'
  },
  'Account': {
    en: 'Account',
    hi: 'खाता',
    bn: 'অ্যাকাউন্ট',
    or: 'ଖାତା',
    mr: 'खाते',
    te: 'ఖాతా'
  },
  'Mine Workspace': {
    en: 'Mine Workspace',
    hi: 'खदान कार्यक्षेत्र',
    bn: 'খনি কর্মক্ষেত্র',
    or: 'ଖଣି କାର୍ଯ୍ୟକ୍ଷେତ୍ର',
    mr: 'खाण कार्यक्षेत्र',
    te: 'గని వర్క్‌స్పేస్'
  },
  'Mines Overview': {
    en: 'Mines Overview',
    hi: 'खदान अवलोकन',
    bn: 'খনি সারসংক্ষেপ',
    or: 'ଖଣି ଅବଲୋକନ',
    mr: 'खाणींचा आढावा',
    te: 'గనుల అవలోకనం'
  },
  'Compliance Monitoring': {
    en: 'Compliance Monitoring',
    hi: 'अनुपालन निगरानी',
    bn: 'অনুপালন নজরদারি',
    or: 'ଅନୁପାଳନ ନିରୀକ୍ଷଣ',
    mr: 'अनुपालन देखरेख',
    te: 'సమ్మతి పర్యవేక్షణ'
  },
  'AI Alerts': {
    en: 'AI Alerts',
    hi: 'एआई अलर्ट्स',
    bn: 'এআই অ্যালার্ট',
    or: 'ଏଆଇ ସତର୍କତା',
    mr: 'एआय अलर्ट्स',
    te: 'ఏఐ హెచ్చరికలు'
  },
  'Inspection Management': {
    en: 'Inspection Management',
    hi: 'निरीक्षण प्रबंधन',
    bn: 'পরিদর্শন ব্যবস্থাপনা',
    or: 'ନିରୀକ୍ଷଣ ପରିଚାଳନା',
    mr: 'तपासणी व्यवस्थापन',
    te: 'తనిఖీ నిర్వహణ'
  },
  'Reports & Analytics': {
    en: 'Reports & Analytics',
    hi: 'रिपोर्ट्स एवं विश्लेषण',
    bn: 'প্রতিবেদন ও বিশ্লেষণ',
    or: 'ରିପୋର୍ଟ ଓ ବିଶ୍ଳେଷଣ',
    mr: 'अहवाल आणि विश्लेषण',
    te: 'నివేదికలు & విశ్లేషణలు'
  },
  'Expert Management': {
    en: 'Expert Management',
    hi: 'विशेषज्ञ प्रबंधन',
    bn: 'বিশেষজ্ঞ ব্যবস্থাপনা',
    or: 'ବିଶେଷଜ୍ଞ ପରିଚାଳନା',
    mr: 'तज्ज्ञ व्यवस्थापन',
    te: 'నిపుణుల నిర్వహణ'
  },
  'Notifications': {
    en: 'Notifications',
    hi: 'सूचनाएं',
    bn: 'বিজ্ঞপ্তিসমূহ',
    or: 'ବିଜ୍ଞପ୍ତି',
    mr: 'सूचना',
    te: 'నోటిఫికేషన్‌లు'
  },
  'User Management': {
    en: 'User Management',
    hi: 'उपयोगकर्ता प्रबंधन',
    bn: 'ব্যবহারকারী ব্যবস্থাপনা',
    or: 'ଉପଭୋକ୍ତା ପରିଚାଳନା',
    mr: 'वापरकर्ता व्यवस्थापन',
    te: 'వినియోగదారు నిర్వహణ'
  },
  'Settings': {
    en: 'Settings',
    hi: 'सेटिंग्स',
    bn: 'সেটিংস',
    or: 'ସେଟିଙ୍ଗ୍ସ',
    mr: 'सेटिंग्ज',
    te: 'సెట్టింగ్‌లు'
  },
  'Assigned Mines': {
    en: 'Assigned Mines',
    hi: 'आवंटित खदानें',
    bn: 'বরাদ্দকৃত খনিসমূহ',
    or: 'ଆବଣ୍ଟିତ ଖଣି',
    mr: 'नियुक्त खाणी',
    te: 'కేటాయించిన గనులు'
  },
  'Inspections': {
    en: 'Inspections',
    hi: 'निरीक्षण',
    bn: 'পরিদর্শনসমূহ',
    or: 'ନିରୀକ୍ଷଣ',
    mr: 'तपासण्या',
    te: 'తనిఖీలు'
  },
  'Violations': {
    en: 'Violations',
    hi: 'उल्लंघन',
    bn: 'লঙ্ঘনসমূহ',
    or: 'ଉଲ୍ଲଂଘନ',
    mr: 'उल्लंघने',
    te: 'ఉల్లంఘనలు'
  },
  'Corrective Actions': {
    en: 'Corrective Actions',
    hi: 'सुधारात्मक कार्रवाइयां',
    bn: 'সংশোধনমূলক পদক্ষেপ',
    or: 'ସଂଶୋଧନମୂଳକ ପଦକ୍ଷେପ',
    mr: 'सुधारात्मक कृती',
    te: 'దిద్దుబాటు చర్యలు'
  },
  'Evidence & Documents': {
    en: 'Evidence & Documents',
    hi: 'साक्ष्य एवं दस्तावेज़',
    bn: 'প্রমাণ ও নথিপত্র',
    or: 'ପ୍ରମାଣ ଓ ଦସ୍ତାବିଜ',
    mr: 'पुरावे आणि कागदपत्रे',
    te: 'సాక్ష్యాలు & పత్రాలు'
  },
  'Reports': {
    en: 'Reports',
    hi: 'रिपोर्ट्स',
    bn: 'প্রতিবেদন',
    or: 'ରିପୋର୍ଟ',
    mr: 'अहवाल',
    te: 'నివేదికలు'
  },
  'My Profile': {
    en: 'My Profile',
    hi: 'मेरी प्रोफ़ाइल',
    bn: 'আমার প্রোফাইল',
    or: 'ମୋର ପ୍ରୋଫାଇଲ୍',
    mr: 'माझे प्रोफाइल',
    te: 'నా ప్రొఫైల్'
  },
  'Mine Profile': {
    en: 'Mine Profile',
    hi: 'खदान प्रोफ़ाइल',
    bn: 'খনি প্রোফাইল',
    or: 'ଖଣି ପ୍ରୋଫାଇଲ୍',
    mr: 'खाण प्रोफाइल',
    te: 'గని ప్రొఫైల్'
  },
  'Submit Data': {
    en: 'Submit Data',
    hi: 'डेटा जमा करें',
    bn: 'তথ্য জমা দিন',
    or: 'ତଥ୍ୟ ଦାଖଲ କରନ୍ତୁ',
    mr: 'माहिती सादर करा',
    te: 'డేటా సమర్పించండి'
  },
  'Compliance Status': {
    en: 'Compliance Status',
    hi: 'अनुपालन स्थिति',
    bn: 'অনুপালন স্থিতি',
    or: 'ଅନୁପାଳନ ସ୍ଥିତି',
    mr: 'अनुपालन स्थिती',
    te: 'సమ్మతి స్థితి'
  },
  'Documents': {
    en: 'Documents',
    hi: 'दस्तावेज़',
    bn: 'নথিপত্র',
    or: 'ଦସ୍ତାବିଜ',
    mr: 'कागदपत्रे',
    te: 'పత్రాలు'
  },
  'Help & Support': {
    en: 'Help & Support',
    hi: 'सहायता एवं समर्थन',
    bn: 'সাহায্য ও সমর্থন',
    or: 'ସହାୟତା ଓ ସମର୍ଥନ',
    mr: 'मदत आणि सहाय्य',
    te: 'సహాయం & మద్దతు'
  },

  // Portal Subtitles
  'Government Control Portal': {
    en: 'Government Control Portal',
    hi: 'सरकारी नियंत्रण पोर्टल',
    bn: 'সরকারি নিয়ন্ত্রণ পোর্টাল',
    or: 'ସରକାରୀ ନିୟନ୍ତ୍ରଣ ପୋର୍ଟାଲ୍',
    mr: 'शासकीय नियंत्रण पोर्टल',
    te: 'ప్రభుత్వ నియంత్రణ పోర్టల్'
  },
  'Inspector Operations Portal': {
    en: 'Inspector Operations Portal',
    hi: 'निरीक्षक परिचालन पोर्टल',
    bn: 'পরিদর্শক অপারেশন পোর্টাল',
    or: 'ନିରୀକ୍ଷକ ପରିଚାଳନା ପୋର୍ଟାଲ୍',
    mr: 'निरीक्षक कार्य पोर्टल',
    te: 'ఇన్‌స్పెక్టర్ కార్యాచరణ పోర్టల్'
  },
  'Mine Authority Portal': {
    en: 'Mine Authority Portal',
    hi: 'खदान प्राधिकरण पोर्टल',
    bn: 'খনি কর্তৃপক্ষ পোর্টাল',
    or: 'ଖଣି ପ୍ରାଧିକରଣ ପୋର୍ଟାଲ୍',
    mr: 'खाण प्राधिकरण पोर्टल',
    te: 'గని అథారిటీ పోర్టల్'
  },
  'Safer Mines. Stronger India.': {
    en: 'Safer Mines. Stronger India.',
    hi: 'सुरक्षित खदानें. सशक्त भारत.',
    bn: 'নিরাপদ খনি. শক্তিশালী ভারত.',
    or: 'ସୁରକ୍ଷିତ ଖଣି. ସଶକ୍ତ ଭାରତ.',
    mr: 'सुरक्षित खाणी. सशक्त भारत.',
    te: 'సురక్షితమైన గనులు. బలమైన భారతదేశం.'
  },
  'Field Intelligence & Inspection': {
    en: 'Field Intelligence & Inspection',
    hi: 'क्षेत्रीय आसूचना एवं निरीक्षण',
    bn: 'মাঠপর্যায়ের গোয়েন্দা ও পরিদর্শন',
    or: 'କ୍ଷେତ୍ରସ୍ତରୀୟ ଗୁଇନ୍ଦା ଓ ନିରୀକ୍ଷଣ',
    mr: 'क्षेत्रीय बुद्धिमत्ता आणि तपासणी',
    te: 'ఫీల్డ్ ఇంటెలిజెన్స్ & తనిఖీ'
  },
  'Operate Safely. Stay Compliant.': {
    en: 'Operate Safely. Stay Compliant.',
    hi: 'सुरक्षा से कार्य करें. अनुपालित रहें.',
    bn: 'নিরাপদে কাজ করুন. অনুপালন বজায় রাখুন.',
    or: 'ସୁରକ୍ଷିତ ଭାବେ କାର୍ଯ୍ୟ କରନ୍ତୁ. ଅନୁପାଳନ ବଜାୟ ରଖନ୍ତୁ.',
    mr: 'सुरक्षितपणे काम करा. अनुपालन राखा.',
    te: 'సురక్షితంగా పనిచేయండి. సమ్మతితో ఉండండి.'
  },
  'View Public Home Page': {
    en: 'View Public Home Page',
    hi: 'सार्वजनिक मुख्यपृष्ठ देखें',
    bn: 'পাবলিক হোম পেজ দেখুন',
    or: 'ସାର୍ବଜନୀନ ଗୃହପୃଷ୍ଠା ଦେଖନ୍ତୁ',
    mr: 'सार्वजनिक मुख्यपृष्ठ पहा',
    te: 'పబ్లిక్ హోమ్ పేజీని వీక్షించండి'
  },
  '← View Public Home Page': {
    en: '← View Public Home Page',
    hi: '← सार्वजनिक मुख्यपृष्ठ देखें',
    bn: '← পাবলিক হোম পেজ দেখুন',
    or: '← ସାର୍ବଜନୀନ ଗୃହପୃଷ୍ଠା ଦେଖନ୍ତୁ',
    mr: '← सार्वजनिक मुख्यपृष्ठ पहा',
    te: '← పబ్లిక్ హోమ్ పేజీని వీక్షించండి'
  },

  // Topbar Phrases
  'Government Admin': {
    en: 'Government Admin',
    hi: 'सरकारी प्रशासक',
    bn: 'সরকারি প্রশাসক',
    or: 'ସରକାରୀ ପ୍ରଶାସକ',
    mr: 'शासकीय प्रशासक',
    te: 'ప్రభుత్వ అడ్మిన్'
  },
  'Government Inspector': {
    en: 'Government Inspector',
    hi: 'सरकारी निरीक्षक',
    bn: 'সরকারি পরিদর্শক',
    or: 'ସରକାରୀ ନିରୀକ୍ଷକ',
    mr: 'शासकीय निरीक्षक',
    te: 'ప్రభుత్వ ఇన్‌స్పెక్టర్'
  },
  'Mine Authority': {
    en: 'Mine Authority',
    hi: 'खदान प्राधिकरण',
    bn: 'খনি কর্তৃপক্ষ',
    or: 'ଖଣି ପ୍ରାଧିକରଣ',
    mr: 'खाण प्राधिकरण',
    te: 'గని అథారిటీ'
  },
  'Ministry governance & analytics': {
    en: 'Ministry governance & analytics',
    hi: 'मंत्रालय शासन एवं विश्लेषण',
    bn: 'মন্ত্রকের শাসন ও বিশ্লেষণ',
    or: 'ମନ୍ତ୍ରଣାଳୟ ପ୍ରଶାସନ ଓ ବିଶ୍ଳେଷଣ',
    mr: 'मंत्रालय प्रशासन आणि विश्लेषण',
    te: 'మంత్రిత్వ శాఖ పాలన & విశ్లేషణ'
  },
  'Field verification & violations': {
    en: 'Field verification & violations',
    hi: 'क्षेत्रीय सत्यापन एवं उल्लंघन',
    bn: 'মাঠপর্যায়ের যাচাইকরণ ও লঙ্ঘন',
    or: 'କ୍ଷେତ୍ରସ୍ତରୀୟ ଯାଞ୍ଚ ଓ ଉଲ୍ଲଂଘନ',
    mr: 'क्षेत्रीय पडताळणी आणि उल्लंघने',
    te: 'ఫీల్డ్ ధృవీకరణ & ఉల్లంఘనలు'
  },
  'Data submission & corrective actions': {
    en: 'Data submission & corrective actions',
    hi: 'डेटा प्रस्तुतीकरण एवं सुधारात्मक कार्रवाइयां',
    bn: 'তথ্য জমা এবং সংশোধনমূলক ব্যবস্থা',
    or: 'ତଥ୍ୟ ଦାଖଲ ଏବଂ ସଂଶୋଧନମୂଳକ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ',
    mr: 'माहिती सादरीकरण आणि सुधारात्मक कृती',
    te: 'డేటా సమర్పణ & దిద్దుబాటు చర్యలు'
  },
  'Select Active Portal View': {
    en: 'Select Active Portal View',
    hi: 'सक्रिय पोर्टल दृश्य चुनें',
    bn: 'সক্রিয় পোর্টাল ভিউ নির্বাচন করুন',
    or: 'ସକ୍ରିୟ ପୋର୍ଟାଲ୍ ଦୃଶ୍ୟ ଚୟନ କରନ୍ତୁ',
    mr: 'सक्रिय पोर्टल दृश्य निवडा',
    te: 'క్రియాశీల పోర్టల్ వీక్షణను ఎంచుకోండి'
  },
  'Search mine records, violations, inspections, alerts...': {
    en: 'Search mine records, violations, inspections, alerts...',
    hi: 'खदान रिकॉर्ड, उल्लंघन, निरीक्षण, अलर्ट खोजें...',
    bn: 'খনি রেকর্ড, লঙ্ঘন, পরিদর্শন, সতর্কবার্তা খুঁজুন...',
    or: 'ଖଣି ରେକର୍ଡ, ଉଲ୍ଲଂଘନ, ନିରୀକ୍ଷଣ, ସତର୍କତା ଖୋଜନ୍ତୁ...',
    mr: 'खाण नोंदी, उल्लंघने, तपासण्या, सूचना शोधा...',
    te: 'గని రికార్డులు, ఉల్లంఘనలు, తనిఖీలు, హెచ్చరికలను శోధించండి...'
  },
  'Public Landing Portal': {
    en: 'Public Landing Portal',
    hi: 'सार्वजनिक लैंडिंग पोर्टल',
    bn: 'পাবলিক ল্যান্ডিং পোর্টাল',
    or: 'ସାର୍ବଜନୀନ ପୋର୍ଟାଲ୍',
    mr: 'सार्वजनिक लँडिंग पोर्टल',
    te: 'పబ్లిక్ ల్యాండింగ్ పోర్టల్'
  },
  'Account Details & Security': {
    en: 'Account Details & Security',
    hi: 'खाता विवरण एवं सुरक्षा',
    bn: 'অ্যাকাউন্টের বিবরণ ও নিরাপত্তা',
    or: 'ଖାତା ବିବରଣୀ ଓ ସୁରକ୍ଷା',
    mr: 'खाते तपशील आणि सुरक्षा',
    te: 'ఖాతా వివరాలు & భద్రత'
  },
  'Sign Out of Portal': {
    en: 'Sign Out of Portal',
    hi: 'पोर्टल से लॉग आउट करें',
    bn: 'পোর্টাল থেকে সাইন আউট করুন',
    or: 'ପୋର୍ଟାଲରୁ ସାଇନ୍ ଆଉଟ୍ କରନ୍ତୁ',
    mr: 'पोर्टलमधून साइन आउट करा',
    te: 'పోర్టల్ నుండి సైన్ అవుట్ చేయండి'
  },

  // Common UI Actions & Table Headers
  'Status': {
    en: 'Status',
    hi: 'स्थिति',
    bn: 'অবস্থা',
    or: 'ସ୍ଥିତି',
    mr: 'स्थिती',
    te: 'స్థితి'
  },
  'Actions': {
    en: 'Actions',
    hi: 'कार्रवाइयां',
    bn: 'পদক্ষেপ',
    or: 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ',
    mr: 'कृती',
    te: 'చర్యలు'
  },
  'Mine Name': {
    en: 'Mine Name',
    hi: 'खदान का नाम',
    bn: 'খনির নাম',
    or: 'ଖଣିର ନାମ',
    mr: 'खाणीचे नाव',
    te: 'గని పేరు'
  },
  'Location': {
    en: 'Location',
    hi: 'स्थान',
    bn: 'অবস্থান',
    or: 'ସ୍ଥାନ',
    mr: 'स्थान',
    te: 'ప్రాంతం'
  },
  'State': {
    en: 'State',
    hi: 'राज्य',
    bn: 'রাজ্য',
    or: 'ରାଜ୍ୟ',
    mr: 'राज्य',
    te: 'రాష్ట్రం'
  },
  'Operator': {
    en: 'Operator',
    hi: 'ऑपरेटर',
    bn: 'অপারেটর',
    or: 'ଅପରେଟର',
    mr: 'ऑपरेटर',
    te: 'ఆపరేటర్'
  },
  'Risk Level': {
    en: 'Risk Level',
    hi: 'जोखिम स्तर',
    bn: 'ঝুঁকির মাত্রা',
    or: 'ବିପଦ ସ୍ତର',
    mr: 'धोक्याची पातळी',
    te: 'ప్రమాద స్థాయి'
  },
  'Last Inspected': {
    en: 'Last Inspected',
    hi: 'अंतिम निरीक्षण',
    bn: 'সর্বশেষ পরিদর্শন',
    or: 'ଶେଷ ନିରୀକ୍ଷଣ',
    mr: 'शेवटची तपासणी',
    te: 'చివరిగా తనిఖీ చేయబడింది'
  },
  'Compliant': {
    en: 'Compliant',
    hi: 'अनुपालित',
    bn: 'অনুপালিত',
    or: 'ଅନୁପାଳିତ',
    mr: 'अनुपालित',
    te: 'సమ్మతమైనది'
  },
  'Non-Compliant': {
    en: 'Non-Compliant',
    hi: 'गैर-अनुपालित',
    bn: 'অনুপালনহীন',
    or: 'ଅଣ-ଅନୁପାଳିତ',
    mr: 'गैर-अनुपालित',
    te: 'సమ్మతి లేనిది'
  },
  'Critical': {
    en: 'Critical',
    hi: 'गंभीर',
    bn: 'সংকটপূর্ণ',
    or: 'ସଙ୍କଟଜନକ',
    mr: 'गंभीर',
    te: 'క్లిష్టమైనది'
  },
  'Moderate': {
    en: 'Moderate',
    hi: 'मध्यम',
    bn: 'মাঝারি',
    or: 'ମଧ୍ୟମ',
    mr: 'मध्यम',
    te: 'మితమైనది'
  },
  'Low Risk': {
    en: 'Low Risk',
    hi: 'कम जोखिम',
    bn: 'কম ঝুঁকি',
    or: 'କମ୍ ବିପଦ',
    mr: 'कमी धोका',
    te: 'తక్కువ ప్రమాదం'
  },
  'High Risk': {
    en: 'High Risk',
    hi: 'उच्च जोखिम',
    bn: 'উচ্চ ঝুঁকি',
    or: 'ଉଚ୍ଚ ବିପଦ',
    mr: 'जास्त धोका',
    te: 'అధిక ప్రమాదం'
  },
  'Pending': {
    en: 'Pending',
    hi: 'लंबित',
    bn: 'মুলতুবি',
    or: 'ବିଚାରାଧୀନ',
    mr: 'प्रलंबित',
    te: 'పెండింగ్‌లో ఉంది'
  },
  'Resolved': {
    en: 'Resolved',
    hi: 'समाधान हुआ',
    bn: 'সমাধান হয়েছে',
    or: 'ସମାଧାନ ହୋଇଛି',
    mr: 'निराकरण झाले',
    te: 'పరిష్కరించబడింది'
  },
  'In Progress': {
    en: 'In Progress',
    hi: 'प्रगति में',
    bn: 'চলমান',
    or: 'ପ୍ରଗତିରେ ଅଛି',
    mr: 'प्रगतीपथावर',
    te: 'పురోగతిలో ఉంది'
  },
  'Approved': {
    en: 'Approved',
    hi: 'स्वीकृत',
    bn: 'অনুমোদিত',
    or: 'ଅନୁମୋଦିତ',
    mr: 'मंजूर',
    te: 'ఆమోదించబడింది'
  },
  'Under Review': {
    en: 'Under Review',
    hi: 'समीक्षाधीन',
    bn: 'পর্যালোচনাধীন',
    or: 'ସମୀକ୍ଷାଧୀନ',
    mr: 'पुनरावलोकनाधीन',
    te: 'సమీక్షలో ఉంది'
  },
  'View Details': {
    en: 'View Details',
    hi: 'विवरण देखें',
    bn: 'বিস্তারিত দেখুন',
    or: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
    mr: 'तपशील पहा',
    te: 'వివరాలను చూడండి'
  },
  'Export CSV': {
    en: 'Export CSV',
    hi: 'सीएसवी निर्यात करें',
    bn: 'সিএসভি এক্সপোর্ট',
    or: 'CSV ରପ୍ତାନି',
    mr: 'सीएसव्ही निर्यात',
    te: 'CSV ఎగుమతి'
  },
  'Download Report': {
    en: 'Download Report',
    hi: 'रिपोर्ट डाउनलोड करें',
    bn: 'প্রতিবেদন ডাউনলোড',
    or: 'ରିପୋର୍ଟ ଡାଉନଲୋଡ୍',
    mr: 'अहवाल डाउनलोड करा',
    te: 'నివేదికను డౌన్‌లోడ్ చేయండి'
  },
  'Apply Filters': {
    en: 'Apply Filters',
    hi: 'फ़िल्टर लागू करें',
    bn: 'ফিল্টার প্রয়োগ করুন',
    or: 'ଫିଲ୍ଟର ପ୍ରୟୋଗ କରନ୍ତୁ',
    mr: 'फिल्टर लागू करा',
    te: 'ఫిల్టర్‌లను వర్తింపజేయండి'
  },
  'Reset': {
    en: 'Reset',
    hi: 'रीसेट करें',
    bn: 'রিসেট',
    or: 'ରିସେଟ୍',
    mr: 'रीसेट करा',
    te: 'రీసెట్ చేయండి'
  },
  'Close': {
    en: 'Close',
    hi: 'बंद करें',
    bn: 'বন্ধ করুন',
    or: 'ବନ୍ଦ କରନ୍ତୁ',
    mr: 'बंद करा',
    te: 'మూసివేయండి'
  },
  'Save': {
    en: 'Save',
    hi: 'सहेजें',
    bn: 'সংরক্ষণ',
    or: 'ସଂରକ୍ଷଣ',
    mr: 'जतन करा',
    te: 'సేవ్ చేయండి'
  },
  'Cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    bn: 'বাতিল',
    or: 'ବାତିଲ୍',
    mr: 'रद्द करा',
    te: 'రద్దు చేయండి'
  },
  'Submit': {
    en: 'Submit',
    hi: 'जमा करें',
    bn: 'জমা দিন',
    or: 'ଦାଖଲ କରନ୍ତୁ',
    mr: 'सादर करा',
    te: 'సమర్పించండి'
  },

  // Homepage Sections & Cards
  'Three Distinct Statutory Operational Workspaces': {
    en: 'Three Distinct Statutory Operational Workspaces',
    hi: 'तीन विशिष्ट सांविधिक परिचालन कार्यक्षेत्र',
    bn: 'তিনটি স্বতন্ত্র সংবিধিবদ্ধ অপারেশনাল ওয়ার্কস্পেস',
    or: 'ତିନୋଟି ସ୍ୱତନ୍ତ୍ର ବିଧିବଦ୍ଧ କାର୍ଯ୍ୟକ୍ଷେତ୍ର',
    mr: 'तीन स्वतंत्र वैधानिक कार्यक्षेत्रे',
    te: 'మూడు ప్రత్యేక చట్టబద్ధమైన కార్యాచరణ వర్క్‌స్పేస్‌లు'
  },
  'Role-Based Governance Modules': {
    en: 'Role-Based Governance Modules',
    hi: 'भूमिका-आधारित शासन मॉड्यूल',
    bn: 'ভূমিকা-ভিত্তিক শাসন মডিউল',
    or: 'ଭୂମିକା-ଆଧାରିତ ଶାସନ ମଡ୍ୟୁଲ୍',
    mr: 'भूमिका-आधारित प्रशासन मॉड्यूल्स',
    te: 'పాత్ర ఆధారిత పాలన మాడ్యూల్స్'
  },
  'Core Technical Capabilities': {
    en: 'Core Technical Capabilities',
    hi: 'प्रमुख तकनीकी क्षमताएं',
    bn: 'প্রধান প্রযুক্তিগত ক্ষমতা',
    or: 'ମୁଖ୍ୟ ବୈଷୟିକ କ୍ଷମତା',
    mr: 'प्रमुख तांत्रिक क्षमता',
    te: 'ప్రధాన సాంకేతిక సామర్థ్యాలు'
  },
  'Advanced AI & Satellite Surveillance Architecture': {
    en: 'Advanced AI & Satellite Surveillance Architecture',
    hi: 'उन्नत एआई एवं उपग्रह निगरानी संरचना',
    bn: 'উন্নত এআই ও স্যাটেলাইট নজরদারি আর্কিটেকচার',
    or: 'ଉନ୍ନତ ଏଆଇ ଓ ଉପଗ୍ରହ ନିରୀକ୍ଷଣ ବ୍ୟବସ୍ଥା',
    mr: 'प्रगत एआय आणि उपग्रह देखरेख आर्किटेक्चर',
    te: 'అధునాతన ఏఐ & శాటిలైట్ నిఘా ఆర్కిటెక్చర్'
  },
  'Major Coal Basins of India': {
    en: 'Major Coal Basins of India',
    hi: 'भारत के प्रमुख कोयला बेसिन',
    bn: 'ভারতের প্রধান কয়লা অববাহিকা',
    or: 'ଭାରତର ପ୍ରମୁଖ କୋଇଲା ବେସିନ୍',
    mr: 'भारतातील प्रमुख कोळसा खोरी',
    te: 'భారతదేశంలోని ప్రధాన బొగ్గు బేసిన్లు'
  },
  'National Coal Production & Mining Districts': {
    en: 'National Coal Production & Mining Districts',
    hi: 'राष्ट्रीय कोयला उत्पादन एवं खनन जिले',
    bn: 'জাতীয় কয়লা উৎপাদন ও খনন জেলাসমূহ',
    or: 'ଜାତୀୟ କୋଇଲା ଉତ୍ପାଦନ ଓ ଖଣନ ଜିଲ୍ଲା',
    mr: 'राष्ट्रीय कोळसा उत्पादन आणि खाण जिल्हे',
    te: 'జాతీయ బొగ్గు ఉత్పత్తి & మైనింగ్ జిల్లాలు'
  },
  'Statutory Guidelines & Technical Circulars': {
    en: 'Statutory Guidelines & Technical Circulars',
    hi: 'सांविधिक दिशानिर्देश एवं तकनीकी परिपत्र',
    bn: 'সংবিধিবদ্ধ নির্দেশিকা ও প্রযুক্তিগত সার্কুলার',
    or: 'ବିଧିବଦ୍ଧ ନିର୍ଦ୍ଦେଶାବଳୀ ଓ ବୈଷୟିକ ପରିପତ୍ର',
    mr: 'वैधानिक मार्गदर्शक तत्त्वे आणि तांत्रिक परिपत्रके',
    te: 'చట్టబద్ధమైన మార్గదర్శకాలు & సాంకేతిక సర్క్యులర్లు'
  },
  'Need Assistance with Portal Access or Compliance Submissions?': {
    en: 'Need Assistance with Portal Access or Compliance Submissions?',
    hi: 'पोर्टल एक्सेस या अनुपालन सबमिशन में सहायता चाहिए?',
    bn: 'পোর্টাল অ্যাক্সেস বা অনুপালন জমাদানে সহায়তা প্রয়োজন?',
    or: 'ପୋର୍ଟାଲ୍ ପ୍ରବେଶ କିମ୍ବା ଅନୁପାଳନ ଦାଖଲରେ ସହାୟତା ଆବଶ୍ୟକ କି?',
    mr: 'पोर्टल ॲक्सेस किंवा अनुपालन सबमिशनमध्ये मदत हवी आहे का?',
    te: 'పోర్టల్ యాక్సెస్ లేదా సమ్మతి సమర్పణలలో సహాయం కావాలా?'
  },
  'National Mine Governance Helpdesk & Technical Support': {
    en: 'National Mine Governance Helpdesk & Technical Support',
    hi: 'राष्ट्रीय खदान शासन हेल्पडेस्क एवं तकनीकी सहायता',
    bn: 'জাতীয় খনি শাসন হেল্পডেস্ক ও প্রযুক্তিগত সহায়তা',
    or: 'ଜାତୀୟ ଖଣି ଶାସନ ହେଲ୍ପଡେସ୍କ ଓ ବୈଷୟିକ ସହାୟତା',
    mr: 'राष्ट्रीय खाण प्रशासन हेल्पडेस्क आणि तांत्रिक सहाय्य',
    te: 'జాతీయ గనుల పాలన హెల్ప్‌డెస్క్ & సాంకేతిక మద్దతు'
  },
  'Emergency Mine Control Hotline': {
    en: 'Emergency Mine Control Hotline',
    hi: 'आपातकालीन खदान नियंत्रण हॉटलाइन',
    bn: 'জরুরী খনি নিয়ন্ত্রণ হটলাইন',
    or: 'ଜରୁରୀକାଳୀନ ଖଣି ନିୟନ୍ତ୍ରଣ ହଟଲାଇନ୍',
    mr: 'आपत्कालीन खाण नियंत्रण हॉटलाईन',
    te: 'అత్యవసర గని నియంత్రణ హాట్‌లైన్'
  },
  'Email Support': {
    en: 'Email Support',
    hi: 'ईमेल सहायता',
    bn: 'ইমেল সহায়তা',
    or: 'ଇମେଲ୍ ସହାୟତା',
    mr: 'ईमेल समर्थन',
    te: 'ఇమెయిల్ మద్దతు'
  },
  'Headquarters': {
    en: 'Headquarters',
    hi: 'मुख्यालय',
    bn: 'সদর দপ্তর',
    or: 'ମୁଖ୍ୟାଳୟ',
    mr: 'मुख्यालय',
    te: 'ప్రధాన కార్యాలయం'
  },
  'Working Hours': {
    en: 'Working Hours',
    hi: 'कार्य समय',
    bn: 'কাজের সময়',
    or: 'କାର୍ଯ୍ୟ ସମୟ',
    mr: 'कामाचे तास',
    te: 'పని వేళలు'
  },
  'Quick Links': {
    en: 'Quick Links',
    hi: 'त्वरित लिंक',
    bn: 'দ্রুত লিংক',
    or: 'ଦ୍ରୁତ ଲିଙ୍କ୍',
    mr: 'जलद दुवे',
    te: 'శీఘ్ర లింకులు'
  },
  'Contact & Grievance': {
    en: 'Contact & Grievance',
    hi: 'संपर्क एवं शिकायत',
    bn: 'যোগাযোগ ও অভিযোগ',
    or: 'ଯୋଗାଯୋଗ ଓ ଅଭିଯୋଗ',
    mr: 'संपर्क आणि तक्रार',
    te: 'సంప్రదింపులు & ఫిర్యాదులు'
  },
  'Legal & Policy': {
    en: 'Legal & Policy',
    hi: 'कानूनी एवं नीति',
    bn: 'আইনি ও নীতি',
    or: 'ଆଇନଗତ ଓ ନୀତି',
    mr: 'कायदेशीर आणि धोरण',
    te: 'చట్టపరమైన & విధానం'
  },
  'Privacy Policy': {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति',
    bn: 'গোপনীয়তা নীতি',
    or: 'ଗୋପନୀୟତା ନୀତି',
    mr: 'गोपनीयता धोरण',
    te: 'గోప్యతా విధానం'
  },
  'Terms of Service': {
    en: 'Terms of Service',
    hi: 'सेवा की शर्तें',
    bn: 'পরিষেবার শর্তাবলী',
    or: 'ସେବା ସର୍ତ୍ତାବଳୀ',
    mr: 'सेवा अटी',
    te: 'సేవా నిబంధనలు'
  },
  'Copyright Policy': {
    en: 'Copyright Policy',
    hi: 'कॉपीराइट नीति',
    bn: 'কপিরাইট নীতি',
    or: 'କପିରାଇଟ୍ ନୀତି',
    mr: 'कॉपीराइट धोरण',
    te: 'కాపీరైట్ విధానం'
  },
  'Hyperlinking Policy': {
    en: 'Hyperlinking Policy',
    hi: 'हाइपरलिंकिंग नीति',
    bn: 'হাইপারলিঙ্কিং নীতি',
    or: 'ହାଇପରଲିଙ୍କିଙ୍ଗ୍ ନୀତି',
    mr: 'हायपरलिंकिंग धोरण',
    te: 'హైపర్‌లింకింగ్ విధానం'
  },
  'Disclaimer': {
    en: 'Disclaimer',
    hi: 'अस्वीकरण',
    bn: 'দাবিত্যাগ',
    or: 'ଦାବିତ୍ୟାଗ',
    mr: 'अस्वीकरण',
    te: 'నిరాకరణ'
  },

  // Key Dashboard Metrics
  'Total Active Mines': {
    en: 'Total Active Mines',
    hi: 'कुल सक्रिय खदानें',
    bn: 'মোট সক্রিয় খনি',
    or: 'ମୋଟ ସକ୍ରିୟ ଖଣି',
    mr: 'एकूण सक्रिय खाणी',
    te: 'మొత్తం క్రియాశీల గనులు'
  },
  'High Risk Mines': {
    en: 'High Risk Mines',
    hi: 'उच्च जोखिम खदानें',
    bn: 'উচ্চ ঝুঁকিপূর্ণ খনি',
    or: 'ଉଚ୍ଚ ବିପଦପୂର୍ଣ୍ଣ ଖଣି',
    mr: 'जास्त धोक्याच्या खाणी',
    te: 'అధిక ప్రమాదకర గనులు'
  },
  'Pending Inspections': {
    en: 'Pending Inspections',
    hi: 'लंबित निरीक्षण',
    bn: 'মুলতুবি পরিদর্শন',
    or: 'ବିଚାରାଧୀନ ନିରୀକ୍ଷଣ',
    mr: 'प्रलंबित तपासण्या',
    te: 'పెండింగ్ తనిఖీలు'
  },
  'Active Violations': {
    en: 'Active Violations',
    hi: 'सक्रिय उल्लंघन',
    bn: 'সক্রিয় লঙ্ঘন',
    or: 'ସକ୍ରିୟ ଉଲ୍ଲଂଘନ',
    mr: 'सक्रिय उल्लंघने',
    te: 'క్రియాశీల ఉల్లంఘనలు'
  },
  'National Compliance Index': {
    en: 'National Compliance Index',
    hi: 'राष्ट्रीय अनुपालन सूचकांक',
    bn: 'জাতীয় অনুপালন সূচক',
    or: 'ଜାତୀୟ ଅନୁପାଳନ ସୂଚକାଙ୍କ',
    mr: 'राष्ट्रीय अनुपालन निर्देशांक',
    te: 'జాతీయ సమ్మతి సూచిక'
  },
  'Critical Alerts': {
    en: 'Critical Alerts',
    hi: 'गंभीर अलर्ट्स',
    bn: 'সংকটপূর্ণ সতর্কবার্তা',
    or: 'ସଙ୍କଟଜନକ ସତର୍କତା',
    mr: 'गंभीर सूचना',
    te: 'క్లిష్టమైన హెచ్చరికలు'
  },
  'Recent Inspections': {
    en: 'Recent Inspections',
    hi: 'हालिया निरीक्षण',
    bn: 'সাম্প্রতিক পরিদর্শন',
    or: 'ସାମ୍ପ୍ରତିକ ନିରୀକ୍ଷଣ',
    mr: 'अलीकडील तपासण्या',
    te: 'ఇటీవలి తనిఖీలు'
  },
  // Homepage Portal Cards
  'Government Administrator': {
    en: 'Government Administrator',
    hi: 'सरकारी प्रशासक',
    bn: 'সরকারি প্রশাসক',
    or: 'ସରକାରୀ ପ୍ରଶାସକ',
    mr: 'शासकीय प्रशासक',
    te: 'ప్రభుత్వ నిర్వాహకుడు'
  },
  'Ministry of Coal · New Delhi': {
    en: 'Ministry of Coal · New Delhi',
    hi: 'कोयला मंत्रालय · नई दिल्ली',
    bn: 'কয়লা মন্ত্রক · নতুন দিল্লি',
    or: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ · ନୂଆଦିଲ୍ଲୀ',
    mr: 'कोळसा मंत्रालय · नवी दिल्ली',
    te: 'బొగ్గు మంత్రిత్వ శాఖ · న్యూఢిల్లీ'
  },
  'Central supervisory command for national coal reserves. Monitors state-wise compliance indexes, schedules statutory audits, and manages nationwide colliery licenses.': {
    en: 'Central supervisory command for national coal reserves. Monitors state-wise compliance indexes, schedules statutory audits, and manages nationwide colliery licenses.',
    hi: 'राष्ट्रीय कोयला भंडारों का केंद्रीय पर्यवेक्षी कमान। राज्यवार अनुपालन सूचकांक की निगरानी, वैधानिक ऑडिट का निर्धारण और देशव्यापी खदान लाइसेंस का प्रबंधन करता है।',
    bn: 'জাতীয় কয়লা মজুদের কেন্দ্রীয় তদারকি কমান্ড। রাজ্যভিত্তিক অনুপালন সূচক পর্যবেক্ষণ, সংবিধিবদ্ধ অডিট নির্ধারণ এবং দেশব্যাপী খনি লাইসেন্স পরিচালনা করে।',
    or: 'ଜାତୀୟ କୋଇଲା ଭଣ୍ଡାର ପାଇଁ କେନ୍ଦ୍ରୀୟ ତଦାରଖ ନିର୍ଦ୍ଦେଶ। ରାଜ୍ୟସ୍ତରୀୟ ଅନୁପାଳନ ସୂଚକାଙ୍କ ତଦାରଖ, ସାମ୍ବିଧାନିକ ଅଡିଟ୍ ନିର୍ଦ୍ଧାରଣ ଏବଂ ଖଣି ଲାଇସେନ୍ସ ପରିଚାଳନା କରେ।',
    mr: 'राष्ट्रीय कोळसा साठ्यांची केंद्रीय पर्यवेक्षी कमान. राज्यनिहाय अनुपालन निर्देशांक निरीक्षण, वैधानिक ऑडिटचे नियोजन आणि देशव्यापी खाण परवान्यांचे व्यवस्थापन करते.',
    te: 'జాతీయ బొగ్గు నిల్వల కేంద్ర పర్యవేక్షణ ఆదేశం. రాష్ట్రాల వారీగా సమ్మతి సూచికలను పర్యవేక్షిస్తుంది, చట్టబద్ధమైన ఆడిట్లను షెడ్యూల్ చేస్తుంది మరియు గనుల లైసెన్స్‌లను నిర్వహిస్తుంది.'
  },
  'National GIS Mine Registry (Lease bounds)': {
    en: 'National GIS Mine Registry (Lease bounds)',
    hi: 'राष्ट्रीय जीआईएस खदान रजिस्ट्री (पट्टा सीमाएं)',
    bn: 'জাতীয় জিআইএস খনি রেজিস্ট্রি (লিজ সীমানা)',
    or: 'ଜାତୀୟ ଜିଆଇଏସ୍ ଖଣି ରେଜିଷ୍ଟ୍ରି (ଲିଜ୍ ସୀମା)',
    mr: 'राष्ट्रीय जीआयएस खाण नोंदणी (पट्टा सीमा)',
    te: 'జాతీయ GIS గని రిజిస్ట్రీ (లీజు సరిహద్దులు)'
  },
  'AI Sentinel Anomaly Review & Inspector Rosters': {
    en: 'AI Sentinel Anomaly Review & Inspector Rosters',
    hi: 'एआई प्रहरी विसंगति समीक्षा व निरीक्षक रोस्टर',
    bn: 'এআই সেন্টিনেল অসঙ্গতি পর্যালোচনা ও পরিদর্শক রোস্টার',
    or: 'ଏଆଇ ସେଣ୍ଟିନେଲ ଅସଙ୍ଗତି ସମୀକ୍ଷା ଏବଂ ନିରୀକ୍ଷକ ରୋଷ୍ଟର',
    mr: 'एआय सेंटिनेल विसंगती पुनरावलोकन आणि निरीक्षक रोस्टर',
    te: 'AI సెంటినెల్ క్రమరాహిత్య సమీక్ష & ఇన్‌స్పెక్టర్ రోస్టర్లు'
  },
  'Statutory DGMS Compliance Reports': {
    en: 'Statutory DGMS Compliance Reports',
    hi: 'वैधानिक डीजीएमएस अनुपालन रिपोर्ट',
    bn: 'সংবিধিবদ্ধ ডিজিএমএস অনুপালন প্রতিবেদন',
    or: 'ସାମ୍ବିଧାନିକ ଡିଜିଏମଏସ ଅନୁପାଳନ ରିପୋର୍ଟ',
    mr: 'वैधानिक डीजीएमएस अनुपालन अहवाल',
    te: 'చట్టబద్ధమైన DGMS సమ్మతి నివేదికలు'
  },
  'Enter Admin Portal': {
    en: 'Enter Admin Portal',
    hi: 'प्रशासक पोर्टल में प्रवेश करें',
    bn: 'প্রশাসক পোর্টালে প্রবেশ করুন',
    or: 'ପ୍ରଶାସକ ପୋର୍ଟାଲ ପ୍ରବେଶ କରନ୍ତୁ',
    mr: 'प्रशासक पोर्टलमध्ये प्रवेश करा',
    te: 'అడ్మిన్ పోర్టల్‌లోకి ప్రవేశించండి'
  },
  'Directorate General of Mines Safety': {
    en: 'Directorate General of Mines Safety',
    hi: 'खान सुरक्षा महानिदेशालय (DGMS)',
    bn: 'খনি সুরক্ষা মহানির্দেশালয় (DGMS)',
    or: 'ଖଣି ସୁରକ୍ଷା ମହାନିର୍ଦ୍ଦେଶାଳୟ (DGMS)',
    mr: 'खाण सुरक्षा महासंचालनालय (DGMS)',
    te: 'గనుల భద్రతా డైరెక్టరేట్ జనరల్ (DGMS)'
  },
  'Regulatory Inspector Desk': {
    en: 'Regulatory Inspector Desk',
    hi: 'नियामक निरीक्षक डेस्क',
    bn: 'নিয়ামক পরিদর্শক ডেস্ক',
    or: 'ନିୟାମକ ନିରୀକ୍ଷକ ଡେସ୍କ',
    mr: 'नियामक निरीक्षक डेस्क',
    te: 'రెగ్యులేటరీ ఇన్‌స్పెక్టర్ డెస్క్'
  },
  'Field execution workspace for statutory inspectors. Dispatched to investigate satellite alert discrepancies, conduct safety audits, and issue Section 22 improvement notices.': {
    en: 'Field execution workspace for statutory inspectors. Dispatched to investigate satellite alert discrepancies, conduct safety audits, and issue Section 22 improvement notices.',
    hi: 'वैधानिक निरीक्षकों के लिए क्षेत्रीय निष्पादन कार्यक्षेत्र। उपग्रह विसंगति जांच, सुरक्षा ऑडिट संचालन और धारा 22 सुधार नोटिस जारी करने हेतु।',
    bn: 'সংবিধিবদ্ধ পরিদর্শকদের জন্য ক্ষেত্র পর্যবেক্ষণ কর্মক্ষেত্র। উপগ্রহ সতর্কতা অসঙ্গতি তদন্ত, নিরাপত্তা অডিট পরিচালনা এবং ধারা ২২ বিজ্ঞপ্তি জারির জন্য।',
    or: 'ସାମ୍ବିଧାନିକ ନିରୀକ୍ଷକମାନଙ୍କ ପାଇଁ କ୍ଷେତ୍ର କାର୍ଯ୍ୟକ୍ଷେତ୍ର। ଉପଗ୍ରହ ସତର୍କତା ଯାଞ୍ଚ, ସୁରକ୍ଷା ଅଡିଟ୍ ଏବଂ ଧାରା ୨୨ ସଂଶୋଧନ ନୋଟିସ୍ ଜାରି ପାଇଁ।',
    mr: 'वैधानिक निरीक्षकांसाठी क्षेत्रीय कार्यक्षेत्र. उपग्रह सतर्कता विसंगती तपासणे, सुरक्षा ऑडिट करणे आणि कलम २२ सुधारणा सूचना जारी करण्यासाठी.',
    te: 'చట్టబద్ధమైన ఇన్‌స్పెక్టర్ల కోసం ఫీల్డ్ ఎగ్జిక్యూషన్ వర్క్‌స్పేస్. ఉపగ్రహ హెచ్చరిక వ్యత్యాసాల దర్యాప్తు, భద్రతా ఆడిట్‌లు మరియు సెక్షన్ 22 నోటీసుల జారీ కోసం.'
  },
  'Interactive Digital Field Inspection Audits': {
    en: 'Interactive Digital Field Inspection Audits',
    hi: 'इंटरैक्टिव डिजिटल फील्ड निरीक्षण ऑडिट',
    bn: 'ইন্টারেক্টিভ ডিজিটাল ফিল্ড পরিদর্শন অডিট',
    or: 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଡିଜିଟାଲ୍ କ୍ଷେତ୍ର ନିରୀକ୍ଷଣ ଅଡିଟ୍',
    mr: 'परस्परसंवादी डिजिटल फील्ड तपासणी ऑडिट',
    te: 'ఇంటరాక్టివ్ డిజిటల్ ఫీల్డ్ ఇన్‌స్పెక్షన్ ఆడిట్‌లు'
  },
  'Satellite Anomaly Adjudication Sentinel': {
    en: 'Satellite Anomaly Adjudication Sentinel',
    hi: 'उपग्रह विसंगति न्यायनिर्णयन प्रहरी',
    bn: 'উপগ্রহ অসঙ্গতি বিচার সেন্টিনেল',
    or: 'ଉପଗ୍ରହ ଅସଙ୍ଗତି ବିଚାର ସେଣ୍ଟିନେଲ',
    mr: 'उपग्रह विसंगती न्यायनिर्णय सेंटिनेल',
    te: 'శాటిలైట్ అనోమలీ అడ్జుడికేషన్ సెంటినెల్'
  },
  'Remediation Evidence Review & Closure': {
    en: 'Remediation Evidence Review & Closure',
    hi: 'उपचार साक्ष्य समीक्षा व समापन',
    bn: 'প্রতিকার প্রমাণ পর্যালোচনা ও সমাপ্তি',
    or: 'ପ୍ରତିକାର ପ୍ରମାଣ ସମୀକ୍ଷା ଏବଂ ସମାପନ',
    mr: 'निवारण पुरावा पुनरावलोकन आणि समाप्ती',
    te: 'పరిష్కార సాక్ష్యాల సమీక్ష & ముగింపు'
  },
  'Enter Inspector Desk': {
    en: 'Enter Inspector Desk',
    hi: 'निरीक्षक डेस्क में प्रवेश करें',
    bn: 'পরিদর্শক ডেস্কে প্রবেশ করুন',
    or: 'ନିରୀକ୍ଷକ ଡେସ୍କ ପ୍ରବେଶ କରନ୍ତୁ',
    mr: 'निरीक्षक डेस्कवर प्रवेश करा',
    te: 'ఇన్‌స్పెక్టర్ డెస్క్‌లోకి ప్రవేశించండి'
  },
  'Colliery Management & Operators': {
    en: 'Colliery Management & Operators',
    hi: 'खदान प्रबंधन और संचालक',
    bn: 'কয়লাখনি পরিচালনা ও অপারেটর',
    or: 'ଖଣି ପରିଚାଳନା ଏବଂ ଅପରେଟର',
    mr: 'कोळसा खाण व्यवस्थापन आणि ऑपरेटर',
    te: 'కోలియరీ నిర్వహణ & ఆపరేటర్లు'
  },
  'Mine Authority Operations': {
    en: 'Mine Authority Operations',
    hi: 'खदान प्राधिकरण परिचालन',
    bn: 'খনি কর্তৃপক্ষ অপারেশন',
    or: 'ଖଣି ପ୍ରାଧିକରଣ ପରିଚାଳନା',
    mr: 'खाण प्राधिकरण ऑपरेशन्स',
    te: 'గని ప్రాధికార కార్యకలాపాలు'
  },
  'Operational compliance desk for colliery General Managers and Safety Officers. Log daily environmental telemetry, upload mandatory laboratory tests, and submit remediation evidence.': {
    en: 'Operational compliance desk for colliery General Managers and Safety Officers. Log daily environmental telemetry, upload mandatory laboratory tests, and submit remediation evidence.',
    hi: 'खदान महाप्रबंधकों और सुरक्षा अधिकारियों के लिए परिचालन अनुपालन डेस्क। दैनिक पर्यावरण टेलीमेट्री दर्ज करें, अनिवार्य प्रयोगशाला परीक्षण अपलोड करें और उपचार साक्ष्य प्रस्तुत करें।',
    bn: 'খনি জেনারেল ম্যানেজার এবং সুরক্ষা কর্মকর্তাদের জন্য অপারেশনাল অনুপালন ডেস্ক। দৈনিক পরিবেশগত টেলিমেট্রি লগ করুন, ল্যাব পরীক্ষা আপলোড করুন এবং প্রমাণ জমা দিন।',
    or: 'ଖଣି ଜେନେରାଲ ମ୍ୟାନେଜର ଏବଂ ସୁରକ୍ଷା ଅଧିକାରୀଙ୍କ ପାଇଁ ପରିଚାଳନା ଅନୁପାଳନ ଡେସ୍କ। ଦୈନିକ ପରିବେଶ ଟେଲିମେଟ୍ରି ଲଗ୍, ପରୀକ୍ଷାଗାର ପ୍ରମାଣପତ୍ର ଅପଲୋଡ୍ ଏବଂ ସମାଧାନ ପ୍ରମାଣ ଦାଖଲ।',
    mr: 'खाण महाव्यवस्थापक आणि सुरक्षा अधिकाऱ्यांसाठी ऑपरेशनल अनुपालन डेस्क. दैनंदिन पर्यावरण टेलिमेट्री नोंदवा, अनिवार्य प्रयोगशाळा चाचण्या अपलोड करा आणि पुरावे सादर करा.',
    te: 'కోలియరీ జనరల్ మేనేజర్లు మరియు సేఫ్టీ అధికారుల కోసం కార్యాచరణ సమ్మతి డెస్క్. రోజువారీ పర్యావరణ టెలిమెట్రీని నమోదు చేయండి, ల్యాబ్ పరీక్షలను అప్‌లోడ్ చేయండి.'
  },
  'Daily Shift Telemetry (Gas, Dust, Blast PPV)': {
    en: 'Daily Shift Telemetry (Gas, Dust, Blast PPV)',
    hi: 'दैनिक शिफ्ट टेलीमेट्री (गैस, धूल, ब्लास्ट PPV)',
    bn: 'দৈনিক শিফট টেলিমেট্রি (গ্যাস, ধূলিকণা, ব্লাস্ট PPV)',
    or: 'ଦୈନିକ ସିଫ୍ଟ ଟେଲିମେଟ୍ରି (ଗ୍ୟାସ, ଧୂଳି, ବ୍ଲାଷ୍ଟ PPV)',
    mr: 'दैनिक पाळी टेलिमेट्री (वायू, धूळ, ब्लास्ट PPV)',
    te: 'రోజువారీ షిఫ్ట్ టెలిమెట్రీ (గ్యాస్, ధూళి, బ్లాస్ట్ PPV)'
  },
  'Corrective Action Evidence Upload': {
    en: 'Corrective Action Evidence Upload',
    hi: 'सुधारात्मक कार्रवाई साक्ष्य अपलोड',
    bn: 'সংশোধনমূলক ব্যবস্থা প্রমাণ আপলোড',
    or: 'ସଂଶୋଧନମୂଳକ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ପ୍ରମାଣ ଅପଲୋଡ୍',
    mr: 'सुधारात्मक कृती पुरावा अपलोड',
    te: 'దిద్దుబాటు చర్యల సాక్ష్యాల అప్‌లోడ్'
  },
  'Statutory Clearances (EC, FC, Explosive)': {
    en: 'Statutory Clearances (EC, FC, Explosive)',
    hi: 'वैधानिक स्वीकृतियां (EC, FC, विस्फोटक)',
    bn: 'সংবিধিবদ্ধ অনুমোদন (EC, FC, বিস্ফোরক)',
    or: 'ସାମ୍ବିଧାନିକ ମଞ୍ଜୁରୀ (EC, FC, ବିସ୍ଫୋରକ)',
    mr: 'वैधानिक मंजुरी (EC, FC, स्फोटके)',
    te: 'చట్టబద్ధమైన అనుమతులు (EC, FC, పేలుడు పదార్థాలు)'
  },
  'Enter Mine Authority Desk': {
    en: 'Enter Mine Authority Desk',
    hi: 'खदान प्राधिकरण डेस्क में प्रवेश करें',
    bn: 'খনি কর্তৃপক্ষ ডেস্কে প্রবেশ করুন',
    or: 'ଖଣି ପ୍ରାଧିକରଣ ଡେସ୍କ ପ୍ରବେଶ କରନ୍ତୁ',
    mr: 'खाण प्राधिकरण डेस्कवर प्रवेश करा',
    te: 'గని ప్రాధికార డెస్క్‌లోకి ప్రవేశించండి'
  },
  // Capabilities
  'Advanced Technology Infrastructure': {
    en: 'Advanced Technology Infrastructure',
    hi: 'उन्नत प्रौद्योगिकी अवसंरचना',
    bn: 'উন্নত প্রযুক্তি পরিকাঠামো',
    or: 'ଉନ୍ନତ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ଭିତ୍ତିଭୂମି',
    mr: 'प्रगत तंत्रज्ञान पायाभूत सुविधा',
    te: 'ఆధునిక సాంకేతిక మౌలిక సదుపాయాలు'
  },
  'Autonomous AI Sentinel & Environmental Telemetry': {
    en: 'Autonomous AI Sentinel & Environmental Telemetry',
    hi: 'स्वायत्त एआई प्रहरी और पर्यावरणीय टेलीमेट्री',
    bn: 'স্বয়ংক্রিয় এআই সেন্টিনেল এবং পরিবেশগত টেলিমেট্রি',
    or: 'ସ୍ୱୟଂଶାସିତ ଏଆଇ ସେଣ୍ଟିନେଲ ଏବଂ ପରିବେଶ ଟେଲିମେଟ୍ରି',
    mr: 'स्वायत्त एआय सेंटिनेल आणि पर्यावरण टेलिमेट्री',
    te: 'స్వయంప్రతిపత్తి గల AI సెంటినెల్ & పర్యావరణ టెలిమెట్రీ'
  },
  'Replacing sporadic manual inspections with 24x7 automated satellite orbit tracking, continuous IoT gas monitoring, and verifiable statutory digital records.': {
    en: 'Replacing sporadic manual inspections with 24x7 automated satellite orbit tracking, continuous IoT gas monitoring, and verifiable statutory digital records.',
    hi: 'अनियमित मैनुअल निरीक्षणों को 24x7 स्वचालित उपग्रह कक्षा ट्रैकिंग, निरंतर IoT गैस निगरानी और सत्यापन योग्य वैधानिक डिजिटल रिकॉर्ड से बदलना।',
    bn: 'অনিয়মিত ম্যানুয়াল পরিদর্শনের পরিবর্তে ২৪x৭ স্বয়ংক্রিয় উপগ্রহ ট্র্যাকিং, অবিচ্ছিন্ন আইওটি গ্যাস পর্যবেক্ষণ এবং সংবিধিবদ্ধ ডিজিটাল রেকর্ড।',
    or: 'ଅନିୟମିତ ମାନୁଆଲ ନିରୀକ୍ଷଣ ବଦଳରେ ୨୪x୭ ସ୍ୱୟଂଚାଳିତ ଉପଗ୍ରହ ଟ୍ରାକିଂ, ନିରନ୍ତର IoT ଗ୍ୟାସ ତଦାରଖ ଏବଂ ଡିଜିଟାଲ୍ ରେକର୍ଡ।',
    mr: 'अधूनमधून होणाऱ्या मॅन्युअल तपासणीऐवजी २४x७ स्वयंचलित उपग्रह ट्रॅकिंग, निरंतर IoT वायू निरीक्षण आणि डिजिटल नोंदी.',
    te: 'సాధారణ మాన్యువల్ తనిఖీల స్థానంలో 24x7 స్వయంచాలక శాటిలైట్ ట్రాకింగ్, నిరంతర IoT గ్యాస్ పర్యవేక్షణ మరియు చట్టబద్ధమైన డిజిటల్ రికార్డులు.'
  },
  'Satellite Anomaly Sentinel': {
    en: 'Satellite Anomaly Sentinel',
    hi: 'उपग्रह विसंगति प्रहरी',
    bn: 'উপগ্রহ অসঙ্গতি সেন্টিনেল',
    or: 'ଉପଗ୍ରହ ଅସଙ୍ଗତି ସେଣ୍ଟିନେଲ',
    mr: 'उपग्रह विसंगती सेंटिनेल',
    te: 'శాటిలైట్ క్రమరాహిత్య సెంటినెల్'
  },
  'Real-Time Gas & Air Telemetry': {
    en: 'Real-Time Gas & Air Telemetry',
    hi: 'रीयल-टाइम गैस एवं वायु टेलीमेट्री',
    bn: 'রিয়েল-টাইম গ্যাস ও বায়ু টেলিমেট্রি',
    or: 'ରିଅଲ-ଟାଇମ୍ ଗ୍ୟାସ ଏବଂ ବାୟୁ ଟେଲିମେଟ୍ରି',
    mr: 'रिअल-टाइम वायू आणि हवा टेलिमेट्री',
    te: 'రియల్-టైమ్ గ్యాస్ & ఎయిర్ టెలిమెట్రీ'
  },
  'Digital Field Audits': {
    en: 'Digital Field Audits',
    hi: 'डिजिटल फील्ड ऑडिट',
    bn: 'ডিজিটাল ফিল্ড অডিট',
    or: 'ଡିଜିଟାଲ୍ କ୍ଷେତ୍ର ଅଡିଟ୍',
    mr: 'डिजिटल फील्ड ऑडिट',
    te: 'డిజిటల్ ఫీల్డ్ ఆడిట్‌లు'
  },
  'Evidence Remediation Dossiers': {
    en: 'Evidence Remediation Dossiers',
    hi: 'साक्ष्य उपचार डोजियर',
    bn: 'প্রমাণ প্রতিকার ডসিয়ার',
    or: 'ପ୍ରମାଣ ପ୍ରତିକାର ଡୋଜିଅର୍',
    mr: 'पुरावा निवारण डॉसियर',
    te: 'సాక్ష్యాల పరిష్కార పత్రాలు'
  },
  'Geographic Command & Control': {
    en: 'Geographic Command & Control',
    hi: 'भौगोलिक कमान और नियंत्रण',
    bn: 'ভৌগোলিক কমান্ড ও নিয়ন্ত্রণ',
    or: 'ଭୌଗୋଳିକ ନିର୍ଦ୍ଦେଶ ଓ ନିୟନ୍ତ୍ରଣ',
    mr: 'भौगोलिक कमान आणि नियंत्रण',
    te: 'భౌగోళిక కమాండ్ & నియంత్రణ'
  },
  'Major Indian Coalfields Under Active Surveillance': {
    en: 'Major Indian Coalfields Under Active Surveillance',
    hi: 'सक्रिय निगरानी में प्रमुख भारतीय कोयला क्षेत्र',
    bn: 'সক্রিয় নজরদারিতে প্রধান ভারতীয় কয়লাক্ষেত্রসমূহ',
    or: 'ସକ୍ରିୟ ନଜରଦାରୀରେ ପ୍ରମୁଖ ଭାରତୀୟ କୋଇଲା କ୍ଷେତ୍ର',
    mr: 'सक्रिय निगराणीखाली प्रमुख भारतीय कोळसा क्षेत्रे',
    te: 'క్రియాశీల నిఘాలో ఉన్న ప్రధాన భారతీయ బొగ్గు క్షేత్రాలు'
  },
  'Satellite orbits synchronized across Eastern, Central, and Western coal belts with live telemetry ingress every 4 hours.': {
    en: 'Satellite orbits synchronized across Eastern, Central, and Western coal belts with live telemetry ingress every 4 hours.',
    hi: 'पूर्वी, मध्य और पश्चिमी कोयला क्षेत्रों में उपग्रह कक्षाएं सिंक्रोनाइज़ हैं, हर 4 घंटे में लाइव टेलीमेट्री डेटा प्राप्त होता है।',
    bn: 'পূর্ব, মধ্য ও পশ্চিম কয়লা বেল্টে উপগ্রহ প্রদক্ষিণ সমন্বয় করা হয়েছে, প্রতি ৪ ঘণ্টায় লাইভ টেলিমেট্রি প্রবেশ ঘটে।',
    or: 'ପୂର୍ବ, ମଧ୍ୟ ଏବଂ ପଶ୍ଚିମ କୋଇଲା କ୍ଷେତ୍ରରେ ଉପଗ୍ରହ କକ୍ଷପଥ ସମନ୍ୱିତ, ପ୍ରତି ୪ ଘଣ୍ଟାରେ ଲାଇଭ୍ ଟେଲିମେଟ୍ରି ଇନପୁଟ୍।',
    mr: 'पूर्व, मध्य आणि पश्चिम कोळसा पट्ट्यांमध्ये उपग्रह कक्षा समक्रमित आहेत, दर ४ तासांनी थेट टेलिमेट्री माहिती मिळते.',
    te: 'తూర్పు, మధ్య మరియు పశ్చిమ బొగ్గు బెల్ట్‌లలో శాటిలైట్ కక్ష్యలు సమకాలీకరించబడ్డాయి, ప్రతి 4 గంటలకు లైవ్ టెలిమెట్రీ అందుబాటులో ఉంటుంది.'
  },
  // Basins
  'Jharia Coalfield': {
    en: 'Jharia Coalfield',
    hi: 'झरिया कोयला क्षेत्र',
    bn: 'ঝরিয়া কয়লাক্ষেত্র',
    or: 'ଝରିଆ କୋଇଲା କ୍ଷେତ୍ର',
    mr: 'झरिया कोळसा क्षेत्र',
    te: 'ఝరియా బొగ్గు క్షేత్రం'
  },
  'Singrauli Basin': {
    en: 'Singrauli Basin',
    hi: 'सिंगरौली बेसिन',
    bn: 'সিংরৌলি অববাহিকা',
    or: 'ସିଙ୍ଗରୌଲି ବେସିନ',
    mr: 'सिंगरौली खोरे',
    te: 'సింగ్రౌలీ బేసిన్'
  },
  'Korba Coalfield': {
    en: 'Korba Coalfield',
    hi: 'कोरबा कोयला क्षेत्र',
    bn: 'কোরবা কয়লাক্ষেত্র',
    or: 'କୋରବା କୋଇଲା କ୍ଷେତ୍ର',
    mr: 'कोरबा कोळसा क्षेत्र',
    te: 'కోర్బా బొగ్గు క్షేత్రం'
  },
  'Raniganj Coalfield': {
    en: 'Raniganj Coalfield',
    hi: 'रानीगंज कोयला क्षेत्र',
    bn: 'রানীগঞ্জ কয়লাক্ষেত্র',
    or: 'ରାଣୀଗଞ୍ଜ କୋଇଲା କ୍ଷେତ୍ର',
    mr: 'राणीगंज कोळसा क्षेत्र',
    te: 'రాణిగంజ్ బొగ్గు క్షేత్రం'
  },
  'Talcher Coalfield': {
    en: 'Talcher Coalfield',
    hi: 'तालचेर कोयला क्षेत्र',
    bn: 'তালচের কয়লাক্ষেত্র',
    or: 'ତାଳଚେର କୋଇଲା କ୍ଷେତ୍ର',
    mr: 'तालचेर कोळसा क्षेत्र',
    te: 'తాల్చేర్ బొగ్గు క్షేత్రం'
  },
  'Operating:': {
    en: 'Operating:',
    hi: 'परिचालक:',
    bn: 'পরিচালনাকারী:',
    or: 'ପରିଚାଳକ:',
    mr: 'चालक:',
    te: 'నిర్వాహకుడు:'
  },
  'Active Mines:': {
    en: 'Active Mines:',
    hi: 'सक्रिय खदानें:',
    bn: 'সক্রিয় খনিসমূহ:',
    or: 'ସକ୍ରିୟ ଖଣି:',
    mr: 'सक्रिय खाणी:',
    te: 'క్రియాశీల గనులు:'
  },
  'Compliance:': {
    en: 'Compliance:',
    hi: 'अनुपालन:',
    bn: 'অনুপালন:',
    or: 'ଅନୁପାଳନ:',
    mr: 'अनुपालन:',
    te: 'సమ్మతి:'
  },
  'Collieries': {
    en: 'Collieries',
    hi: 'खदानें',
    bn: 'কয়লাখনি',
    or: 'ଖଣିଗୁଡ଼ିକ',
    mr: 'खाणी',
    te: 'గనులు'
  },
  'Fire & subsidence monitoring active': {
    en: 'Fire & subsidence monitoring active',
    hi: 'अग्नि व धंसाव निगरानी सक्रिय',
    bn: 'আগুন ও ভূ-ধস পর্যবেক্ষণ সক্রিয়',
    or: 'ନିଆଁ ଏବଂ ଭୂ-ଧସିବା ତଦାରଖ ସକ୍ରିୟ',
    mr: 'आग आणि खचणे निरीक्षण सक्रिय',
    te: 'అగ్ని & భూమి కుంగిపోవడం పర్యవేక్షణ చురుకుగా ఉంది'
  },
  'Heavy earthmoving radar sync': {
    en: 'Heavy earthmoving radar sync',
    hi: 'भारी खनन मशीन रडार सिंक',
    bn: 'ভারী খনির মেশিন রাডার সিঙ্ক',
    or: 'ଭାରୀ ଖନନ ଯନ୍ତ୍ରପାତି ରାଡାର ସିଙ୍କ',
    mr: 'अवजड यंत्रसामग्री रडार सिंक',
    te: 'భారీ ఎర్త్‌మూవింగ్ రాడార్ సింక్'
  },
  'Gevra & Dipka continuous tracking': {
    en: 'Gevra & Dipka continuous tracking',
    hi: 'गेवरा व दीपका निरंतर ट्रैकिंग',
    bn: 'গেভরা ও দীপকা অবিচ্ছিন্ন ট্র্যাকিং',
    or: 'ଗେଭରା ଏବଂ ଦୀପକା ନିରନ୍ତର ଟ୍ରାକିଂ',
    mr: 'गेवरा आणि दिपका निरंतर ट्रॅकिंग',
    te: 'గేవ్రా & దీప్కా నిరంతర ట్రాకింగ్'
  },
  'Underground ventilation sensor grid': {
    en: 'Underground ventilation sensor grid',
    hi: 'भूमिगत वेंटिलेशन सेंसर ग्रिड',
    bn: 'ভূগর্ভস্থ বায়ুচলাচল সেন্সর গ্রিড',
    or: 'ଭୂତଳ ବାୟୁ ଚଳାଚଳ ସେନ୍ସର ଗ୍ରିଡ୍',
    mr: 'भूमिगत वायुवीजन सेन्सर ग्रिड',
    te: 'భూగర్భ వెంటిలేషన్ సెన్సార్ గ్రిడ్'
  },
  'High-capacity conveyor dust telemetry': {
    en: 'High-capacity conveyor dust telemetry',
    hi: 'उच्च क्षमता कन्वेयर धूल टेलीमेट्री',
    bn: 'উচ্চ ক্ষমতা কনভেয়ার ধূলিকণা টেলিমেট্রি',
    or: 'ଉଚ୍ଚ କ୍ଷମତା ସମ୍ପନ୍ନ କନଭେୟର ଧୂଳି ଟେଲିମେଟ୍ରି',
    mr: 'उच्च क्षमता कन्व्हेयर धूळ टेलिमेट्री',
    te: 'అధిక సామర్థ్య కన్వేయర్ డస్ట్ టెలిమెట్రీ'
  },
  // Circulars & Mandates
  'Statutory Notifications & Mandates': {
    en: 'Statutory Notifications & Mandates',
    hi: 'वैधानिक अधिसूचनाएं एवं निर्देश',
    bn: 'সংবিধিবদ্ধ বিজ্ঞপ্তি ও নির্দেশনা',
    or: 'ସାମ୍ବିଧାନିକ ବିଜ୍ଞପ୍ତି ଏବଂ ନିର୍ଦ୍ଦେଶାବଳୀ',
    mr: 'वैधानिक अधिसूचना आणि आदेश',
    te: 'చట్టబద్ధమైన నోటిఫికేషన్‌లు & ఆదేశాలు'
  },
  'Recent DGMS Directives & Safety Circulars': {
    en: 'Recent DGMS Directives & Safety Circulars',
    hi: 'हालिया डीजीएमएस निर्देश एवं सुरक्षा परिपत्रक',
    bn: 'সাম্প্রতিক ডিজিএমএস নির্দেশিকা ও সুরক্ষা সার্কুলার',
    or: 'ସାମ୍ପ୍ରତିକ ଡିଜିଏମଏସ ନିର୍ଦ୍ଦେଶାବଳୀ ଏବଂ ସୁରକ୍ଷା ସର୍କୁଲାର',
    mr: 'अलीकडील डीजीएमएस निर्देश आणि सुरक्षा परिपत्रके',
    te: 'ఇటీవలి DGMS ఆదేశాలు & భద్రతా సర్క్యులర్లు'
  },
  'View All 84 Circulars in Portal': {
    en: 'View All 84 Circulars in Portal',
    hi: 'पोर्टल में सभी 84 परिपत्रक देखें',
    bn: 'পোর্টালে সমস্ত ৮৪টি সার্কুলার দেখুন',
    or: 'ପୋର୍ଟାଲରେ ସମସ୍ତ ୮୪ଟି ସର୍କୁଲାର ଦେଖନ୍ତୁ',
    mr: 'पोर्टलमध्ये सर्व ८४ परिपत्रके पहा',
    te: 'పోర్టల్‌లో మొత్తం 84 సర్క్యులర్‌లను చూడండి'
  },
  'Mandatory Real-Time IoT Ingress for Opencast Dust & Blast Vibration Monitoring': {
    en: 'Mandatory Real-Time IoT Ingress for Opencast Dust & Blast Vibration Monitoring',
    hi: 'ओपनकास्ट धूल और ब्लास्ट कंपन निगरानी हेतु अनिवार्य रीयल-टाइम IoT इनग्रेस',
    bn: 'ওপেনকাস্ট ধূলিকণা ও ব্লাস্ট কম্পন পর্যবেক্ষণের জন্য বাধ্যতামূলক রিয়েল-টাইম আইওটি সংযোগ',
    or: 'ଓପନକାଷ୍ଟ ଧୂଳି ଏବଂ ବିସ୍ଫୋରଣ କମ୍ପନ ତଦାରଖ ପାଇଁ ବାଧ୍ୟତାମୂଳକ ରିଅଲ-ଟାଇମ୍ IoT ଇନପୁଟ୍',
    mr: 'ओपनकास्ट धूळ आणि ब्लास्ट कंपन निरीक्षणासाठी अनिवार्य रिअल-टाइम IoT जोडणी',
    te: 'ఓపెన్‌కాస్ట్ డస్ట్ & బ్లాస్ట్ వైబ్రేషన్ మానిటరింగ్ కోసం తప్పనిసరి రియల్-టైమ్ IoT ఇంగ్రెస్'
  },
  'Standard Operating Procedures for Overburden Dump Slope Stability during Monsoon': {
    en: 'Standard Operating Procedures for Overburden Dump Slope Stability during Monsoon',
    hi: 'मानसून के दौरान ओवरबर्डन डंप ढलान स्थिरता हेतु मानक संचालन प्रक्रिया (SOP)',
    bn: 'বর্ষার সময় ওভারবার্ডেন ডাম্প ঢাল স্থিতিশীলতার জন্য আদর্শ অপারেটিং পদ্ধতি (SOP)',
    or: 'ମୌସୁମୀ ସମୟରେ ଓଭରବର୍ଡେନ ଡମ୍ପ ଢାଲୁ ସ୍ଥିରତା ପାଇଁ ମାନକ ପରିଚାଳନା ପଦ୍ଧତି (SOP)',
    mr: 'पावसाळ्यात ओव्हरबर्डन डंप उतार स्थिरतेसाठी मानक कार्यप्रणाली (SOP)',
    te: 'వర్షాకాలంలో ఓవర్‌బర్డెన్ డంప్ స్లోప్ స్థిరత్వం కోసం ప్రామాణిక ఆపరేటింగ్ విధానాలు'
  },
  'Digitization of Mining Lease Boundary Demarcation via DGPS and Satellite Telemetry': {
    en: 'Digitization of Mining Lease Boundary Demarcation via DGPS and Satellite Telemetry',
    hi: 'डीजीपीएस और उपग्रह टेलीमेट्री द्वारा खनन पट्टा सीमा सीमांकन का डिजिटलीकरण',
    bn: 'ডিজিপিএস এবং উপগ্রহ টেলিমেট্রির মাধ্যমে খনি লিজ সীমানা নির্ধারণের ডিজিটাইজেশন',
    or: 'ଡିଜିପିଏସ୍ ଏବଂ ଉପଗ୍ରହ ଟେଲିମେଟ୍ରି ମାଧ୍ୟମରେ ଖଣି ଲିଜ୍ ସୀମା ଚିହ୍ନଟକରଣର ଡିଜିଟାଇଜେସନ୍',
    mr: 'डीजीपीएस आणि उपग्रह टेलिमेट्रीद्वारे खाण पट्टा सीमा सीमांकनाचे डिजिटलायझेशन',
    te: 'DGPS మరియు శాటిలైట్ టెలిమెట్రీ ద్వారా మైనింగ్ లీజు సరిహద్దు విభజన డిజిటలైజేషన్'
  },
  'Download Gazette Copy (PDF)': {
    en: 'Download Gazette Copy (PDF)',
    hi: 'राजपत्र प्रति डाउनलोड करें (PDF)',
    bn: 'গেজেট কপি ডাউনলোড করুন (PDF)',
    or: 'ଗେଜେଟ୍ କପି ଡାଉନଲୋଡ୍ କରନ୍ତୁ (PDF)',
    mr: 'राजपत्र प्रत डाउनलोड करा (PDF)',
    te: 'గెజిట్ కాపీని డౌన్‌లోడ్ చేయండి (PDF)'
  },
  // Footer & Apex Links
  'Governance Portals': {
    en: 'Governance Portals',
    hi: 'प्रशासन पोर्टल',
    bn: 'প্রশাসন পোর্টাল',
    or: 'ପ୍ରଶାସନ ପୋର୍ଟାଲ',
    mr: 'प्रशासन पोर्टल्स',
    te: 'పరిపాలనా పోర్టల్స్'
  },
  'Government of India Nodes': {
    en: 'Government of India Nodes',
    hi: 'भारत सरकार के नोड्स',
    bn: 'ভারত সরকারের নোডসমূহ',
    or: 'ଭାରତ ସରକାରଙ୍କ ନୋଡ୍',
    mr: 'भारत सरकार नोड्स',
    te: 'భారత ప్రభుత్వ నోడ్‌లు'
  },
  'Emergency Mine Safety & Helpdesk': {
    en: 'Emergency Mine Safety & Helpdesk',
    hi: 'आपातकालीन खदान सुरक्षा एवं हेल्पलाइन',
    bn: 'জরুরি খনি সুরক্ষা ও হেল্পডেস্ক',
    or: 'ଜରୁରୀକାଳୀନ ଖଣି ସୁରକ୍ଷା ଓ ହେଲ୍ପଡେସ୍କ',
    mr: 'आपत्कालीन खाण सुरक्षा आणि मदत कक्ष',
    te: 'అత్యవసర గని భద్రత & హెల్ప్‌డెస్క్'
  },
  'Ministry Admin Portal (MoC HQ)': {
    en: 'Ministry Admin Portal (MoC HQ)',
    hi: 'मंत्रालय व्यवस्थापक पोर्टल (कोयला मंत्रालय मुख्यालय)',
    bn: 'মন্ত্রণালয় অ্যাডমিন পোর্টাল (কয়লা মন্ত্রণালয় হেডকোয়ার্টার)',
    or: 'ମନ୍ତ୍ରଣାଳୟ ପ୍ରଶାସକ ପୋର୍ଟାଲ (କୋଇଲା ମନ୍ତ୍ରଣାଳୟ ମୁଖ୍ୟାଳୟ)',
    mr: 'मंत्रालय प्रशासक पोर्टल (कोळसा मंत्रालय मुख्यालय)',
    te: 'మంత్రిత్వ శాఖ అడ్మిన్ పోర్టల్ (బొగ్గు మంత్రిత్వ శాఖ హెచ్‌క్యూ)'
  },
  'DGMS Inspector Audit Desk': {
    en: 'DGMS Inspector Audit Desk',
    hi: 'डीजीएमएस निरीक्षक ऑडिट डेस्क',
    bn: 'ডিজিএমএস পরিদর্শক অডিট ডেস্ক',
    or: 'ଡିଜିଏମଏସ ନିରୀକ୍ଷକ ଅଡିଟ୍ ଡେସ୍କ',
    mr: 'डीजीएमएस निरीक्षक ऑडिट डेस्क',
    te: 'DGMS ఇన్‌స్పెక్టర్ ఆడిట్ డెస్క్'
  },
  'Mine Authority Telemetry Portal': {
    en: 'Mine Authority Telemetry Portal',
    hi: 'खदान प्राधिकरण टेलीमेट्री पोर्टल',
    bn: 'খনি কর্তৃপক্ষ টেলিমেট্রি পোর্টাল',
    or: 'ଖଣି ପ୍ରାଧିକରଣ ଟେଲିମେଟ୍ରି ପୋର୍ଟାଲ',
    mr: 'खाण प्राधिकरण टेलिमेट्री पोर्टल',
    te: 'గని ప్రాధికార టెలిమెట్రీ పోర్టల్'
  },
  'Standard Secure Sign-In': {
    en: 'Standard Secure Sign-In',
    hi: 'मानक सुरक्षित साइन-इन',
    bn: 'স্ট্যান্ডার্ড সুরক্ষিত সাইন-ইন',
    or: 'ମାନକ ସୁରକ୍ଷିତ ସାଇନ୍-ଇନ୍',
    mr: 'मानक सुरक्षित साइन-इन',
    te: 'ప్రామాణిక సురక్షిత సైన్-ఇన్'
  },
  'Officer Password Recovery': {
    en: 'Officer Password Recovery',
    hi: 'अधिकारी पासवर्ड पुनर्प्राप्ति',
    bn: 'অফিসার পাসওয়ার্ড পুনরুদ্ধার',
    or: 'ଅଧିକାରୀ ପାସୱାର୍ଡ ପୁନରୁଦ୍ଧାର',
    mr: 'अधिकारी पासवर्ड पुनर्प्राप्ती',
    te: 'అధికారి పాస్‌వర్డ్ రికవరీ'
  },
  '24x7 DGMS Control Room:': {
    en: '24x7 DGMS Control Room:',
    hi: '24x7 डीजीएमएस नियंत्रण कक्ष:',
    bn: '২৪x৭ ডিজিএমএস নিয়ন্ত্রণ কক্ষ:',
    or: '୨୪x୭ ଡିଜିଏମଏସ ନିୟନ୍ତ୍ରଣ କକ୍ଷ:',
    mr: '२४x७ डीजीएमएस नियंत्रण कक्ष:',
    te: '24x7 DGMS కంట్రోల్ రూమ్:'
  },
  'STQC Certified & Hosted in National Informatics Centre (NIC) Cloud': {
    en: 'STQC Certified & Hosted in National Informatics Centre (NIC) Cloud',
    hi: 'एसटीक्यूसी प्रमाणित एवं राष्ट्रीय सूचना विज्ञान केंद्र (NIC) क्लाउड में होस्टेड',
    bn: 'এসটিকিউসি সার্টিফাইড এবং ন্যাশনাল ইনফরমেটিক্স সেন্টার (NIC) ক্লাউডে হোস্ট করা',
    or: 'STQC ପ୍ରମାଣିତ ଏବଂ ଜାତୀୟ ସୂଚନା ବିଜ୍ଞାନ କେନ୍ଦ୍ର (NIC) କ୍ଲାଉଡରେ ହୋଷ୍ଟ ହୋଇଛି',
    mr: 'STQC प्रमाणित आणि नॅशनल इन्फॉर्मेटिक्स सेंटर (NIC) क्लाउडमध्ये होस्ट केलेले',
    te: 'STQC సర్టిఫైడ్ & నేషనల్ ఇన్ఫర్మేటిక్స్ సెంటర్ (NIC) క్లౌడ్‌లో హోస్ట్ చేయబడింది'
  },
  'Security Audited by CERT-In': {
    en: 'Security Audited by CERT-In',
    hi: 'CERT-In द्वारा सुरक्षा ऑडिटेड',
    bn: 'CERT-In দ্বারা সুরক্ষা নিরীক্ষিত',
    or: 'CERT-In ଦ୍ୱାରା ସୁରକ୍ଷା ଅଡିଟ୍ ହୋଇଛି',
    mr: 'CERT-In द्वारे सुरक्षा ऑडिट केलेले',
    te: 'CERT-In ద్వారా భద్రతా ఆడిట్ చేయబడింది'
  },
  'Terms of Use': {
    en: 'Terms of Use',
    hi: 'उपयोग की शर्तें',
    bn: 'ব্যবহারের শর্তাবলী',
    or: 'ବ୍ୟବହାର ନିୟମାବଳୀ',
    mr: 'वापराच्या अटी',
    te: 'వినియోగ నిబంధనలు'
  },
  'Designed & Maintained for Ministry of Coal, Government of India.': {
    en: 'Designed & Maintained for Ministry of Coal, Government of India.',
    hi: 'कोयला मंत्रालय, भारत सरकार के लिए डिज़ाइन और अनुरक्षित।',
    bn: 'কয়লা মন্ত্রক, ভারত সরকারের জন্য পরিকল্পিত ও পরিচালিত।',
    or: 'କୋଇଲା ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାରଙ୍କ ପାଇଁ ପରିକଳ୍ପିତ ଏବଂ ରକ୍ଷଣାବେକ୍ଷଣ କରାଯାଇଛି।',
    mr: 'कोळसा मंत्रालय, भारत सरकार यांच्यासाठी डिझाइन केलेले आणि देखरेख केलेले.',
    te: 'బొగ్గు మంత్రిత్వ శాఖ, భారత ప్రభుత్వం కోసం రూపొందించబడింది మరియు నిర్వహించబడుతుంది.'
  },
  'Autonomous National Satellite Surveillance, Real-Time Sensor Telemetry & Statutory Safety Enforcement Portal for the Indian Mining Sector.': {
    en: 'Autonomous National Satellite Surveillance, Real-Time Sensor Telemetry & Statutory Safety Enforcement Portal for the Indian Mining Sector.',
    hi: 'भारतीय खनन क्षेत्र हेतु स्वायत्त राष्ट्रीय उपग्रह निगरानी, रीयल-टाइम सेंसर टेलीमेट्री एवं वैधानिक सुरक्षा प्रवर्तन पोर्टल।',
    bn: 'ভারতীয় খনি খাতের জন্য স্বয়ংক্রিয় জাতীয় উপগ্রহ নজরদারি, রিয়েল-টাইম সেন্সর টেলিমেট্রি এবং সংবিধিবদ্ধ সুরক্ষা প্রয়োগ পোর্টাল।',
    or: 'ଭାରତୀୟ ଖଣି କ୍ଷେତ୍ର ପାଇଁ ସ୍ୱୟଂଶାସିତ ଜାତୀୟ ଉପଗ୍ରହ ନଜରଦାରୀ, ରିଅଲ-ଟାଇମ୍ ସେନ୍ସର ଟେଲିମେଟ୍ରି ଏବଂ ସାମ୍ବିଧାନିକ ସୁରକ୍ଷା ପ୍ରବର୍ତ୍ତନ ପୋର୍ଟାଲ।',
    mr: 'भारतीय खाण क्षेत्रासाठी स्वायत्त राष्ट्रीय उपग्रह निगराणी, रिअल-टाइम सेन्सर टेलिमेट्री आणि वैधानिक सुरक्षा अंमलबजावणी पोर्टल.',
    te: 'భారతీయ మైనింగ్ రంగం కోసం స్వయంప్రతిపత్తి గల జాతీయ శాటిలైట్ నిఘా, రియల్-టైమ్ సెన్సార్ టెలిమెట్రీ & చట్టబద్ధమైన భద్రతా అమలు పోర్టల్.'
  },
  'Mines Act, 1952 Enforcement Framework': {
    en: 'Mines Act, 1952 Enforcement Framework',
    hi: 'खान अधिनियम, 1952 प्रवर्तन ढांचा',
    bn: 'খনি আইন, ১৯৫২ প্রয়োগ কাঠামো',
    or: 'ଖଣି ଆଇନ, ୧୯୫୨ ପ୍ରବର୍ତ୍ତନ ଢାଞ୍ଚା',
    mr: 'खाण कायदा, १९५२ अंमलबजावणी चौकट',
    te: 'గనుల చట్టం, 1952 అమలు ఫ్రేమ్‌వర్క్'
  },
  'Coal Mines Regulations (CMR), 2017': {
    en: 'Coal Mines Regulations (CMR), 2017',
    hi: 'कोयला खान विनियम (सीएमआर), 2017',
    bn: 'কয়লা খনি প্রবিধান (CMR), ২০১৭',
    or: 'କୋଇଲା ଖଣି ନିୟମାବଳୀ (CMR), ୨୦୧୭',
    mr: 'कोळसा खाण नियमन (CMR), २०१७',
    te: 'బొగ్గు గనుల నిబంధనలు (CMR), 2017'
  },
  'Opencast Terraces': {
    en: 'Opencast Terraces',
    hi: 'ओपनकास्ट खदान सीढ़ी',
    bn: 'ওপেনকাস্ট সোপান',
    or: 'ଓପନକାଷ୍ଟ ଖଣି ସୋପାନ',
    mr: 'ओपनकास्ट पायऱ्या',
    te: 'ఓపెన్‌కాస్ట్ బెంచీలు'
  },
  'Orbital Sat-Radar': {
    en: 'Orbital Sat-Radar',
    hi: 'कक्षीय उपग्रह रडार',
    bn: 'কক্ষপথ উপগ্রহ রাডার',
    or: 'କକ୍ଷପଥ ଉପଗ୍ରହ ରାଡାର',
    mr: 'कक्षीय उपग्रह रडार',
    te: 'కక్ష్య ఉపగ్రహ రాడార్'
  },
  'Eco Reclamation': {
    en: 'Eco Reclamation',
    hi: 'हरित पुनरुद्धार',
    bn: 'পরিবেশ পুনরুদ্ধার',
    or: 'ପରିବେଶ ପୁନରୁଦ୍ଧାର',
    mr: 'पर्यावरण पुनरुज्जीवन',
    te: 'పర్యావరణ పునరుద్ధరణ'
  },
  'Heavy Excavation': {
    en: 'Heavy Excavation',
    hi: 'भारी उत्खनन',
    bn: 'ভারী খনন',
    or: 'ଭାରୀ ଉତ୍ଖନନ',
    mr: 'जड उत्खनन',
    te: 'భారీ తవ్వకాలు'
  },
  'Satellite Live Tracking': {
    en: 'Satellite Live Tracking',
    hi: 'उपग्रह लाइव ट्रैकिंग',
    bn: 'উপগ্রহ লাইভ ট্র্যাকিং',
    or: 'ଉପଗ୍ରହ ଲାଇଭ୍ ଟ୍ରାକିଂ',
    mr: 'उपग्रह थेट ट्रॅकिंग',
    te: 'శాటిలైట్ లైవ్ ట్రాకింగ్'
  },
  'Background View': {
    en: 'Background View',
    hi: 'पृष्ठभूमि दृश्य',
    bn: 'পটভূমি দৃশ্য',
    or: 'ପୃଷ୍ଠଭୂମି ଦୃଶ୍ୟ',
    mr: 'पार्श्वभूमी दृश्य',
    te: 'బ్యాక్‌గ్రౌండ్ వీక్షణ'
  }
};
