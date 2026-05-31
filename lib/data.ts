// Static content sourced from the Zollani Tech company profile.
// Replace with Sanity queries once your project is configured.

export const siteConfig = {
  name: 'Zollani Tech',
  tagline: 'Powering Technology. Enabling Growth.',
  description:
    'Professional technology solutions for businesses, institutions, and individuals across Kenya.',
  email: 'info@zollani.co.ke',
  phone: '+254 768 551914',
  whatsapp: '+254 768 551914',
  address: 'Thika Road, Muthaiga Business Centre, Former Shell Petrol Station, Nairobi',
  storeUrl: 'https://shop.zollani.co.ke',
  social: {
    twitter:   'https://twitter.com/zollanitech',
    linkedin:  'https://linkedin.com/company/zollanitech',
    facebook:  'https://facebook.com/zollanitech',
    instagram: 'https://instagram.com/zollanitech',
  },
};

export const stats = [
  { value: '200+',  label: 'Projects Completed' },
  { value: '1,000+', label: 'Devices Repaired' },
  { value: '150+',  label: 'Clients Served' },
  { value: '3+',    label: 'Years of Experience' },
];

export const services = [
  {
    slug: 'hardware-repair',
    title: 'Hardware Repair',
    shortDesc: 'Laptop and desktop hardware repairs — screens, keyboards, motherboards, storage, and more.',
    icon: '🔧',
    color: 'coral',
    subServices: [
      { title: 'Laptop Screen Replacement',   desc: 'Cracked or damaged display? We replace all laptop screen sizes and types.' },
      { title: 'Keyboard Replacement',        desc: 'Sticky, broken, or non-responsive keyboard replaced quickly.' },
      { title: 'Laptop Hinge Repair',         desc: 'Broken or stiff hinges repaired so your lid opens and closes perfectly.' },
      { title: 'Charging Port Repair',        desc: 'Loose, broken, or dead charging ports fixed or replaced.' },
      { title: 'Motherboard Diagnostics & Repair', desc: 'Advanced diagnostics and component-level motherboard repair.' },
      { title: 'RAM / SSD / HDD Installation', desc: 'Memory and storage upgrades for faster, larger-capacity computers.' },
      { title: 'CPU Replacement',             desc: 'Processor upgrade or replacement for improved performance.' },
      { title: 'Fan & Thermal Paste',         desc: 'Overheating repairs including fan replacement and thermal paste renewal.' },
      { title: 'Battery Replacement',         desc: 'Laptop battery replacement restoring full charge capacity.' },
      { title: 'Desktop Power Supply & GPU',  desc: 'PSU replacement, GPU installation, and desktop component repairs.' },
    ],
  },
  {
    slug: 'software-repair',
    title: 'Software Repair',
    shortDesc: 'OS installation, crash recovery, optimization, and software troubleshooting for Windows and Linux.',
    icon: '💻',
    color: 'teal',
    subServices: [
      { title: 'Windows Installation',        desc: 'Clean Windows installation, reinstallation, or OS upgrades.' },
      { title: 'Linux Installation',          desc: 'Ubuntu, Kali, and other Linux distributions installed and configured.' },
      { title: 'Driver Troubleshooting',      desc: 'Missing or outdated drivers diagnosed and installed.' },
      { title: 'Software Installation',       desc: 'Office, design tools, and business applications installed and configured.' },
      { title: 'BSOD & Crash Repair',         desc: 'Blue Screen of Death and system crash root-cause diagnosis and fix.' },
      { title: 'Boot Failure Repair',         desc: 'System won\'t start? We recover and repair the boot environment.' },
      { title: 'PC Optimization',             desc: 'Performance tuning to speed up slow computers significantly.' },
    ],
  },
  {
    slug: 'virus-security',
    title: 'Virus & Security',
    shortDesc: 'Complete virus removal, malware cleanup, ransomware recovery, and system security hardening.',
    icon: '🛡️',
    color: 'coral',
    subServices: [
      { title: 'Virus & Malware Removal',     desc: 'Deep scan and complete removal of viruses, adware, and malware.' },
      { title: 'Spyware Removal',             desc: 'Spyware and stalkerware detected and fully removed.' },
      { title: 'Ransomware Cleanup',          desc: 'Ransomware removed and system restored wherever possible.' },
      { title: 'Antivirus Setup',             desc: 'Antivirus installed, configured, and tested for ongoing protection.' },
      { title: 'System Security Hardening',   desc: 'Security settings tightened to reduce attack surface.' },
      { title: 'Browser Hijack Removal',      desc: 'Unwanted toolbars, extensions, and redirects completely removed.' },
    ],
  },
  {
    slug: 'data-services',
    title: 'Data Services',
    shortDesc: 'Data recovery from damaged drives, file rescue, drive cloning, backup setup, and data transfers.',
    icon: '💾',
    color: 'teal',
    subServices: [
      { title: 'Data Recovery',               desc: 'Recover data from physically damaged, corrupted, or crashed drives.' },
      { title: 'Deleted File Recovery',       desc: 'Recover accidentally deleted files and emptied recycle bins.' },
      { title: 'Hard Drive Cloning',          desc: 'Clone your drive for migration or backup — no data loss.' },
      { title: 'OS Migration (HDD to SSD)',   desc: 'Move your operating system to a new SSD for a speed boost.' },
      { title: 'Backup Setup & Recovery',     desc: 'Automated backup systems configured so you never lose data again.' },
      { title: 'Data Transfer',               desc: 'Transfer data between computers, drives, or devices safely.' },
    ],
  },
  {
    slug: 'networking',
    title: 'Networking',
    shortDesc: 'Router configuration, WiFi troubleshooting, home and office network setup, and printer networking.',
    icon: '🌐',
    color: 'coral',
    subServices: [
      { title: 'Router Configuration',        desc: 'Routers properly configured for security and performance.' },
      { title: 'WiFi Troubleshooting',        desc: 'Weak signal, drops, or connectivity issues diagnosed and fixed.' },
      { title: 'Home & Office Network Setup', desc: 'Full network design and installation for homes and offices.' },
      { title: 'Printer Network Setup',       desc: 'Printers connected and shared across your network seamlessly.' },
      { title: 'Internet Connectivity',       desc: 'ISP and connectivity issues diagnosed and resolved.' },
    ],
  },
  {
    slug: 'business-it-support',
    title: 'Business IT Support',
    shortDesc: 'Monthly IT support contracts, office setup, IT consultation, and managed services for SMEs.',
    icon: '🏢',
    color: 'teal',
    subServices: [
      { title: 'Office Computer Setup',       desc: 'New office computers set up, configured, and ready for your team.' },
      { title: 'Network Installation',        desc: 'Office network cabling, switches, and WiFi installed professionally.' },
      { title: 'Printer Setup & Maintenance', desc: 'Office printers installed, networked, and kept running smoothly.' },
      { title: 'Data Backup Systems',         desc: 'Automated backup solutions protecting your business data.' },
      { title: 'IT Consultation',             desc: 'Expert advice on technology decisions for small businesses.' },
      { title: 'Monthly IT Support Contracts', desc: 'Ongoing managed IT support at a fixed monthly rate.' },
    ],
  },
  {
    slug: 'setup-installation',
    title: 'Setup & Installation',
    shortDesc: 'New device setup, software packages, email configuration, printers, and smart device connections.',
    icon: '⚙️',
    color: 'coral',
    subServices: [
      { title: 'New Computer Setup',          desc: 'New laptop or desktop fully set up, updated, and ready to use.' },
      { title: 'Software Installation',       desc: 'Software packages installed and configured to your requirements.' },
      { title: 'Email Setup',                 desc: 'Business and personal email accounts configured on all devices.' },
      { title: 'Printer Installation',        desc: 'Printers installed, drivers configured, and test pages printed.' },
      { title: 'Smart Device Connection',     desc: 'Phones, tablets, and smart devices connected and synced.' },
    ],
  },
  {
    slug: 'upgrade-services',
    title: 'Upgrade Services',
    shortDesc: 'SSD, RAM, and GPU upgrades, laptop performance upgrades, and custom gaming PC builds.',
    icon: '⚡',
    color: 'teal',
    subServices: [
      { title: 'SSD / HDD Upgrades',         desc: 'Swap your old drive for a fast SSD — same data, dramatically faster.' },
      { title: 'RAM Upgrades',               desc: 'More RAM for smoother multitasking and faster performance.' },
      { title: 'GPU Upgrades',               desc: 'Graphics card upgrades for better visuals and rendering.' },
      { title: 'Laptop Performance Upgrades', desc: 'Combination of SSD, RAM, and thermal improvements for slow laptops.' },
      { title: 'Gaming PC Builds',           desc: 'Custom gaming PCs built to your spec and budget.' },
    ],
  },
  {
    slug: 'onsite-support',
    title: 'On-Site Support',
    shortDesc: 'We come to you — home computer repairs, office IT visits, and emergency response.',
    icon: '🚗',
    color: 'coral',
    subServices: [
      { title: 'Home Computer Repair',        desc: 'Technician visits your home for repairs and support.' },
      { title: 'Office IT Support Visits',    desc: 'Scheduled or on-demand visits to your business premises.' },
      { title: 'Emergency IT Repair',         desc: 'Urgent same-day response for critical IT failures.' },
    ],
  },
  {
    slug: 'extra-services',
    title: 'Extra Services',
    shortDesc: 'Laptop buying advice, refurbished computer sales, custom PC builds, and cyber services.',
    icon: '🌟',
    color: 'teal',
    subServices: [
      { title: 'Laptop Buying Consultation',  desc: 'Expert advice on the right laptop for your needs and budget.' },
      { title: 'Refurbished Computer Sales',  desc: 'Quality-tested refurbished computers at affordable prices.' },
      { title: 'Used Laptop Upgrades & Resale', desc: 'We upgrade used laptops to sell-ready condition.' },
      { title: 'Custom PC Builds',            desc: 'Workstations and desktops built to your exact specifications.' },
      { title: 'Cyber Services',              desc: 'Printing, scanning, and photocopying services available in-store.' },
    ],
  },
];

export const whyChooseUs = [
  {
    title: 'Skilled Technicians',
    desc: 'Our engineers are skilled across hardware, software, networking, and security — one team for everything.',
    icon: '🎓',
  },
  {
    title: 'Fast Turnaround',
    desc: 'Most repairs completed same-day or next-day. We know downtime costs you.',
    icon: '⚡',
  },
  {
    title: 'Transparent Pricing',
    desc: 'We diagnose first and quote before we touch anything. No hidden fees, ever.',
    icon: '💎',
  },
  {
    title: 'Genuine Parts',
    desc: 'Only quality-certified parts used for all hardware repairs and upgrades.',
    icon: '✅',
  },
  {
    title: 'We Come to You',
    desc: 'On-site support available for homes and offices — no need to bring your device in.',
    icon: '🚗',
  },
  {
    title: 'Proudly Kenyan',
    desc: 'Based on Thika Road, Nairobi. We understand local needs and serve our community.',
    icon: '🇰🇪',
  },
];

export const featuredProjects = [
  {
    slug: 'school-network-nairobi',
    title: 'School Network Infrastructure',
    category: 'Networking',
    client: 'Secondary School, Nairobi',
    description:
      'Deployed a full WiFi and structured cabling network covering 40 classrooms, enabling reliable digital learning for over 1,200 students.',
    outcome: '1,200 students now have reliable internet access',
    tags: ['WiFi', 'Networking', 'Education'],
  },
  {
    slug: 'ngo-it-support',
    title: 'Managed IT Support — NGO',
    category: 'Business IT Support',
    client: 'Development NGO, Kenya',
    description:
      'Provided full managed IT support for a 35-person NGO including monthly contracts, device maintenance, and security hardening.',
    outcome: '90% reduction in recurring IT issues within 3 months',
    tags: ['Business IT', 'NGO', 'Security'],
  },
  {
    slug: 'smb-bulk-upgrades',
    title: 'SME Fleet Upgrade',
    category: 'Upgrade Services',
    client: 'Retail Business, Nairobi',
    description:
      'Upgraded 20 aging office computers with SSDs and RAM, tripling performance without replacing any hardware.',
    outcome: '3× speed improvement across the entire office fleet',
    tags: ['SSD Upgrade', 'RAM', 'Business IT'],
  },
];

export const industries = [
  { name: 'Education',   icon: '🎓' },
  { name: 'Healthcare',  icon: '🏥' },
  { name: 'Retail',      icon: '🛒' },
  { name: 'NGOs',        icon: '🌍' },
  { name: 'SMEs',        icon: '🏢' },
  { name: 'Government',  icon: '🏛️' },
];

export const testimonials = [
  {
    name: 'James Mwangi',
    role: 'IT Manager',
    company: 'Nairobi School',
    quote:
      'Zollani Tech set up our entire school network professionally. Fast, clean work and the team was respectful of our environment. Highly recommended.',
    rating: 5,
    initials: 'JM',
  },
  {
    name: 'Sarah Ochieng',
    role: 'Operations Director',
    company: 'Development NGO',
    quote:
      'We have a monthly IT support contract with Zollani Tech and it\'s been the best investment. Issues get resolved fast and they\'re always reachable on WhatsApp.',
    rating: 5,
    initials: 'SO',
  },
  {
    name: 'David Kamau',
    role: 'Managing Director',
    company: 'Retail Business',
    quote:
      'My laptop had a dead screen and a failing hard drive. They replaced both, recovered all my data, and had it back to me the same day. Excellent service.',
    rating: 5,
    initials: 'DK',
  },
];

export const foundationStats = [
  { value: '300+', label: 'Youth Trained' },
  { value: '5',    label: 'Communities Reached' },
  { value: '12',   label: 'Training Programs' },
];

export const foundationPrograms = [
  {
    title: 'Digital Skills Bootcamp',
    desc: 'Intensive technology training for unemployed youth — computer basics, internet literacy, and job-ready digital skills.',
  },
  {
    title: 'School Technology Lab',
    desc: 'Partnering with public schools to set up and maintain computer labs, giving students real hands-on access.',
  },
  {
    title: 'Women in Tech',
    desc: 'Dedicated programs increasing female participation in technology careers through mentorship and practical training.',
  },
];

export const teamMembers = [
  {
    name: 'Founder & Lead Technician',
    role: 'Leadership',
    initials: 'ZT',
    bio: 'Technology entrepreneur with hands-on expertise in hardware repair, networking, and business IT support across East Africa.',
  },
];

export const blogPosts = [
  {
    slug: 'protect-business-from-ransomware',
    title: '5 Steps to Protect Your Business from Ransomware',
    category: 'Cybersecurity',
    excerpt:
      'Ransomware attacks are increasing across East Africa. Here\'s what every business must do to stay protected right now.',
    date: '2026-05-20',
    readTime: '5 min read',
  },
  {
    slug: 'ssd-upgrade-benefits',
    title: 'Why an SSD Upgrade Is the Best Money You\'ll Spend on Your Old Laptop',
    category: 'Upgrades',
    excerpt:
      'A KES 5,000 SSD upgrade can make a 5-year-old laptop feel brand new. Here\'s exactly what changes and why it matters.',
    date: '2026-05-10',
    readTime: '4 min read',
  },
  {
    slug: 'laptop-maintenance-guide',
    title: 'The Complete Business Laptop Maintenance Guide',
    category: 'Maintenance',
    excerpt:
      'Regular laptop maintenance extends device life by 2–3 years and prevents costly breakdowns. Follow this guide to protect your investment.',
    date: '2026-04-28',
    readTime: '6 min read',
  },
];
