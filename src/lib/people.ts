// One entry per birthday person. Each gets their own page at /<slug>.
// To add someone: copy a block, change the details, drop photos in /public/<slug>/.

export type Photo = { src: string; caption: string; position?: string };

export type Person = {
  slug: string;
  name: string;
  /** what the letter and small text call them */
  shortName: string;
  /** shown big in the hero, e.g. "Happy 20th," */
  heroLine: string;
  /** month is 1-12. Before this day the page shows a countdown, from midnight it celebrates. */
  birthday: { month: number; day: number };
  theme: 'ember' | 'marigold';
  themeColor: string;
  hero: { src: string; alt: string; position: string; positionDesktop?: string };
  ogImage: string;
  eyebrow: string;
  marquee: string[];
  letter: { greeting: string; paragraphs: string[]; signoff: string };
  photos?: { eyebrow: string; title: [string, string]; text: string; items: Photo[] };
  video?: { src: string; eyebrow: string; title: [string, string]; text: string };
  wishes?: { eyebrow: string; title: [string, string]; text: string; items: string[] };
  cake: { candles: number; candleColors: string[]; topper?: string };
  outro: [string, string];
  confetti: string[];
};

export const PEOPLE: Person[] = [
  {
    slug: 'suman',
    name: 'Suman',
    shortName: 'Suman',
    heroLine: 'Happy birthday,',
    birthday: { month: 11, day: 19 },
    theme: 'ember',
    themeColor: '#0e0a07',
    hero: {
      src: '/suman/instappa-post-DFLPnQJTO9v-1.jpg',
      alt: 'Suman by the campfire',
      position: '58% 30%',
    },
    ogImage: '/og/suman.jpg',
    eyebrow: 'Today is all yours',
    marquee: ['happy birthday', 'suman', 'another lap around the sun', 'eat the cake', 'make a wish'],
    letter: {
      greeting: 'Suman,',
      paragraphs: [
        "Another year around the sun, and somehow you're still the calmest one at the campfire, the guy quietly turning the skewer while everyone else is busy talking.",
        'Thank you for the trips, the waterfalls, the late nights, and for showing up every single time it mattered. You have a way of making ordinary days feel like something worth remembering.',
        'I hope this year is kind to you. More mountains, more good food, more people who love you the way you deserve. And whatever you wish for when you blow out those candles, I hope it finds you fast.',
        'Happy birthday. Eat too much cake.',
      ],
      signoff: 'with love, always',
    },
    photos: {
      eyebrow: 'Evidence',
      title: ["Proof you've been", 'living it up'],
      text: "Campfires, waterfalls, nights out. Here's to a year with even more of these.",
      items: [
        { src: '/suman/instappa-post-DFLPnQJTO9v-1.jpg', caption: 'campfire chef', position: '55% 40%' },
        { src: '/suman/instappa-post-DKKL623TNDR-1.jpg', caption: 'waterfall mode: on', position: '50% 35%' },
        { src: '/suman/instappa-post-DfkS_hlmQkB-1.jpg', caption: 'all dressed up', position: '50% 25%' },
      ],
    },
    video: {
      src: '/suman/instappa-reel-DSsDAn3DK5d.mp4',
      eyebrow: 'Now playing',
      title: ['Main character', 'energy.'],
      text: 'Press play. The birthday song will wait.',
    },
    cake: {
      candles: 7,
      candleColors: ['#f2c46d', '#ff7a2f', '#f6ecdc', '#e9a3a3', '#f2c46d', '#ff7a2f', '#f6ecdc'],
    },
    outro: ["Here's to", 'you'],
    confetti: ['#f2c46d', '#ff7a2f', '#f6ecdc', '#e9a3a3', '#ffd28a'],
  },
  {
    slug: 'debolina',
    name: 'Debolina',
    shortName: 'Debo',
    heroLine: 'Happy 20th,',
    birthday: { month: 11, day: 23 },
    theme: 'marigold',
    themeColor: '#18080c',
    hero: {
      src: '/debolina/instappa-post-DcvFxowmE10-1.webp',
      alt: 'Debolina in a red lehenga',
      position: '44% 30%',
      positionDesktop: '50% 22%',
    },
    ogImage: '/og/debolina.jpg',
    eyebrow: 'Twenty looks good on you',
    marquee: ['happy birthday', 'debo', 'officially twenty', 'no more teens', 'make a wish'],
    letter: {
      greeting: 'Debo,',
      paragraphs: [
        "Twenty. I honestly can't decide if that makes you very grown up or just makes me old. Probably both.",
        "Somewhere between the fights over the remote and the late-night chats, you turned into someone I'm really proud of. Kind without trying, stubborn when it counts, and somehow you make every room a little brighter. That yellow kurta isn't the only reason.",
        "This is your year. Go after the things that scare you a little. Laugh too loud. Eat dessert first. And whenever you need someone in your corner, you know exactly who to call.",
        "Happy 20th. Love you (don't make it weird).",
      ],
      signoff: 'your favourite brother',
    },
    photos: {
      eyebrow: 'The birthday girl',
      title: ['Every look,', 'a main character.'],
      text: 'Lehengas, kurtas, sundresses. Zero notes. She has range.',
      items: [
        { src: '/debolina/instappa-post-DcvFxowmE10-1.webp', caption: 'festive queen', position: '50% 25%' },
        { src: '/debolina/instappa-post-DANclXnykV8-1.webp', caption: 'birthday mood', position: '50% 20%' },
        { src: '/debolina/debolina.jpg', caption: 'golden hour', position: '48% 70%' },
        { src: '/debolina/instappa-post-DSEvzS_DQFn-1.webp', caption: 'road trip ready', position: '48% 30%' },
      ],
    },
    wishes: {
      eyebrow: '20 for 20',
      title: ['Twenty wishes,', 'one for every year.'],
      text: 'Tap a card to open it. Open all twenty for a surprise.',
      items: [
        "Chai that's always the right temperature",
        'A playlist with zero skips',
        'Exams easier than you feared',
        'Friends who always show up',
        'Zero bad hair days',
        'More trips, fewer worries',
        'Courage for the scary-good things',
        'Unlimited mishti, no guilt',
        "Ma's cooking on demand",
        'Late-night talks that fix everything',
        'A camera roll full of good days',
        'Someone to share fries with',
        'Sundays that feel like holidays',
        'Your phone at 100%, always',
        'Rain exactly when you want it',
        'Big dreams, bigger wins',
        'Being your own favourite person',
        "A brother who'll still annoy you (me)",
        'Every outfit ironed on time',
        'Your happiest year yet',
      ],
    },
    cake: {
      candles: 5,
      candleColors: ['#f5b82e', '#e8456e', '#fff1e0', '#f5b82e', '#e8456e'],
      topper: '20',
    },
    outro: ['Twenty and', 'thriving'],
    confetti: ['#f5b82e', '#e8456e', '#fff1e0', '#ffd98a', '#ff9ab3'],
  },
];

export function getPerson(slug: string) {
  return PEOPLE.find((p) => p.slug === slug);
}
