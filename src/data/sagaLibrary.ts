export type SagaCollectionId = 'start' | 'products' | 'business' | 'leadership'

export type LibraryItem = {
  title: string
  url?: string
}

export type SagaFolder = {
  id: string
  title: string
  description: string
  collection: SagaCollectionId
  folders: LibraryItem[]
  previews: LibraryItem[]
}

export const SAGA_LIBRARY_URL = 'https://thesaga.app/globalwavecreators/library'

export const SAGA_COLLECTIONS = [
  { id: 'start' as const, title: 'Start & Operate', subtitle: 'Set up, order, finance, and install' },
  { id: 'products' as const, title: 'Product Mastery', subtitle: 'Products, demonstrations, and research' },
  { id: 'business' as const, title: 'Business Growth', subtitle: 'Connect, invite, and follow up' },
  { id: 'leadership' as const, title: 'Leadership & Compliance', subtitle: 'Train, duplicate, and lead responsibly' },
] as const

export const SAGA_FOLDERS: SagaFolder[] = [
  {
    id: '15381',
    title: 'Getting Started',
    description: 'New distributor setup, launch steps, checklists, and system orientation.',
    collection: 'start',
    folders: [{ title: 'Additional trainings' }],
    previews: [
      { title: 'Getting Started Checklist for New Builders' },
      { title: 'Launch Call' },
      { title: 'System Overview Training' }
    ]
  },
  {
    id: '15397',
    title: 'Placing an Order',
    description: 'Market-specific order processes and customer documentation.',
    collection: 'start',
    folders: [
      { title: 'Generate an order link' },
      { title: 'USA orders' },
      { title: 'Canada orders' },
      { title: 'Special imports' },
      { title: 'New Zealand orders' },
      { title: 'Australia orders' }
    ],
    previews: [
      { title: 'Ordering workflow' },
      { title: 'Required documents' },
      { title: 'Customer order support' }
    ]
  },
  {
    id: '15415',
    title: 'Pricing & Financing',
    description: 'Pricing and available financing references by supported market.',
    collection: 'start',
    folders: [
      { title: 'United States' },
      { title: 'Canada' },
      { title: 'Mexico' },
      { title: 'Europe' },
      { title: 'Australia' },
      { title: 'New Zealand' },
      { title: 'Dubai / UAE' }
    ],
    previews: [
      { title: 'Global Pricing Options' }
    ]
  },
  {
    id: '15441',
    title: 'Installation, Cleaning & Pre-Filters',
    description: 'Set up and maintain Enagic equipment correctly.',
    collection: 'start',
    folders: [
      { title: 'Installation' },
      { title: 'Cleaning' },
      { title: 'Pre-filters' }
    ],
    previews: [
      { title: 'Installation guidance' },
      { title: 'Routine cleaning' },
      { title: 'Pre-filter selection' }
    ]
  },
  {
    id: '15396',
    title: 'Compensation Plan',
    description: 'Understand the Enagic opportunity, commissions, stacking, and advancement.',
    collection: 'start',
    folders: [],
    previews: [
      { title: 'Enagic Opportunity', url: 'https://player.vimeo.com/video/536022681?rel=0' },
      { title: 'Understand the Compensation Plan', url: 'https://linkmate.one/lkhod/video/34716' },
      { title: 'Commission Calculations' },
      { title: 'Strategic Stacking' },
      { title: 'In-House Financing Comp Plan' },
      { title: 'Earnings Disclosure' },
      { title: 'Filter Commissions' },
      { title: 'Roadmap to 6A2-3' }
    ]
  },
  {
    id: '15344',
    title: 'Shareable Resources',
    description: 'A complete sharing shelf for products, presentations, prices, and market conversations.',
    collection: 'products',
    folders: [
      { title: 'Kangen Water', url: 'https://thesaga.app/globalwavecreators/library?folder=15345' },
      { title: 'emGuarde EMF Harmonizer' },
      { title: 'Kangen Wagyu' },
      { title: 'Compensation Plan' },
      { title: 'Anespa Shower System' },
      { title: 'Ukon Turmeric' },
      { title: 'Other Languages' },
      { title: 'Industry Resources' },
      { title: 'Niche Webinars' },
      { title: 'Testimonial Calls' },
      { title: 'Prices' },
      { title: 'Pets & Vets' },
      { title: 'Business Webinar' },
      { title: 'Network Marketing' },
      { title: 'Live Events' }
    ],
    previews: [
      { title: 'Videos' },
      { title: 'Documents' },
      { title: 'Images' },
      { title: 'Presentations' },
      { title: 'Market resources' }
    ]
  },
  {
    id: '15385',
    title: 'Complete Product Information',
    description: 'The core product and technology reference center.',
    collection: 'products',
    folders: [
      { title: 'Ionizers' },
      { title: 'Anespa shower' },
      { title: 'emGuarde' },
      { title: 'Kangen Air' },
      { title: 'Ukon' },
      { title: 'Kangen Wagyu' }
    ],
    previews: [
      { title: 'Product overview' },
      { title: 'Features and intended uses' },
      { title: 'Market availability' }
    ]
  },
  {
    id: '15469',
    title: 'Kangen Authority Training',
    description: 'Detailed machine ownership, maintenance, testing, and water education.',
    collection: 'products',
    folders: [],
    previews: [
      { title: 'Welcome to Kangen Authority' },
      { title: 'Getting Started With Your Kangen' },
      { title: 'Setting Up Your K8' },
      { title: 'Packing a K8 for Travel' },
      { title: 'Performing an E-Cleaning' },
      { title: 'Changing the K8 Filter' },
      { title: 'Ionfaucet Pre-filter Walkthrough' },
      { title: 'Changing Pre-filters' },
      { title: 'Creating Safe Kangen Water' },
      { title: 'Testing 2.5pH Water' },
      { title: 'Understanding ORP' },
      { title: 'Testing Chlorine Drops' }
    ]
  },
  {
    id: '15470',
    title: 'Filtration Education',
    description: 'Pre-filtration, contaminant awareness, specifications, and water-softener education.',
    collection: 'products',
    folders: [
      { title: 'Multipure specifications & data' },
      { title: 'Water softener' }
    ],
    previews: [
      { title: 'Tap Water Contaminant Database' },
      { title: 'Pre-filter & Enagic Presentation' },
      { title: 'Pre-Filtration for Ionizers' },
      { title: 'Filtration Education — Full' },
      { title: 'Filtration Education — Quick' }
    ]
  },
  {
    id: '15480',
    title: 'Demos, Events & Webinars',
    description: 'Prepare and present confident product demonstrations and events.',
    collection: 'products',
    folders: [
      { title: 'Demo event preparation' },
      { title: 'Demo supplies' },
      { title: 'Training' },
      { title: 'Canva presentations' }
    ],
    previews: [
      { title: 'Why Host Events?' },
      { title: 'Demo preparation' },
      { title: 'Presentation resources' }
    ]
  },
  {
    id: '15576',
    title: 'PDFs & Reading Materials',
    description: 'Product education, guides, studies, and approved reading resources.',
    collection: 'products',
    folders: [
      { title: 'Older e-books' }
    ],
    previews: [
      { title: 'Learn More About Kangen Water & Enagic' },
      { title: 'Kangen Water 100+ Uses' },
      { title: 'Why Hydrogen Water' },
      { title: 'Doctors on Kangen Water' },
      { title: 'Ionized Water Protocols' },
      { title: 'A Chemical-Free Sanctuary' },
      { title: 'Ionized Water in the Kitchen' },
      { title: '2.5pH Sterilization & Wound Care' },
      { title: 'Kangen Water Therapies' },
      { title: 'Learn More About emGuarde' },
      { title: 'Anespa Mineral Shower Spa' },
      { title: 'Kangen Ukon E-Book' }
    ]
  },
  {
    id: '15383',
    title: 'Conversation & Follow-Up Scripts',
    description: 'A practical conversation path from first connection through follow-up and launch.',
    collection: 'business',
    folders: [
      { title: 'Paid ads scripts' }
    ],
    previews: [
      { title: 'Warm start' },
      { title: 'Cold start' },
      { title: 'Social media start' },
      { title: 'Product lead magnet' },
      { title: 'Business lead magnet' },
      { title: 'Warm invitation' },
      { title: 'Cold invitation' },
      { title: 'Social media invitation' },
      { title: '24-hour follow-up' },
      { title: '48-hour follow-up' },
      { title: '72-hour follow-up' },
      { title: 'Serving & next steps' }
    ]
  },
  {
    id: '15468',
    title: 'Content Resources & Prompts',
    description: 'Ideas and frameworks for clear, responsible distributor content.',
    collection: 'business',
    folders: [
      { title: 'Pre-made social content — coming soon' }
    ],
    previews: [
      { title: '76 Content Prompts' },
      { title: '105 Viral Hooks & Angles' },
      { title: '60-Second Authority Script' }
    ]
  },
  {
    id: '15478',
    title: 'Networking & Conversations',
    description: 'Relationship-first networking and confident business conversations.',
    collection: 'business',
    folders: [
      { title: 'Using ChatGPT' }
    ],
    previews: [
      { title: 'Dream 25 / 50 Networking' },
      { title: 'Conversation Scripts Pack' },
      { title: 'Questions for Better Conversations' }
    ]
  },
  {
    id: '15486',
    title: 'Testimonials',
    description: 'Organized personal experiences with the required individual-results disclaimer.',
    collection: 'business',
    folders: [
      { title: 'Business' },
      { title: 'Health by topic' },
      { title: 'Medication' },
      { title: 'Saving money' },
      { title: 'Cleaning' },
      { title: 'Pesticides' },
      { title: 'Gardening' },
      { title: 'Personal backgrounds' },
      { title: 'Pets' }
    ],
    previews: [
      { title: 'Video stories' },
      { title: 'Written experiences' },
      { title: 'Topic-based testimonials' }
    ]
  },
  {
    id: '15578',
    title: 'The Prospect Flow',
    description: 'A step-by-step path from connection to a qualified conversation and three-way call.',
    collection: 'business',
    folders: [],
    previews: [
      { title: 'Understanding the Flow Cycle' },
      { title: 'Flow Cycle Basics' },
      { title: 'IPA Overview' },
      { title: 'Rain — Share Your Story' },
      { title: 'Rain — Make New Connections' },
      { title: 'Rain — Instagram Lead Generation' },
      { title: 'Rain — Avatar Training' },
      { title: 'Streams — Conversation Flow' },
      { title: 'Streams — Add, Tag & Qualify' },
      { title: 'Streams — Invite to an Event' },
      { title: 'Streams — Qualify Leads' },
      { title: 'Rivers — Book a Three-Way Call' },
      { title: 'Rivers — Edify Your Upline' }
    ]
  },
  {
    id: '15629',
    title: 'AI Tools for Distributors',
    description: 'AI assistants for faster responses, planning, and follow-up.',
    collection: 'business',
    folders: [],
    previews: [
      { title: 'Lead Responder' },
      { title: 'Objection Responder' },
      { title: 'Human review checklist' }
    ]
  },
  {
    id: '15791',
    title: 'Team Training Replays',
    description: 'Recurring team, EWS, Monday, Wednesday, and Saturday training replays.',
    collection: 'leadership',
    folders: [
      { title: 'Community call replays' }
    ],
    previews: [
      { title: 'Tuesday Team Training' },
      { title: 'Monday Distributor Training' },
      { title: 'Wednesday EWS Training' },
      { title: 'Saturday Business Webinar' }
    ]
  },
  {
    id: '15557',
    title: 'Leadership & Business Development',
    description: 'Challenges, sprints, mindset, selling, and leadership development.',
    collection: 'leadership',
    folders: [
      { title: '30-Day Sprint' },
      { title: 'Sales Training' },
      { title: 'Leadership Study' },
      { title: 'GoPro Event Resources' },
      { title: 'Mindset Resources' }
    ],
    previews: [
      { title: 'Personal development' },
      { title: 'Business training' },
      { title: 'Leadership challenges' }
    ]
  },
  {
    id: '15579',
    title: 'Tax Education',
    description: 'General business tax education; always confirm decisions with a qualified professional.',
    collection: 'leadership',
    folders: [
      { title: 'USA' },
      { title: 'Canada' }
    ],
    previews: [
      { title: 'Business tax learning' },
      { title: 'Market-specific references' }
    ]
  },
  {
    id: '15583',
    title: 'Compliance & Distributor Files',
    description: 'Policies, disclosures, brand files, and responsible distributor guidance.',
    collection: 'leadership',
    folders: [
      { title: 'Independent Distributor Logos' }
    ],
    previews: [
      { title: 'Enagic Earnings Disclosure' },
      { title: 'Policies & Procedures' },
      { title: 'Compliance Basics' },
      { title: 'Distributor Handbook' }
    ]
  }
]
