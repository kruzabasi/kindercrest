export type NavItem = {
  label: string;
  href: string;
};

export type NavGroup = NavItem & {
  children?: NavItem[];
};

export type Programme = {
  title: string;
  ages: string;
  hours: string;
  description: string;
  image: string;
  imageAlt: string;
  accent: 'sky' | 'green' | 'gold';
};

export type ValueCard = {
  title: string;
  description: string;
  icon: 'heart' | 'spark' | 'users' | 'shield' | 'book' | 'hand';
  accent: 'sky' | 'magenta' | 'green' | 'gold' | 'orange';
  illustration?: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: 'instagram';
};

export type FooterColumn = {
  title: string;
  links: NavItem[];
};

export const routes = {
  home: '/',
  about: '/#about',
  values: '/#values',
  faq: '/#faq',
  learning: '/#learning',
  admissions: '/#admissions',
  contact: '/contact'
} as const;

export const images = {
  outdoorPlay: '/assets/images/outdoor-play.jpg',
  playgroundLearning: '/assets/images/playground-learning.jpg',
  classroomActivity: '/assets/images/classroom-activity.jpg',
  musicClass: '/assets/images/music-class.jpg',
  creativeLearning: '/assets/images/creative-learning.jpg'
} as const;

export const heroSlides = [
  {
    image: images.outdoorPlay,
    position: 'center 38%'
  },
  {
    image: images.playgroundLearning,
    position: 'center 42%'
  },
  {
    image: images.classroomActivity,
    position: 'center 42%'
  },
  {
    image: images.musicClass,
    position: 'center 42%'
  },
  {
    image: images.creativeLearning,
    position: 'center 42%'
  }
];

export const navGroups: NavGroup[] = [
  { label: 'Home', href: routes.home },
  {
    label: 'About us',
    href: routes.about,
    children: [
      { label: 'About Kindercrest', href: routes.about },
      { label: 'Why Kindercrest', href: routes.values },
      { label: 'Parent Questions', href: routes.faq }
    ]
  },
  {
    label: 'Learning',
    href: routes.learning,
    children: [
      { label: 'Creche', href: routes.learning },
      { label: 'Early Years', href: routes.learning },
      { label: 'Grade School', href: routes.learning }
    ]
  },
  { label: 'Admissions', href: routes.admissions },
  { label: 'Contact', href: routes.contact }
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Kindercrest School',
    links: [
      { label: 'Home', href: routes.home },
      { label: 'About', href: routes.about },
      { label: 'Learning', href: routes.learning },
      { label: 'Admissions', href: routes.admissions },
      { label: 'Contact', href: routes.contact }
    ]
  },
  {
    title: 'About',
    links: [
      { label: 'Welcome', href: routes.about },
      { label: 'Why Kindercrest', href: routes.values },
      { label: 'Our Values', href: routes.values },
      { label: 'Parent Questions', href: routes.faq }
    ]
  },
  {
    title: 'School',
    links: [
      { label: 'Creche', href: routes.learning },
      { label: 'Early Years', href: routes.learning },
      { label: 'Grade School', href: routes.learning },
      { label: 'Book a Visit', href: routes.admissions }
    ]
  }
];

export const contact = {
  schoolName: 'Kindercrest School',
  tagline: 'Learning for life and learning through community',
  addressLines: ['2 R.S Tahir Street, Lifecamp', 'Abuja'],
  phones: ['08183275414', '08099067444'],
  email: 'admin@kindercrestschool.com'
};

export const contactForm = {
  minWords: 12,
  maxWords: 180,
  successMessage: `Your email app should open with your message. If it does not, please email ${contact.email} directly.`
};

export const mailSubjects = {
  admissions: 'Kindercrest Admissions Enquiry',
  contactForm: 'Kindercrest Parent Enquiry',
  parentQuestion: 'Kindercrest Parent Question'
} as const;

export const getMailtoHref = (subject?: string) =>
  subject ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}` : `mailto:${contact.email}`;

export const socialLinks: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/kindercrest?igsh=OXc3a295bzU2NGl5',
    icon: 'instagram'
  }
];

export const programmes: Programme[] = [
  {
    title: 'Creche',
    ages: 'Ages 3 months - 1 year',
    hours: '08:00am - 04:00pm',
    description:
      'A calm, nurturing start for our youngest children, with attentive care, gentle routines, and age-appropriate indoor and outdoor discovery.',
    image: images.creativeLearning,
    imageAlt: 'Kindercrest child enjoying a calm classroom activity.',
    accent: 'sky'
  },
  {
    title: 'Early Years',
    ages: 'Ages 1 - 5',
    hours: '08:00am - 01:00pm',
    description:
      'Pre Nursery, Nursery 1, and Nursery 2 introduce children to learning through play, creativity, language, movement, and social confidence.',
    image: images.outdoorPlay,
    imageAlt: 'Kindercrest children learning through outdoor play.',
    accent: 'green'
  },
  {
    title: 'Grade School',
    ages: 'Ages 6 - 14',
    hours: '08:00am - 02:00pm',
    description:
      'A structured primary pathway that builds academic confidence, character, curiosity, and the habits children need for future success.',
    image: images.musicClass,
    imageAlt: 'Kindercrest pupils practising music together in class.',
    accent: 'gold'
  }
];

export const valueCards: ValueCard[] = [
  {
    title: 'Holistic Development',
    description:
      'Kindercrest focuses on the holistic development of children, providing a well-rounded education that nurtures not only academic skills but also social, emotional, and physical development.',
    icon: 'spark',
    accent: 'gold',
    illustration: '/assets/illustrations/holistic-development.png'
  },
  {
    title: 'Child-Centered Approach',
    description:
      'The school adopts a child-centered approach, tailoring education to the individual needs, interests, and learning styles of each child. This promotes a positive and supportive learning environment where every child can thrive.',
    icon: 'heart',
    accent: 'magenta',
    illustration: '/assets/illustrations/child-centered-approach.png'
  },
  {
    title: 'A Culture of Belonging',
    description:
      'We foster a warm and inclusive community where every child is known, valued, and celebrated. This strong sense of security provides the essential emotional foundation for children to confidently explore, learn, and grow.',
    icon: 'users',
    accent: 'green',
    illustration: '/assets/illustrations/culture-of-belonging.png'
  }
];

export const characterValues: ValueCard[] = [
  {
    title: 'Honesty',
    description: 'Children learn to speak truthfully, act sincerely, and build trust in everyday moments.',
    icon: 'hand',
    accent: 'green'
  },
  {
    title: 'Responsibility',
    description: 'We guide children to care for themselves, their work, their classmates, and their environment.',
    icon: 'shield',
    accent: 'sky'
  },
  {
    title: 'Kindness',
    description: 'A thoughtful school culture helps children practise empathy, patience, and generosity.',
    icon: 'heart',
    accent: 'magenta'
  },
  {
    title: 'Integrity',
    description: 'Pupils are encouraged to do what is right and to take pride in careful, honest effort.',
    icon: 'book',
    accent: 'gold'
  },
  {
    title: 'Respect',
    description: 'We model respect for people, ideas, differences, learning spaces, and shared routines.',
    icon: 'users',
    accent: 'orange'
  }
];

export const faqs: FAQ[] = [
  {
    question: 'How are children assessed and monitored for progress?',
    answer:
      'We use observation, checklists, portfolios, and developmental screenings. Progress updates are shared with parents so families understand each child’s growth and next steps.'
  },
  {
    question: 'What measures are in place to ensure the safety and security of the children?',
    answer:
      'Safety is central to daily school life. Kindercrest uses supervised indoor and outdoor routines, controlled access, safety protocols, staff checks, and regular safety drills.'
  },
  {
    question: 'What is the admission process?',
    answer:
      'Families complete an application, share relevant documents, and schedule an assessment or conversation where needed. The admissions team can guide each family through the exact requirements.'
  },
  {
    question: 'How do you support children with special educational needs or learning differences?',
    answer:
      'Kindercrest believes in inclusive education. Staff work with parents and relevant specialists to understand each child’s needs and adapt learning support where appropriate.'
  }
];
