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
  },
  {
    id: '15598',
    title: 'Personal Library',
    description: 'Personalized files, custom pre-filter slides, and big picture reference diagrams.',
    collection: 'products',
    folders: [],
    previews: [
      { title: 'multipure point of use', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/1an0b5_Ut_Ie_F4_Ft_Dc_H_Sv2t4h_L_Iswq_823d1ae638.jpeg' },
      { title: 'our water is under attack...', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/1an0b5_Ut_Ie_F4_Ft_Dc_H_Sv2t4h_L_Iswq_823d1ae638.jpeg' },
      { title: 'the best prefilter slides 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/4b_B7a_Z_Ed_Yuao_R_Ol_QUN_Gie95hb_TY_5_46484be78c.jpeg' },
      { title: 'the best prefilter slides 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Ij6b_Kde_LHCT_Kwc_Laxr_H5s_LA_Ny131_788f56a4fb.jpeg' },
      { title: 'the best prefilter slides 3', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/L_Us_Zn1_P3xi_Mz4_Ps0_P_Cxtr_Y2_NR_79c_cce293db55.png' },
      { title: 'the best prefilter slides 4', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/lw_V3_HPL_0_Yh_Rysr_VP_9t_ZLYO_1kkr0_I_0b9efa1ba7.jpeg' },
      { title: 'the best prefilter slides 5', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Q_Sx_Wv3oh8gcs_UV_0qjn_Us_Inoem534_4fb6db1b54.jpeg' },
      { title: 'the best prefilter slides 6', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/E5ek5ud_S_Sh_Q7x_En_QH_3_Xo0_QR_Co8y_K_58efd6b6bd.png' },
      { title: 'the best prefilter slides 7', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Rck3_J_Ckj3_UEB_3z6cph_G6_JY_Li38_M9_fc5139262e.png' },
      { title: 'K8 + MP Slide 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/NMGEM_Xw5_M_Tj_Sn8_RP_53mi308m1_Aj9_2f1ee6edf3.jpg' },
      { title: 'The Big Picture 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Td_Srvojssydpk7_Ur77u09_LN_0_Wol_P_9e7151a5de.PNG' },
      { title: 'The big picture 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/GVCP_Ul9_J_Hgo0c_Klueqerh_B_Bzq7_Xw_9e5a9b0312.PNG' },
      { title: 'the big picture 3', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/2y_K3_X8cl0zap_BWKV_Yt_Fag41d58y_T_87420e8b71.PNG' },
      { title: 'the big picture 4', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/z7_VZN_Dfo_V_Jaziroj_F_Ph2mo_F_Fxct_H_c14d92c1d1.PNG' },
      { title: 'clean water solutions 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/dpg1m_E_Bo2_ZGVLFY_9_Lj74e_Vl_KVCXF_d9030e1b54.jpg' },
      { title: 'clean water solutions 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Ql7_S2rs_Mhz_Sz1tyscfcq_Szv_Aqm0j_7d185ceeb7.jpg' },
      { title: 'clean water solutions 3', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/8jvj_N25727_GLU_2f_Iv_TG_2be6_Si_UXT_47cf52361b.jpg' },
      { title: 'stats', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/0_Rl_Plm_X_Au_U_Qbtd4ws_BKU_3_F9x1_Yr_E_ccf3976247.PNG' },
      { title: 'filtration and ionization 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/W7n_FXH_Nx_SY_Qc_TT_4_X_Dw_P269_RL_1_Os_C_83e9c6dff8.PNG' },
      { title: 'filtration and ionization 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Hhbk_Dq_Asf_S_Uapf93_Xz_UKQZHE_9l_Lu_26302decfc.PNG' },
      { title: 'filtration and ionization 3', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/x_PI_Tfkd2_Ep_R0sa6q_Tex_E1uzqdif_T_42674dc87e.PNG' },
      { title: 'filtration and ionization 4', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/v_P_Xt_I15_BU_Cc_U8_Fi8xs_Wjl2_Dg_Cnx8_b56281bc6d.PNG' },
      { title: 'filtration and ionization 5', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/es_HJ_8_R_Tw_Tlak9b_IPPW_Ixuczc_Wihr_17bb0c31a7.PNG' },
      { title: 'filtration and ionization 6', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/y9a_Zh_Mz_P_Ykm5_Ng04_VGZ_Pknbj_P6_VV_54ea9036e7.PNG' },
      { title: 'point of use slides 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/c_O_Lge9p4ha0oo_Wifh_Z_Ll9f_T0t9_Pm_f235d00dfe.png' },
      { title: 'point of use slides 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Fvot5_Kh_H_Wv_Ib7_OOFD_Xkwd7_Dg_Zack_b73fc0b25a.png' },
      { title: 'point of use slides 3', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/2nu_Lo_YP_9_K_Jo_Eky7_B4othe2tm_Xgi_A_345218bc7a.png' },
      { title: 'point of use slides 4', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/B_Gu_Fzs5_Q2d_V5_Sq_DQ_33_WT_4_L_Ak_J_Cp_T_96e714a35b.png' },
      { title: 'the solution', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/BX_2u_Qgg3_Bk_YK_Bwa_Dmtmw_Nv_SB_6ipe_554334665d.jpeg' },
      { title: 'the GOAT prefilter 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/EV_2s_KC_Sf13r_LAQX_Vwehxzw_Tf_Sk_Dk_bb4a5aa6e7.jpeg' },
      { title: 'the GOAT prefilter 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/z_VA_Nc_Bf_AT_Pj5_U8h9lz_Ga_Q3_YA_2ml_K_3f9d6102c2.jpeg' },
      { title: 'the GOAT prefilter 3', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/oa_JEQ_9e_Pwu_Hif_NG_5x17_J8_Z8hz_Mr_P_eeb896908d.jpeg' },
      { title: 'the GOAT prefilter 4', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/jm_Dh8f_Ov_Dx_Gib_XC_5u97ep6_B4bqp6_0a60b90c98.jpeg' },
      { title: 'the GOAT prefilter 5', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/Us7a_Mg_V_Ow1_W1d_O_Jh2sk7c2_Rsma_YP_b7b9fcd6dd.jpeg' },
      { title: 'filtration is the foundation 1', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/4_LL_Fp1_Nqhga_Og_C_Tnh_D_Pc_Bd_Rjb_K2p_6d7b6a505c.jpeg' },
      { title: 'filtration is the foundation 2', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/l_T_Ogytwvgn_CK_6_Ey2_K6_UTOK_Txf0_OD_5dabccd39a.jpeg' },
      { title: 'the aquapreform', url: 'https://workflowpics.s3.us-west-1.amazonaws.com/F0ub_We_B4_Uo_JU_0_JEWIU_Rn_Xrx_GI_Da_U_8ea290efd1.jpeg' }
    ]
  }
]
