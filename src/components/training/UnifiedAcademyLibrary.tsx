import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Clock3, PlayCircle } from "lucide-react";

type Course = { title: string; lessons: string[]; status?: "coming-soon" | "review" };
type Path = { title: string; description: string; courses: Course[] };

const LEARNING_PATHS: Path[] = [
  { title: "Start Your Business", description: "Build the mindset, product foundation, business plan, and first-action habits for a confident launch.", courses: [
    { title: "Entrepreneur Mindset", lessons: ["Introduction", "Think Like an Entrepreneur", "Why Entrepreneurship Changes Everything"] },
    { title: "Choosing the Right Vehicle", lessons: ["The Right Vehicle", "See the Product in Action", "The Real Value"] },
    { title: "Understanding the System", lessons: ["Compensation Plan", "The Numbers and Your Timing", "Why Systems Win", "How This System Supports Your Business", "Tools That Do the Heavy Lifting", "Your Focus in This System"] },
    { title: "Business Launch", lessons: ["Before You Get Started", "Your Business Plan", "How You Earn", "Choose Your Setup", "Make It Work Financially", "Start Your Business Today"] },
    { title: "Your First Actions", lessons: ["Welcome", "Get Started", "Get Plugged Into the Products", "Compliance: What You Can and Cannot Say", "How to Share Your Story", "Why Start With Your Warm Market", "How to Approach People", "How to Set Up and Edify a Three-Way Call", "The Three Methods of Lead Generation", "Launch Challenge"] },
  ]},
  { title: "Product Mastery", description: "Understand the Enagic product ecosystem and learn how to explain each product clearly and responsibly.", courses: [
    { title: "Water Ionizers", lessons: ["Introduction", "Why Kangen Water", "How Ionization Works", "Understanding the Five Water Types", "Overview of Enagic Ionizers", "Unboxing and First Look", "Installation", "The Importance of Prefiltration", "Everyday Uses for the Five Waters", "Ionizer Maintenance", "Understanding Authorized Purchasing"] },
    { title: "Whole-Home Technologies", lessons: ["The Whole-Home Approach", "Meet ANESPA", "Meet emGuarde", "Meet Kangen Air", "ANESPA Installation and Maintenance", "emGuarde Installation, Maintenance, Testing and Demonstration"] },
    { title: "Consumable Products", lessons: ["Why Consumables Matter", "Meet Kangen Wagyu", "Meet Kangen Ukon", "Meet Kangen Beauté"] },
    { title: "Product Mastery Conclusion", lessons: ["Conclusion and Recommended Next Steps"] },
  ]},
  { title: "Lead Generation", description: "Develop reliable online, advertising, networking, and referral conversations.", courses: [
    { title: "Organic Social Prospecting", lessons: ["FOS Introduction", "Engagement", "Birthdays", "Follow-Up", "Adding Friends", "Recently Added Contacts", "Friends List"] },
    { title: "Paid Advertising", status: "review", lessons: ["Advertising Assets Overview", "Fan Page Setup and Personalization", "Account and Campaign Setup", "Compliant Advertising", "Audience and Advertising Types", "The Art of Split Testing", "Your Perfect Customer Avatar", "Ad Copywriting", "Creative Selection", "Launching Lead Ads", "Handling Conversations", "KPIs and Tracking", "Conclusion"] },
    { title: "Offline Prospecting and Networking", status: "review", lessons: ["Serving the Person in Front of You", "Warm-Market Conversations", "Meeting New People", "Sponsoring Events", "Sharing What You Do", "Invitations and Demonstrations", "Asking for Referrals", "Follow-Up", "Customer Care", "Documenting Your Journey", "Daily Activities", "Recommended Next Steps"] },
  ]},
  { title: "Conversion & Follow-Up", description: "Guide natural conversations, answer questions simply, and help people decide without pressure.", courses: [
    { title: "Seven Core Skills", lessons: ["Finding Prospects", "Inviting", "Presenting", "Following Up", "Closing", "Getting People Started", "Promoting Events"] },
    { title: "Guiding Conversations", lessons: ["The Goal of a Conversation", "Warm-Market Approach", "Responding to Interest", "When to Send the System", "Keeping It Natural"] },
    { title: "Helping People Decide", lessons: ["Understanding Hesitation", "Presentation Skills", "Handling Questions Simply", "Closing Without Pressure", "Follow-Up Systems"] },
  ]},
  { title: "Leadership & Duplication", description: "Create early wins, develop people, and build an organization that can duplicate.", courses: [
    { title: "Leadership Development", lessons: ["Team-Building Foundations", "The Blueprint for Building an Organization", "Training Your Team", "Discipline, Purpose and Momentum", "Recognition and Motivation", "Scaling Your Organization"] },
    { title: "Onboarding New Members", status: "coming-soon", lessons: ["The First 24–48 Hours", "What New Members Actually Need", "Plugging Into the System", "Creating Early Wins"] },
  ]},
  { title: "Digital Tools & Backoffice", description: "Learn the digital tools used to manage pages, leads, communication, scheduling, and team support.", courses: [
    { title: "Foundation Setup", lessons: ["Understanding Available EWS Plans", "Backoffice Setup and Walkthrough", "Websites", "Website Manager"] },
    { title: "Lead Generation Tools", lessons: ["Landing Pages", "Automated Webinars", "Social Images", "Social Campaigns"] },
    { title: "Lead Management and Communication", lessons: ["Contact Manager", "Contact Emailer", "Campaign Messenger", "Task Calendar", "Call Scheduler", "Mobile App"] },
    { title: "Power-User Tools", lessons: ["Video Library", "Team Share", "Distributor ID Manager", "Booking Sales for Team Members", "Online Ordering", "Tax Calculator"] },
  ]},
  { title: "True Legacy Masterclasses", description: "Continue into the original True Legacy product, business, communication, and leadership sessions below.", courses: [
    { title: "Original True Legacy Curriculum", lessons: ["Purpose and Vision", "Flagship Technologies", "The 8-Point System", "Leadership Structure", "Systems and Funnels", "Prospecting", "Presentation Skills", "Closing and Follow-Up", "Business Media"] },
  ]},
];

export function UnifiedAcademyLibrary() {
  const [activePath, setActivePath] = useState(0);
  const [openCourse, setOpenCourse] = useState(0);
  const lessonCount = useMemo(() => LEARNING_PATHS.reduce((total, path) => total + path.courses.reduce((sum, course) => sum + course.lessons.length, 0), 0), []);
  const path = LEARNING_PATHS[activePath];

  return <section className="mb-12 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-black/45 shadow-[0_30px_100px_rgba(0,0,0,.45)]">
    <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/[.09] via-blue-500/[.04] to-transparent p-6 sm:p-9">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-[11px] font-black uppercase tracking-[.3em] text-cyan-300">One academy · Seven learning paths</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">True Legacy Academy</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#cccccc]">Your complete private training system—organized from business launch and product mastery through leadership, digital tools, and advanced True Legacy masterclasses.</p></div><div className="grid grid-cols-3 gap-2 text-center">{[[7,"Paths"],[LEARNING_PATHS.reduce((n,p)=>n+p.courses.length,0),"Courses"],[lessonCount,"Lessons"]].map(([value,label])=><div key={label} className="min-w-20 rounded-xl border border-white/10 bg-white/[.04] px-3 py-3"><div className="text-xl font-black text-white">{value}</div><div className="text-[10px] uppercase tracking-wider text-[#86868b]">{label}</div></div>)}</div></div>
    </div>
    <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[290px_1fr]">
      <nav className="space-y-2" aria-label="True Legacy Academy learning paths">{LEARNING_PATHS.map((item,index)=><button key={item.title} type="button" onClick={()=>{setActivePath(index);setOpenCourse(0)}} className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${activePath===index?"border-cyan-400/35 bg-cyan-400/10 text-cyan-200":"border-white/10 bg-white/[.025] text-[#cccccc] hover:bg-white/[.05] hover:text-white"}`}><span>{index+1}. {item.title}</span><ChevronRight className="h-4 w-4 shrink-0" /></button>)}</nav>
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[.02] p-4 sm:p-6"><div className="mb-5 border-b border-white/10 pb-5"><p className="text-[10px] font-black uppercase tracking-[.25em] text-[#2997ff]">Learning path {activePath+1}</p><h3 className="mt-1 text-2xl font-black text-white">{path.title}</h3><p className="mt-2 text-sm leading-6 text-[#cccccc]">{path.description}</p></div><div className="space-y-3">{path.courses.map((course,index)=>{const expanded=openCourse===index;return <article key={course.title} className="overflow-hidden rounded-xl border border-white/10 bg-black/25"><button type="button" onClick={()=>setOpenCourse(expanded?-1:index)} className="flex w-full items-center justify-between gap-4 p-4 text-left"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/10 text-xs font-black text-cyan-300">{index+1}</span><div><h4 className="font-bold text-white">{course.title}</h4><p className="mt-0.5 text-xs text-[#86868b]">{course.lessons.length} lessons {course.status==="coming-soon"?"· Coming soon":course.status==="review"?"· In review":""}</p></div></div><ChevronDown className={`h-4 w-4 text-[#86868b] transition ${expanded?"rotate-180":""}`} /></button>{expanded&&<div className="border-t border-white/10 p-3">{course.lessons.map((lesson,lessonIndex)=><div key={lesson} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#cccccc] hover:bg-white/[.04]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-[10px]">{lessonIndex+1}</span><span className="flex-1">{lesson}</span>{course.status?<Clock3 className="h-4 w-4 text-amber-300"/>:<PlayCircle className="h-4 w-4 text-cyan-300"/>}</div>)}</div>}</article>})}</div><div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[.05] p-4 text-xs leading-5 text-[#cccccc]"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300"/>The unified curriculum is mapped. Lessons marked “In review” or “Coming soon” remain unpublished until approved.</div></div>
    </div>
  </section>;
}
