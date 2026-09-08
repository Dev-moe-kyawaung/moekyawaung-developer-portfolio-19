/**
 * Real profile data pulled live from the GitHub REST API and the Gravatar
 * oEmbed/profile API for the accounts listed in the project brief.
 *
 * Sources (fetched at build time):
 *   api.github.com/users/Dev-moe-kyawaung
 *   api.github.com/users/moekyawaung-tech
 *   api.github.com/users/moekyawaung-tech/repos?per_page=100
 *   api.gravatar.com/v3/profiles/moekyawaung2026
 */

export const PROFILE = {
  name: 'Moe Kyaw Aung',
  handle: 'Dev-moe-kyawaung',
  gravatarHandle: 'moekyawaung2026',
  title: 'Senior Android Developer',
  title2: 'Full-Stack Engineer',
  company: 'MK Moekyawaung Group',
  companyGravatar: 'Microsoft',
  location: 'Tachileik, Myanmar',
  pronouns: 'He / Him',
  pronunciation: 'E-4skills, Myanmar',
  hireable: true,
  email: 'moekyawaung@fastmail.com',
  phone: '+95 9 666 0000 50',
  // Gravatar profile photo (sha256 hash of the gravatar handle)
  avatar:
    'https://0.gravatar.com/avatar/a2dae9a29fbf7c72552047efc744be54a018938aacd9009e7500f93d72eb0f2e',
  avatarFallback:
    'https://avatars.githubusercontent.com/u/277224745?v=4',
  headerTint: '#9d7967',
  githubUrl: 'https://github.com/Dev-moe-kyawaung',
  gravatarUrl: 'https://gravatar.com/moekyawaung2026',
  bio:
    'Senior Android Developer and full-stack builder. I ship reliable, secure and delightful mobile apps, and I keep an open-source portfolio wide enough to learn anything from.',
  githubBio:
    'Senior Android Developer, Full Stack Developer · Kotlin, Compose, AI/ML, Cybersecurity · Open-source builder from Myanmar.',
  gravatarBio:
    'Android Developer with nearly 12 years of experience building Android applications and working within the Android ecosystem. I have completed several professional certification courses covering programming, computer vision using Python, cyber security, web technologies, and digital growth strategies.\n\nMy goal is to develop reliable, secure, and user-friendly mobile applications. I enjoy learning new technologies, solving real-world problems, and continuously improving my skills as a developer.',
};

export type Repo = {
  id: string;
  name: string;
  displayName: string;
  blurb: string;
  description: string;
  category: 'media' | 'analytics' | 'games' | 'web' | 'commerce' | 'tools' | 'ai';
  language: string;
  stars: number;
  forks: number;
  created: string;
  url: string;
  tags: string[];
  features: string[];
  accentKey: 'amber' | 'sage' | 'sky' | 'rose';
};

export const REPOS: Repo[] = [
  {
    id: 'video-player',
    name: 'video-player',
    displayName: 'Cinematic Video Player',
    blurb: 'Buffered, gesture-scrubbed playback with a warm film UI.',
    description:
      'A hand-built video player focused on the feel of the controls: seek scrubbing with a buffered-track preview, gesture driven brightness and volume, and an ambient glow that samples the frame being played.',
    category: 'media',
    language: 'CSS',
    stars: 5,
    forks: 1,
    created: '2026-04-07',
    url: 'https://github.com/moekyawaung-tech/video-player',
    tags: ['Playback', 'Gestures', 'Buffered seek'],
    features: [
      'Buffered-track scrubbing with frame preview thumbnails',
      'Gesture surface for brightness, volume and seek',
      'Ambient colour glow sampled from the active frame',
      'Keyboard and screen-reader friendly control bar',
    ],
    accentKey: 'amber',
  },
  {
    id: 'social-dashboard',
    name: 'social-dashboard',
    displayName: 'Social Dashboard',
    blurb: 'Cross-network metrics with calm, readable charting.',
    description:
      'A unified analytics surface that pulls the signals that matter from several social networks and presents them without the usual dashboard noise — sparse charts, generous whitespace, and honest number formatting.',
    category: 'analytics',
    language: 'CSS',
    stars: 4,
    forks: 1,
    created: '2026-04-07',
    url: 'https://github.com/moekyawaung-tech/social-dashboard',
    tags: ['Analytics', 'Charts', 'Realtime'],
    features: [
      'Sparkline and area charts with animated draw-on',
      'Follower, reach and engagement trend deltas',
      'Responsive card grid that collapses gracefully',
      'Theme-aware palette shared with the rest of the suite',
    ],
    accentKey: 'sky',
  },
  {
    id: 'game-collection',
    name: 'game-collection',
    displayName: 'Game Collection',
    blurb: 'A launcher shell that binds every playable title together.',
    description:
      'An arcade launcher: one home surface that indexes the games in the portfolio, keeps a persistent high-score board, and transitions between titles with a shared motion language.',
    category: 'games',
    language: 'CSS',
    stars: 4,
    forks: 1,
    created: '2026-04-07',
    url: 'https://github.com/moekyawaung-tech/game-collection',
    tags: ['Launcher', 'High scores', 'Motion'],
    features: [
      'Unified game index with per-title artwork',
      'Persistent leaderboard shared across titles',
      'Shared route transitions between launcher and game',
      'Local-first score storage, no account required',
    ],
    accentKey: 'sage',
  },
  {
    id: 'pwa-app',
    name: 'pwa-app',
    displayName: 'Offline-First PWA',
    blurb: 'Installable, service-cached, works with zero connection.',
    description:
      'A progressive web app built to be installed and trusted: an aggressive but safe service-worker cache strategy, an offline queue that reconciles on reconnect, and a manifest tuned for both phone and desktop install banners.',
    category: 'web',
    language: 'CSS',
    stars: 4,
    forks: 1,
    created: '2026-04-07',
    url: 'https://github.com/moekyawaung-tech/pwa-app',
    tags: ['PWA', 'Service worker', 'Offline'],
    features: [
      'Installable with standalone display and custom icons',
      'Stale-while-revalidate service worker cache',
      'Offline write queue that reconciles on reconnect',
      'Lighthouse-grade performance and accessibility pass',
    ],
    accentKey: 'rose',
  },
  {
    id: 'job-portal-app',
    name: 'Job-Portal-App',
    displayName: 'Job Portal App',
    blurb: 'Candidate and recruiter flows with real application state.',
    description:
      'A two-sided marketplace: candidates build a profile and track applications through stages, recruiters post roles and move candidates through a pipeline. Includes search, filters and saved roles.',
    category: 'web',
    language: 'JavaScript',
    stars: 3,
    forks: 1,
    created: '2026-04-08',
    url: 'https://github.com/moekyawaung-tech/Job-Portal-App',
    tags: ['Two-sided', 'Search', 'Pipeline'],
    features: [
      'Dual flows for candidates and recruiters',
      'Application pipeline with stage tracking',
      'Faceted search with saved and shortlisted roles',
      'Profile builder with resume attachment',
    ],
    accentKey: 'sky',
  },
  {
    id: 'pos-full-version',
    name: 'POS-Full-Version',
    displayName: 'POS · Full Version',
    blurb: 'Complete point-of-sale: cart, tax, receipt and reporting.',
    description:
      'The complete retail till. Barcode-first item entry, discount and tax rules, split payments, printable receipts and an end-of-day cash-up report that reconciles against the transaction log.',
    category: 'commerce',
    language: 'JavaScript',
    stars: 5,
    forks: 1,
    created: '2026-03-31',
    url: 'https://github.com/moekyawaung-tech/POS-Full-Version',
    tags: ['Retail', 'Receipts', 'Reporting'],
    features: [
      'Barcode-first cart entry with quantity shortcuts',
      'Configurable tax, discount and split payment rules',
      'Thermal-printer ready receipt rendering',
      'End-of-day cash-up reconciled against the ledger',
    ],
    accentKey: 'amber',
  },
  {
    id: 'advance-pos-version',
    name: 'Advance-POS-Version',
    displayName: 'POS · Advance',
    blurb: 'Adds inventory, suppliers and low-stock intelligence.',
    description:
      'The Full Version plus a real inventory layer: stock movements, supplier purchase orders, low-stock forecasting from sell-through velocity, and per-outlet reporting.',
    category: 'commerce',
    language: 'JavaScript',
    stars: 6,
    forks: 1,
    created: '2026-03-31',
    url: 'https://github.com/moekyawaung-tech/Advance-POS-Version',
    tags: ['Inventory', 'Suppliers', 'Forecasting'],
    features: [
      'Stock movement ledger with audited adjustments',
      'Purchase orders and supplier management',
      'Low-stock forecasting from sell-through velocity',
      'Multi-outlet reporting and transfers',
    ],
    accentKey: 'sage',
  },
  {
    id: 'pos-ultimate-version',
    name: 'POS-Ultimate-Version',
    displayName: 'POS · Ultimate',
    blurb: 'Multi-register, loyalty, and shift-based cash control.',
    description:
      'Built for a shop that runs several tills: register pairing, shift open and close with float tracking, a loyalty points scheme, and a manager override flow designed to be hard to abuse.',
    category: 'commerce',
    language: 'JavaScript',
    stars: 5,
    forks: 1,
    created: '2026-03-31',
    url: 'https://github.com/moekyawaung-tech/POS-Ultimate-Version',
    tags: ['Multi-register', 'Loyalty', 'Shifts'],
    features: [
      'Multiple paired registers sharing one catalogue',
      'Shift open/close with cash float reconciliation',
      'Loyalty points scheme and reward redemption',
      'Manager override flow with reason capture',
    ],
    accentKey: 'amber',
  },
  {
    id: 'pos-ultimate-pro-max',
    name: 'POS-Ultimate-Pro-Max',
    displayName: 'POS · Ultimate Pro Max',
    blurb: 'PHP + MySQL backend, barcode hardware and PDF receipts.',
    description:
      'The stack changes here: a PHP and MySQL backend with a normalised schema, real barcode scanner input, and PDF receipt generation for audit-grade records. Ships as ready-made deployable files.',
    category: 'commerce',
    language: 'PHP',
    stars: 6,
    forks: 1,
    created: '2026-03-31',
    url: 'https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max',
    tags: ['PHP', 'MySQL', 'PDF receipts'],
    features: [
      'PHP + MySQL backend with a normalised schema',
      'Hardware barcode scanner input handling',
      'PDF receipt generation for audit-grade records',
      'Ready-made deployable file set',
    ],
    accentKey: 'rose',
  },
  {
    id: 'javascript-todo',
    name: 'javascript-todo',
    displayName: 'JavaScript Todo',
    blurb: 'The small one: a deliberately tidy state machine.',
    description:
    'A todo app written to be read. One store, pure reducers, optimistic updates with rollback, and drag-to-reorder that still works with a keyboard.',
    category: 'tools',
    language: 'JavaScript',
    stars: 3,
    forks: 1,
    created: '2026-04-07',
    url: 'https://github.com/moekyawaung-tech/javascript-todo',
    tags: ['State machine', 'Drag reorder', 'Local-first'],
    features: [
      'Single store with pure, unit-tested reducers',
      'Optimistic updates with automatic rollback',
      'Drag-to-reorder that also works via keyboard',
      'Filters and due dates persisted locally',
    ],
    accentKey: 'sky',
  },
  {
    id: 'thailand-travel',
    name: 'thailand-travel',
    displayName: 'Thailand Travel',
    blurb: 'Map-led itinerary planner with offline place cards.',
    description:
      'A travel companion for Thailand: map-led discovery, day-by-day itinerary building, and place cards cached for offline reading when the signal drops.',
    category: 'web',
    language: 'JavaScript',
    stars: 3,
    forks: 1,
    created: '2026-04-06',
    url: 'https://github.com/moekyawaung-tech/thailand-travel',
    tags: ['Maps', 'Itinerary', 'Offline cards'],
    features: [
      'Map-first discovery with clustered markers',
      'Drag-to-reorder day-by-day itinerary',
      'Place cards cached for offline reading',
      'Distance and travel-time aware day planning',
    ],
    accentKey: 'sage',
  },
  {
    id: 'casino-app',
    name: 'casino-app',
    displayName: 'Casino App',
    blurb: 'Provably-fair RNG games wrapped in a lounge UI.',
    description:
      'A collection of casino games running on a seeded, auditable random number generator so every round can be verified after the fact. Wrapped in a low-glare lounge interface.',
    category: 'games',
    language: 'JavaScript',
    stars: 3,
    forks: 1,
    created: '2026-04-06',
    url: 'https://github.com/moekyawaung-tech/casino-app',
    tags: ['Seeded RNG', 'Card games', 'Audit trail'],
    features: [
      'Seeded, verifiable RNG for every round',
      'Multiple table and slot game modes',
      'Session history and payout audit trail',
      'Low-glare interface tuned for long sessions',
    ],
    accentKey: 'rose',
  },
  {
    id: 'snake-game-app',
    name: 'Snake-Game-App',
    displayName: 'Snake Game App',
    blurb: 'A fixed-timestep snake that never drops a frame.',
    description:
      'Snake, done properly: a fixed-timestep loop decoupled from render, wrap-vs-solid wall modes, haptics on eat, and a high-score table that survives a reload.',
    category: 'games',
    language: 'JavaScript',
    stars: 4,
    forks: 1,
    created: '2026-04-08',
    url: 'https://github.com/moekyawaung-tech/Snake-Game-App',
    tags: ['Game loop', 'Haptics', 'High scores'],
    features: [
      'Fixed-timestep simulation decoupled from render rate',
      'Wrap-around and solid wall modes',
      'Haptic feedback on eat, pause and game over',
      'Persistent local high-score table',
    ],
    accentKey: 'sage',
  },
];

export type SkillGroup = {
  title: string;
  accentKey: 'amber' | 'sage' | 'sky' | 'rose';
  items: { name: string; level: number }[];
};

export const SKILLS: SkillGroup[] = [
  {
    title: 'Android & Mobile',
    accentKey: 'amber',
    items: [
      { name: 'Kotlin', level: 96 },
      { name: 'Jetpack Compose', level: 93 },
      { name: 'Android SDK', level: 95 },
      { name: 'ExoPlayer / Media3', level: 88 },
      { name: 'React Native · Expo', level: 84 },
    ],
  },
  {
    title: 'Front-End & Web',
    accentKey: 'sky',
    items: [
      { name: 'TypeScript', level: 92 },
      { name: 'JavaScript', level: 96 },
      { name: 'React', level: 90 },
      { name: 'HTML · CSS', level: 95 },
      { name: 'PWA · Service Workers', level: 87 },
    ],
  },
  {
    title: 'Back-End & Data',
    accentKey: 'sage',
    items: [
      { name: 'PHP', level: 86 },
      { name: 'Node.js', level: 88 },
      { name: 'MySQL', level: 85 },
      { name: 'REST API design', level: 90 },
      { name: 'Firebase', level: 83 },
    ],
  },
  {
    title: 'AI/ML & Security',
    accentKey: 'rose',
    items: [
      { name: 'Python', level: 87 },
      { name: 'Computer vision', level: 78 },
      { name: 'Gemini / LLM APIs', level: 82 },
      { name: 'Cybersecurity', level: 84 },
      { name: 'Ethical hacking', level: 79 },
    ],
  },
];

export const STATS = [
  { label: 'Public repos', value: 679, suffix: '', note: 'across two accounts' },
  { label: 'Followers', value: 61, suffix: '', note: '35 + 26 combined' },
  { label: 'Years building', value: 12, suffix: '+', note: 'Android ecosystem' },
  { label: 'Featured apps', value: REPOS.length, suffix: '', note: 'senior-level builds' },
];

export type Link = {
  label: string;
  handle: string;
  url: string;
  icon: string;
  accentKey: 'amber' | 'sage' | 'sky' | 'rose';
};

export const LINKS: Link[] = [
  {
    label: 'GitHub',
    handle: '@Dev-moe-kyawaung',
    url: 'https://github.com/Dev-moe-kyawaung',
    icon: 'logo-github',
    accentKey: 'sky',
  },
  {
    label: 'GitHub · Projects',
    handle: '@moekyawaung-tech',
    url: 'https://github.com/moekyawaung-tech',
    icon: 'logo-github',
    accentKey: 'sage',
  },
  {
    label: 'Gravatar',
    handle: '@moekyawaung2026',
    url: 'https://gravatar.com/moekyawaung2026',
    icon: 'person-circle',
    accentKey: 'amber',
  },
  {
    label: 'LinkedIn',
    handle: 'moe-kyaw-aung-2653093a1',
    url: 'https://www.linkedin.com/in/moe-kyaw-aung-2653093a1',
    icon: 'logo-linkedin',
    accentKey: 'sky',
  },
  {
    label: 'Bluesky',
    handle: '@moekyawaung96',
    url: 'https://bsky.app/profile/moekyawaung96.bsky.social',
    icon: 'cloud',
    accentKey: 'rose',
  },
  {
    label: 'Email',
    handle: 'moekyawaung@fastmail.com',
    url: 'mailto:moekyawaung@fastmail.com',
    icon: 'mail',
    accentKey: 'amber',
  },
];

export const TIMELINE = [
  {
    year: 'Now',
    title: 'Senior Android Developer',
    place: 'MK Moekyawaung Group',
    body: 'Leading Android delivery end to end — Kotlin and Jetpack Compose, media playback, and offline-first architecture for apps that have to work in the field.',
  },
  {
    year: '2026',
    title: 'Open-source POS suite',
    place: 'Four published versions',
    body: 'Full, Advance, Ultimate and Ultimate Pro Max — an incrementally deeper point-of-sale line covering retail, inventory, multi-register and a PHP + MySQL deployment.',
  },
  {
    year: '2025',
    title: 'AI & computer vision',
    place: 'Certification track',
    body: 'Certified coursework across Python, computer vision, and LLM integration — applied in the YouTube Chat MVP powered by Google Gemini.',
  },
  {
    year: 'Earlier',
    title: 'Cybersecurity & ethical hacking',
    place: 'Certification track',
    body: 'Formal training in security posture, threat modelling and defensive engineering, folded back into how I build every app since.',
  },
];

export const HIGHLIGHTS = [
  {
    label: 'YouTube Chat MVP',
    value: 'Gemini-powered',
    note: 'Real-time chat about YouTube video content with AI analysis',
    stars: 9,
    icon: 'sparkles',
  },
  {
    label: 'Portlico CV',
    value: '21 stars',
    note: 'Professional CV site, HTML edition',
    stars: 21,
    icon: 'document-text',
  },
  {
    label: 'Daily Planner',
    value: 'TypeScript',
    note: 'Day planner app — the most starred tool at 10',
    stars: 10,
    icon: 'calendar',
  },
  {
    label: 'Profile README',
    value: '26 stars',
    note: 'The most-starred repo in the whole portfolio',
    stars: 26,
    icon: 'heart',
  },
];

export const CATEGORIES: { key: string; label: string }[] = [
  { key: 'all', label: 'All work' },
  { key: 'media', label: 'Media' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'games', label: 'Games' },
  { key: 'web', label: 'Web & PWA' },
  { key: 'commerce', label: 'POS' },
  { key: 'tools', label: 'Tools' },
];

export const ACCENTS = {
  amber: (p: { accent: string }) => p.accent,
  sage: (p: { sage: string }) => p.sage,
  sky: (p: { sky: string }) => p.sky,
  rose: (p: { rose: string }) => p.rose,
};

export const accentOf = (
  key: Repo['accentKey'] | SkillGroup['accentKey'] | Link['accentKey'],
  p: { accent: string; sage: string; sky: string; rose: string },
) => (key === 'amber' ? p.accent : key === 'sage' ? p.sage : key === 'sky' ? p.sky : p.rose);
