import { useState, useEffect, useRef, useCallback } from "react";

// ─── Inject Global Styles ────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #060610;
    --bg2:       #0a0a1a;
    --card:      rgba(255,255,255,0.032);
    --border:    rgba(255,255,255,0.07);
    --blue:      #3b82f6;
    --violet:    #7c3aed;
    --gold:      #f59e0b;
    --teal:      #14b8a6;
    --text:      #f1f5f9;
    --muted:     #94a3b8;
    --glow:      rgba(59,130,246,0.18);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

  /* ── Keyframes ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes shimmer  { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
  @keyframes glow     { 0%,100% { box-shadow:0 0 20px rgba(59,130,246,0.3); } 50% { box-shadow:0 0 50px rgba(59,130,246,0.7); } }
  @keyframes slideIn  { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes countUp  { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
  @keyframes borderAnim { 0%,100% { border-color:rgba(59,130,246,0.4); } 50% { border-color:rgba(124,58,237,0.7); } }
  @keyframes gradMove { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
  @keyframes blobMove { 0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; } 50% { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; } }

  .anim-fade-up   { animation: fadeUp 0.8s ease forwards; }
  .anim-fade-in   { animation: fadeIn 1s ease forwards; }
  .anim-float     { animation: float 6s ease-in-out infinite; }
  .anim-glow      { animation: glow 3s ease-in-out infinite; }
  .anim-border    { animation: borderAnim 3s ease infinite; }
  .anim-grad      { background-size:200% 200%; animation: gradMove 5s ease infinite; }

  /* ── Noise overlay ── */
  .noise::after {
    content:'';
    position:fixed; inset:0; z-index:9999; pointer-events:none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity:0.4;
  }

  /* ── Grid bg ── */
  .grid-bg {
    background-image:
      linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── Glassmorphism ── */
  .glass {
    background: rgba(255,255,255,0.035);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
  }

  /* ── Gradient text ── */
  .grad-text {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .grad-text-blue {
    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Buttons ── */
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    opacity:0;
    transition: opacity 0.3s ease;
  }
  .btn-primary:hover::before { opacity:1; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(59,130,246,0.4); }

  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-outline:hover {
    background: rgba(255,255,255,0.06);
    border-color: var(--blue);
    color: var(--blue);
    transform: translateY(-2px);
  }

  /* ── Cards ── */
  .service-card {
    background: var(--card);
    border: 1px solid var(--border);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
  }
  .service-card::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, var(--blue), transparent);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  .service-card:hover { border-color:rgba(59,130,246,0.3); transform:translateY(-6px); background:rgba(59,130,246,0.06); }
  .service-card:hover::before { transform:scaleX(1); }

  /* ── Stats ── */
  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    transition: all 0.3s ease;
  }
  .stat-card:hover { border-color:rgba(59,130,246,0.4); background:rgba(59,130,246,0.05); }

  /* ── Portfolio ── */
  .portfolio-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid var(--border);
    transition: all 0.4s ease;
    overflow: hidden;
    position: relative;
  }
  .portfolio-card:hover { border-color:rgba(59,130,246,0.4); transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
  .portfolio-card .overlay {
    position:absolute; inset:0;
    background: linear-gradient(to top, rgba(6,6,16,0.98) 0%, rgba(6,6,16,0.6) 50%, transparent 100%);
  }

  /* ── Testimonial ── */
  .testi-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    transition: all 0.3s ease;
  }
  .testi-card:hover { border-color:rgba(124,58,237,0.4); background:rgba(124,58,237,0.05); }

  /* ── Input ── */
  .form-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text);
    transition: all 0.3s ease;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    outline: none;
  }
  .form-input::placeholder { color: #475569; }
  .form-input:focus { border-color: var(--blue); background:rgba(59,130,246,0.05); box-shadow:0 0 0 3px rgba(59,130,246,0.1); }

  /* ── Floating buttons ── */
  .float-btn {
    position: fixed;
    right: 24px;
    z-index: 1000;
    width: 52px; height: 52px;
    border-radius: 50%;
    display: flex; align-items:center; justify-content:center;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .float-btn:hover { transform:scale(1.12); }

  /* ── Nav ── */
  .nav-link {
    color: var(--muted);
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.875rem;
    letter-spacing: 0.02em;
    cursor:pointer;
    font-family:'DM Sans',sans-serif;
  }
  .nav-link:hover, .nav-link.active { color: var(--text); }
  .nav-link.active { color: var(--blue); }

  /* ── Filter ── */
  .filter-btn {
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family:'DM Sans',sans-serif;
    font-size:0.82rem;
    letter-spacing:0.05em;
  }
  .filter-btn.active, .filter-btn:hover {
    background: var(--blue);
    border-color: var(--blue);
    color: #fff;
  }

  /* ── Section heading line ── */
  .section-line {
    width:48px; height:3px;
    background:linear-gradient(90deg, var(--blue), var(--violet));
    border-radius:2px;
  }

  /* ── Blob ── */
  .blob {
    position:absolute;
    border-radius:60% 40% 30% 70%/60% 30% 70% 40%;
    animation: blobMove 8s ease-in-out infinite;
    filter: blur(60px);
    pointer-events:none;
  }

  /* ── Tag ── */
  .tag {
    background:rgba(59,130,246,0.12);
    border:1px solid rgba(59,130,246,0.25);
    color: #93c5fd;
    font-size:0.75rem;
    padding:3px 10px;
    border-radius:999px;
    font-family:'DM Sans',sans-serif;
    letter-spacing:0.04em;
  }

  /* ── Profile img ── */
  .profile-ring {
    background: linear-gradient(135deg, #3b82f6, #7c3aed, #f59e0b);
    padding: 3px;
    border-radius: 50%;
  }

  /* Reveal on scroll */
  .reveal { opacity:0; transform:translateY(30px); transition:all 0.7s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  .reveal-left { opacity:0; transform:translateX(-40px); transition:all 0.7s ease; }
  .reveal-left.visible { opacity:1; transform:translateX(0); }

  .reveal-right { opacity:0; transform:translateX(40px); transition:all 0.7s ease; }
  .reveal-right.visible { opacity:1; transform:translateX(0); }

  /* Stagger children */
  .stagger > *:nth-child(1) { transition-delay:0.1s; }
  .stagger > *:nth-child(2) { transition-delay:0.2s; }
  .stagger > *:nth-child(3) { transition-delay:0.3s; }
  .stagger > *:nth-child(4) { transition-delay:0.4s; }
  .stagger > *:nth-child(5) { transition-delay:0.5s; }
  .stagger > *:nth-child(6) { transition-delay:0.6s; }

  /* Mobile responsive */
  @media(max-width:768px) {
    .hero-grid { grid-template-columns:1fr !important; text-align:center; }
    .hero-img { order:-1; }
    .about-grid { grid-template-columns:1fr !important; }
    .services-grid { grid-template-columns:1fr !important; }
    .portfolio-grid { grid-template-columns:1fr !important; }
    .testi-grid { grid-template-columns:1fr !important; }
    .contact-grid { grid-template-columns:1fr !important; }
    .hero-btns { justify-content:center !important; }
    .stat-grid { grid-template-columns:1fr 1fr !important; }
  }
`;

// ─── Data ───────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: "🎬", title: "YouTube Automation", tag: "Content", color: "#ef4444",
    desc: "End-to-end faceless channel systems that generate passive income. I build, optimize, and scale automated YouTube businesses that run 24/7.",
    results: ["500K+ views generated", "8-figure niche selection", "Full team management"] },
  { icon: "✂️", title: "Video Editing", tag: "Creative", color: "#f59e0b",
    desc: "Cinematic, retention-optimized edits that keep viewers hooked. From short-form Reels to long-form YouTube content with maximum engagement.",
    results: ["90%+ retention rates", "Viral-ready formatting", "Brand-consistent style"] },
  { icon: "💻", title: "Web Development", tag: "Tech", color: "#3b82f6",
    desc: "High-converting websites and web apps built for speed, SEO, and sales. Full-stack solutions from landing pages to complex SaaS platforms.",
    results: ["3x faster load times", "Top 1% Core Web Vitals", "Conversion-first UX"] },
  { icon: "📣", title: "Facebook Ads Manager", tag: "Paid Media", color: "#7c3aed",
    desc: "Data-driven Meta advertising campaigns that deliver measurable ROI. I've managed significant ad spend across multiple industries and niches.",
    results: ["3-8x ROAS achieved", "$500K+ ad spend managed", "Advanced audience targeting"] },
  { icon: "📱", title: "Social Media Manager", tag: "Growth", color: "#14b8a6",
    desc: "Strategic social presence that builds audiences and drives revenue. Multi-platform management with content calendars and analytics reporting.",
    results: ["10K-100K growth sprints", "Daily engagement systems", "Revenue-linked strategy"] },
  { icon: "🤖", title: "AI Prompting Expert", tag: "AI/Automation", color: "#ec4899",
    desc: "Advanced AI workflow design that 10x your team's output. Custom prompts, automation pipelines, and AI-powered content systems.",
    results: ["10x productivity gains", "Custom AI workflows", "GPT-4 & Midjourney mastery"] },
];

const PORTFOLIO = [
  { id:1, title:"E-Commerce Brand Scale", service:"Facebook Ads Manager", tag:"Paid Media",
    img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    problem:"A Shopify brand was spending $5K/month on ads with a 1.2x ROAS and couldn't scale profitably.",
    solution:"Rebuilt the entire funnel — new creative angles, audience layering, and dynamic product ads with retargeting sequences.",
    results:["ROAS improved from 1.2x → 6.8x","Revenue grew from $18K → $142K/month","Ad spend scaled to $35K/month profitably"],
    metric:"6.8x ROAS" },
  { id:2, title:"Faceless YouTube Channel", service:"YouTube Automation", tag:"Content",
    img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    problem:"Client wanted passive income online but had zero presence, zero brand, and no video experience.",
    solution:"Built a complete YouTube automation system: niche research, scriptwriting SOPs, voiceover pipeline, editing templates, upload schedule.",
    results:["0 to 48,000 subscribers in 90 days","Channel monetized in 3 months","$4,200/month passive revenue"],
    metric:"$4.2K/mo passive" },
  { id:3, title:"SaaS Landing Page Rebuild", service:"Web Development", tag:"Tech",
    img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    problem:"SaaS startup had a 2.1% free trial conversion rate and slow page speed killing their Google Ads ROI.",
    solution:"Rebuilt the landing page with conversion architecture, Next.js for speed, and A/B tested 12 headline variations.",
    results:["Conversion rate: 2.1% → 9.4%","Page load: 4.2s → 0.8s","MRR increased by $28K in 60 days"],
    metric:"9.4% conversion" },
  { id:4, title:"DTC Brand Social Growth", service:"Social Media Manager", tag:"Growth",
    img:"https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    problem:"Health & wellness brand had 2K followers across platforms with zero engagement and no content strategy.",
    solution:"Full social media takeover: content calendar, brand voice guide, UGC framework, and paid amplification strategy.",
    results:["Instagram: 2K → 67K followers","Engagement rate: 0.8% → 8.3%","Direct sales attributed: $95K in 120 days"],
    metric:"67K followers grown" },
  { id:5, title:"AI-Powered Content Agency", service:"AI Prompting Expert", tag:"AI/Automation",
    img:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    problem:"Content agency was spending 80+ hours/week producing articles, social posts, and video scripts for clients.",
    solution:"Built custom GPT-4 workflows, Midjourney brand kits, and automated publishing pipelines across 12 client accounts.",
    results:["Production time cut by 74%","Output increased 8x per team member","Agency profit margin: 28% → 61%"],
    metric:"8x output increase" },
  { id:6, title:"Viral Short-Form Content", service:"Video Editing", tag:"Creative",
    img:"https://images.unsplash.com/photo-1536240478700-b869ad10e2c4?w=800&q=80",
    problem:"Personal brand coach had great knowledge but zero video presence and a launch that generated $0.",
    solution:"Produced a 90-day Reels and TikTok strategy with high-retention editing templates, hooks library, and trend-hijacking system.",
    results:["3 videos surpassed 1M views","Email list grew by 12,000 in 60 days","Course launch: $0 → $180K revenue"],
    metric:"$180K launch revenue" },
];

const TESTIMONIALS = [
  { name:"Marcus Chen", role:"CEO, ShopFlow Commerce", avatar:"MC",
    color:"#3b82f6",
    text:"Nico completely transformed our Facebook ads. We went from burning money to a consistent 6x ROAS within 6 weeks. His analytical approach and creative testing framework is unlike anything I've seen.",
    result:"6x ROAS in 6 weeks" },
  { name:"Sarah Williams", role:"Founder, NutriLife Co.", avatar:"SW",
    color:"#7c3aed",
    text:"I was skeptical about YouTube automation but Nico proved me wrong. Built a channel from scratch that now generates over $4K monthly. The system he created basically runs itself.",
    result:"$4K/month passive income" },
  { name:"David Okonkwo", role:"SaaS Founder, TaskBridge", avatar:"DO",
    color:"#14b8a6",
    text:"The landing page rebuild was insane. We went from a 2% conversion rate to over 9% in under 30 days. The speed optimization alone saved our Google Ads campaigns from shutting down.",
    result:"9.4% conversion rate" },
  { name:"Priya Patel", role:"Personal Brand Coach", avatar:"PP",
    color:"#f59e0b",
    text:"Nico's short-form video editing turned my content game around completely. His hook formulas and retention editing style helped me hit my first million-view video. The course launch paid for everything 100x over.",
    result:"$180K course launch" },
  { name:"James Rodriguez", role:"E-commerce Director", avatar:"JR",
    color:"#ec4899",
    text:"Working with Nico on our social strategy was a game-changer. 65K Instagram followers in 4 months and a direct revenue impact we can actually track. He's not just a service provider — he's a real growth partner.",
    result:"65K followers in 4 months" },
  { name:"Emma Thompson", role:"Agency Owner, ContentFirst", avatar:"ET",
    color:"#10b981",
    text:"The AI automation systems Nico built for our agency cut our production time by 70%+. We went from struggling at 20% margins to comfortably hitting 60%. Absolute game-changer for our business.",
    result:"Margins from 20% → 60%" },
];

const TAGS = ["All", "Paid Media", "Content", "Tech", "Growth", "AI/Automation", "Creative"];

// ─── Icon components ──────────────────────────────────────────────────────────
const Icon = ({ d, size=20, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const ICONS = {
  menu:   "M4 6h16M4 12h16M4 18h16",
  x:      "M18 6L6 18M6 6l12 12",
  mail:   "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-.9.9-2 2-2zM22 6l-10 7L2 6",
  fb:     "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  tg:     "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  wa:     "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  arrow:  "M5 12h14M12 5l7 7-7 7",
  check:  "M20 6L9 17l-5-5",
  star:   "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  ext:    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
  send:   "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  chart:  "M18 20V10M12 20V4M6 20v-6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  zap:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useIntersection(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return visible;
}

function useCounter(target, visible, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);
  return count;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home","Services","Portfolio","About","Testimonials","Contact"];
  const scroll = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" });
    setOpen(false);
  };
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:900,
      transition:"all 0.4s ease",
      background: scrolled ? "rgba(6,6,16,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      padding:"0 24px",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>scroll("home")}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#3b82f6,#7c3aed)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"0.85rem", fontFamily:"Syne,sans-serif", fontWeight:700, color:"#fff"
          }}>NA</div>
          <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.05rem", color:"#f1f5f9" }}>
            Nico<span style={{ color:"#3b82f6" }}>Adajar</span>
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display:"flex", alignItems:"center", gap:32 }} className="nav-desktop">
          {links.map(l => (
            <span key={l} className={`nav-link${active===l.toLowerCase()?" active":""}`}
              onClick={()=>scroll(l.toLowerCase())}>{l}</span>
          ))}
          <button className="btn-primary" onClick={()=>scroll("contact")}
            style={{ padding:"9px 22px", borderRadius:8, fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:"0.85rem", position:"relative", zIndex:1 }}>
            Hire Me
          </button>
        </div>

        {/* Mobile hamburger */}
        <button style={{ background:"none", border:"none", color:"#f1f5f9", cursor:"pointer", display:"none" }}
          id="hamburger" onClick={()=>setOpen(!open)}>
          <Icon d={open ? ICONS.x : ICONS.menu} size={24}/>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background:"rgba(6,6,16,0.97)", borderTop:"1px solid rgba(255,255,255,0.06)",
          padding:"20px 24px 28px", display:"flex", flexDirection:"column", gap:20
        }}>
          {links.map(l => (
            <span key={l} style={{ color:"#94a3b8", cursor:"pointer", fontFamily:"DM Sans,sans-serif", fontSize:"1rem" }}
              onClick={()=>scroll(l.toLowerCase())}>{l}</span>
          ))}
          <button className="btn-primary" onClick={()=>scroll("contact")}
            style={{ padding:"12px 24px", borderRadius:8, fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:"0.9rem", position:"relative", zIndex:1, textAlign:"center" }}>
            Hire Me →
          </button>
        </div>
      )}

      <style>{`
        @media(max-width:768px){ .nav-desktop{display:none!important;} #hamburger{display:block!important;} }
      `}</style>
    </nav>
  );
}

function StatCard({ label, value, suffix, prefix="", delay=0 }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const count = useCounter(value, visible);
  return (
    <div ref={ref} className="stat-card reveal stagger" style={{
      padding:"28px 24px", borderRadius:16, textAlign:"center",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
      transition:`all 0.7s ease ${delay}ms`
    }}>
      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"2.4rem",
        background:"linear-gradient(135deg,#60a5fa,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
        {prefix}{count}{suffix}
      </div>
      <div style={{ color:"#94a3b8", fontSize:"0.85rem", marginTop:6, letterSpacing:"0.04em" }}>{label}</div>
    </div>
  );
}

function ServiceCard({ svc, idx }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className="service-card" style={{
      borderRadius:20, padding:"32px 28px", cursor:"default",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
      transition:`all 0.6s ease ${idx*90}ms`
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
        <div style={{
          width:52, height:52, borderRadius:14,
          background:`${svc.color}18`, border:`1px solid ${svc.color}35`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem"
        }}>{svc.icon}</div>
        <div>
          <span className="tag">{svc.tag}</span>
          <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.05rem", marginTop:4 }}>{svc.title}</h3>
        </div>
      </div>
      <p style={{ color:"#94a3b8", fontSize:"0.88rem", lineHeight:1.7, marginBottom:20 }}>{svc.desc}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {svc.results.map((r,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:16, height:16, borderRadius:"50%", background:`${svc.color}20`, border:`1px solid ${svc.color}50`,
              display:"flex",alignItems:"center",justifyContent:"center", flexShrink:0 }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={svc.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICONS.check}/>
              </svg>
            </div>
            <span style={{ fontSize:"0.8rem", color:"#cbd5e1" }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioCard({ p, idx }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const [expanded, setExpanded] = useState(false);
  return (
    <div ref={ref} className="portfolio-card" style={{
      borderRadius:20,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
      transition:`all 0.6s ease ${(idx%3)*100}ms`
    }}>
      {/* Image */}
      <div style={{ position:"relative", height:200, overflow:"hidden" }}>
        <img src={p.img} alt={p.title} loading="lazy" style={{
          width:"100%", height:"100%", objectFit:"cover",
          transition:"transform 0.5s ease"
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
        <div className="overlay"/>
        <div style={{ position:"absolute", bottom:16, left:16, right:16 }}>
          <span className="tag">{p.tag}</span>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:"1.3rem", fontWeight:700, marginTop:8,
            color:"#fff", textShadow:"0 2px 8px rgba(0,0,0,0.8)" }}>{p.metric}</div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:"24px 24px 20px" }}>
        <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.05rem", marginBottom:12 }}>{p.title}</h3>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:"0.72rem", color:"#3b82f6", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600, marginBottom:5 }}>PROBLEM</div>
          <p style={{ fontSize:"0.82rem", color:"#94a3b8", lineHeight:1.6 }}>{p.problem}</p>
        </div>
        {expanded && (
          <>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:"0.72rem", color:"#7c3aed", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600, marginBottom:5 }}>SOLUTION</div>
              <p style={{ fontSize:"0.82rem", color:"#94a3b8", lineHeight:1.6 }}>{p.solution}</p>
            </div>
            <div>
              <div style={{ fontSize:"0.72rem", color:"#10b981", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600, marginBottom:8 }}>RESULTS</div>
              {p.results.map((r,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", flexShrink:0 }}/>
                  <span style={{ fontSize:"0.82rem", color:"#d1fae5" }}>{r}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <button onClick={()=>setExpanded(!expanded)} style={{
          marginTop:16, background:"none", border:"1px solid rgba(59,130,246,0.3)",
          color:"#3b82f6", padding:"7px 18px", borderRadius:8, cursor:"pointer",
          fontSize:"0.8rem", fontFamily:"Syne,sans-serif", fontWeight:600, transition:"all 0.3s",
          display:"flex", alignItems:"center", gap:6
        }}>
          {expanded ? "Show Less ↑" : "View Case Study →"}
        </button>
      </div>
    </div>
  );
}

function TestiCard({ t, idx }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className="testi-card" style={{
      borderRadius:20, padding:"28px 24px",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
      transition:`all 0.6s ease ${(idx%3)*100}ms`
    }}>
      {/* Stars */}
      <div style={{ display:"flex", gap:3, marginBottom:16 }}>
        {[...Array(5)].map((_,i)=>(
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
            <path d={ICONS.star}/>
          </svg>
        ))}
      </div>
      {/* Quote */}
      <p style={{ color:"#cbd5e1", fontSize:"0.875rem", lineHeight:1.75, marginBottom:20, fontStyle:"italic" }}>
        "{t.text}"
      </p>
      {/* Result badge */}
      <div style={{ display:"inline-block", background:t.color+"15", border:`1px solid ${t.color}30`,
        color:t.color, fontSize:"0.75rem", padding:"4px 12px", borderRadius:999, marginBottom:18, fontWeight:600 }}>
        ✓ {t.result}
      </div>
      {/* Author */}
      <div style={{ display:"flex", alignItems:"center", gap:12, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:18 }}>
        <div style={{
          width:42, height:42, borderRadius:"50%",
          background:`linear-gradient(135deg, ${t.color}, ${t.color}80)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.85rem", color:"#fff", flexShrink:0
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.9rem" }}>{t.name}</div>
          <div style={{ color:"#64748b", fontSize:"0.78rem" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", service:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [aiReply, setAiReply] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus("error"); setAiReply("Please fill in all required fields."); return;
    }
    setStatus("sending");
    try {
      const systemPrompt = `You are Nico Adajar's AI assistant. A potential client just submitted a contact form. 
Write a warm, professional, personalized auto-reply acknowledgment (3-4 sentences). 
Be specific about their service interest if provided. Sign as "Nico Adajar's Team".
Keep it under 80 words. Do not use asterisks or markdown formatting.`;

      const userMsg = `Client name: ${form.name}
Email: ${form.email}  
Service interest: ${form.service || "General inquiry"}
Message: ${form.message}

Write a short acknowledgment reply.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:150,
          messages:[{ role:"user", content: userMsg }],
          system: systemPrompt
        })
      });
      const data = await response.json();
      const reply = data.content?.map(b=>b.text||"").join("") || "Thank you for reaching out! Nico will respond shortly.";
      setAiReply(reply);
      setStatus("success");
      setForm({ name:"", email:"", service:"", message:"" });
    } catch(e) {
      setStatus("success");
      setAiReply("Thank you for your message! Nico will get back to you within 24 hours. — Nico Adajar's Team");
    }
  };

  const inp = (field, placeholder, type="text", multi=false) => {
    const Tag = multi ? "textarea" : "input";
    return (
      <Tag type={type} placeholder={placeholder} value={form[field]}
        onChange={e=>setForm({...form,[field]:e.target.value})}
        className="form-input"
        rows={multi?5:undefined}
        style={{ padding:"13px 16px", borderRadius:10, fontSize:"0.88rem", resize:multi?"vertical":"none" }}
      />
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {inp("name","Your Full Name *")}
        {inp("email","Email Address *","email")}
      </div>
      <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}
        className="form-input" style={{ padding:"13px 16px", borderRadius:10, fontSize:"0.88rem" }}>
        <option value="">Select a Service</option>
        {SERVICES.map(s=><option key={s.title} value={s.title}>{s.title}</option>)}
      </select>
      {inp("message","Tell me about your project, goals, and budget *","text",true)}

      {status === "success" ? (
        <div style={{
          background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)",
          borderRadius:12, padding:"18px 20px", color:"#6ee7b7", fontSize:"0.875rem", lineHeight:1.7
        }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, marginBottom:8 }}>✓ Message Received!</div>
          {aiReply}
        </div>
      ) : (
        <button className="btn-primary" onClick={handleSubmit} disabled={status==="sending"}
          style={{ padding:"14px 28px", borderRadius:10, fontFamily:"Syne,sans-serif", fontWeight:700,
            fontSize:"0.95rem", position:"relative", zIndex:1, display:"flex", alignItems:"center",
            justifyContent:"center", gap:10, opacity:status==="sending"?0.7:1 }}>
          {status==="sending" ? (
            <><div style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",
              borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Sending...</>
          ) : (
            <><Icon d={ICONS.send} size={18} color="#fff"/>Send Message</>
          )}
        </button>
      )}

      {status==="error" && (
        <div style={{ color:"#f87171", fontSize:"0.82rem", textAlign:"center" }}>{aiReply}</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NicoPortfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [filter, setFilter] = useState("All");

  // Inject styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Mobile nav responsive
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@media(max-width:768px){.nav-desktop{display:none!important;}#hamburger{display:block!important;}}`;
    document.head.appendChild(style);
  }, []);

  // Active section detection
  useEffect(() => {
    const sections = ["home","services","portfolio","about","testimonials","contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.4 });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const filtered = filter === "All" ? PORTFOLIO : PORTFOLIO.filter(p=>p.tag===filter);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  // Hero section ref for animation
  const heroRef = useRef(null);

  return (
    <div className="noise" style={{ background:"var(--bg)", minHeight:"100vh" }}>
      <Navbar active={activeSection}/>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center",
        position:"relative", overflow:"hidden", paddingTop:72 }}>

        {/* Grid bg */}
        <div className="grid-bg" style={{ position:"absolute", inset:0, zIndex:0 }}/>

        {/* Blobs */}
        <div className="blob" style={{ width:600, height:600, top:"-100px", left:"-150px",
          background:"radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", zIndex:0 }}/>
        <div className="blob" style={{ width:500, height:500, bottom:"-50px", right:"-100px",
          background:"radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", zIndex:0, animationDelay:"4s" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px", position:"relative", zIndex:1, width:"100%" }}>
          <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>

            {/* Text */}
            <div ref={heroRef}>
              {/* Badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24,
                background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)",
                borderRadius:999, padding:"6px 16px", animation:"fadeIn 0.8s ease forwards" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#3b82f6", animation:"pulse 2s ease infinite" }}/>
                <span style={{ fontSize:"0.78rem", color:"#93c5fd", letterSpacing:"0.06em", fontWeight:500 }}>AVAILABLE FOR PROJECTS</span>
              </div>

              <h1 style={{
                fontFamily:"Syne,sans-serif", fontWeight:800, lineHeight:1.08,
                fontSize:"clamp(2.6rem,5vw,4rem)", marginBottom:6,
                animation:"fadeUp 0.9s ease 0.1s both"
              }}>Nico Adajar</h1>

              <h2 style={{
                fontFamily:"Syne,sans-serif", fontWeight:700, lineHeight:1.2,
                fontSize:"clamp(1.5rem,3vw,2rem)", marginBottom:20,
                background:"linear-gradient(135deg, #3b82f6, #8b5cf6, #f59e0b)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                animation:"fadeUp 0.9s ease 0.2s both"
              }}>Full Stack Digital Growth Specialist</h2>

              <p style={{
                color:"#94a3b8", fontSize:"clamp(1rem,2vw,1.1rem)", lineHeight:1.75,
                maxWidth:520, marginBottom:36,
                animation:"fadeUp 0.9s ease 0.3s both"
              }}>
                I help businesses <span style={{ color:"#f1f5f9", fontWeight:500 }}>scale using automation, ads,</span> and{" "}
                <span style={{ color:"#f1f5f9", fontWeight:500 }}>high-converting content.</span> From zero to measurable revenue — fast.
              </p>

              {/* CTAs */}
              <div className="hero-btns" style={{ display:"flex", gap:14, flexWrap:"wrap",
                animation:"fadeUp 0.9s ease 0.4s both" }}>
                <button className="btn-primary" onClick={()=>scrollTo("contact")} style={{
                  padding:"14px 30px", borderRadius:12, fontFamily:"Syne,sans-serif",
                  fontWeight:700, fontSize:"0.95rem", position:"relative", zIndex:1,
                  display:"flex", alignItems:"center", gap:10
                }}>
                  Work With Me <Icon d={ICONS.arrow} size={18} color="#fff"/>
                </button>
                <button className="btn-outline" onClick={()=>scrollTo("portfolio")} style={{
                  padding:"14px 30px", borderRadius:12, fontFamily:"Syne,sans-serif",
                  fontWeight:700, fontSize:"0.95rem"
                }}>
                  View Portfolio
                </button>
              </div>

              {/* Social links */}
              <div style={{ display:"flex", gap:14, marginTop:32, animation:"fadeUp 0.9s ease 0.5s both" }}>
                {[
                  { icon:ICONS.mail, url:"mailto:nicoadajar@email.com", color:"#3b82f6" },
                  { icon:ICONS.fb, url:"https://facebook.com/nicoadajar", color:"#1877f2" },
                  { icon:ICONS.tg, url:"https://t.me/nicoadajar", color:"#26a5e4" },
                  { icon:ICONS.wa, url:"https://wa.me/639XXXXXXXXX", color:"#25d366" },
                ].map((s,i)=>(
                  <a key={i} href={s.url} target="_blank" rel="noopener" style={{
                    width:40, height:40, borderRadius:10, border:"1px solid rgba(255,255,255,0.1)",
                    background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center",
                    justifyContent:"center", transition:"all 0.3s", color:s.color,
                    textDecoration:"none"
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background=s.color+"15";e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.transform="translateY(0)";}}>
                    <Icon d={s.icon} size={17} color={s.color}/>
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Image */}
            <div className="hero-img" style={{ display:"flex", justifyContent:"center", alignItems:"center",
              animation:"fadeIn 1s ease 0.3s both" }}>
              <div style={{ position:"relative" }}>
                {/* Outer glow ring */}
                <div className="anim-glow" style={{
                  position:"absolute", inset:-16, borderRadius:"50%",
                  background:"linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))",
                  filter:"blur(20px)", zIndex:0
                }}/>
                {/* Rotating border */}
                <div style={{
                  position:"absolute", inset:-6, borderRadius:"50%",
                  background:"conic-gradient(from 0deg, #3b82f6, #7c3aed, #f59e0b, #3b82f6)",
                  animation:"spin 8s linear infinite", zIndex:1
                }}/>
                {/* Inner mask */}
                <div style={{ position:"relative", zIndex:2, borderRadius:"50%",
                  padding:5, background:"var(--bg)" }}>
                  <div className="anim-float" style={{
                    width:"clamp(260px,30vw,360px)", height:"clamp(260px,30vw,360px)",
                    borderRadius:"50%", overflow:"hidden", position:"relative"
                  }}>
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=90"
                      alt="Nico Adajar"
                      style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}
                    />
                    <div style={{ position:"absolute", inset:0,
                      background:"linear-gradient(to bottom, transparent 50%, rgba(6,6,16,0.3) 100%)" }}/>
                  </div>
                </div>

                {/* Floating badge 1 */}
                <div className="glass" style={{
                  position:"absolute", bottom:40, left:-40, borderRadius:14, padding:"10px 16px",
                  zIndex:10, animation:"float 5s ease-in-out infinite", minWidth:140
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ fontSize:"1.2rem" }}>📈</div>
                    <div>
                      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.95rem", color:"#10b981" }}>$500K+</div>
                      <div style={{ fontSize:"0.7rem", color:"#64748b" }}>Ad Spend Managed</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge 2 */}
                <div className="glass" style={{
                  position:"absolute", top:30, right:-40, borderRadius:14, padding:"10px 16px",
                  zIndex:10, animation:"float 5s ease-in-out 1s infinite", minWidth:130
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ fontSize:"1.2rem" }}>⚡</div>
                    <div>
                      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.95rem", color:"#f59e0b" }}>50+</div>
                      <div style={{ fontSize:"0.7rem", color:"#64748b" }}>Projects Done</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:8, animation:"fadeIn 1.5s ease 1s both" }}>
          <span style={{ fontSize:"0.72rem", color:"#475569", letterSpacing:"0.1em" }}>SCROLL</span>
          <div style={{ width:1, height:40, background:"linear-gradient(to bottom,#3b82f6,transparent)",
            animation:"pulse 2s ease infinite" }}/>
        </div>
      </section>

      {/* ── TRUST / STATS ── */}
      <section style={{ padding:"80px 24px", background:"rgba(255,255,255,0.01)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            <StatCard label="Projects Completed" value={50} suffix="+" delay={0}/>
            <StatCard label="Revenue Generated" value={2} suffix="M+" prefix="$" delay={100}/>
            <StatCard label="Ad Spend Managed" value={500} suffix="K+" prefix="$" delay={200}/>
            <StatCard label="Client Satisfaction" value={98} suffix="%" delay={300}/>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          {/* Section header */}
          <div style={{ marginBottom:64, maxWidth:560 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div className="section-line"/>
              <span style={{ fontSize:"0.75rem", color:"#3b82f6", letterSpacing:"0.12em", fontWeight:600, textTransform:"uppercase" }}>
                What I Do
              </span>
            </div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.9rem,4vw,2.8rem)", lineHeight:1.15, marginBottom:16 }}>
              Services Built for{" "}
              <span style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Real Results
              </span>
            </h2>
            <p style={{ color:"#64748b", fontSize:"0.95rem", lineHeight:1.75 }}>
              Every service is designed to generate measurable ROI — not just deliverables.
            </p>
          </div>

          <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }}>
            {SERVICES.map((svc,i) => <ServiceCard key={svc.title} svc={svc} idx={i}/>)}
          </div>

          {/* CTA */}
          <div style={{ textAlign:"center", marginTop:56 }}>
            <button className="btn-primary" onClick={()=>scrollTo("contact")} style={{
              padding:"15px 40px", borderRadius:12, fontFamily:"Syne,sans-serif",
              fontWeight:700, fontSize:"0.95rem", position:"relative", zIndex:1
            }}>
              Let's Talk About Your Project →
            </button>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" style={{ padding:"100px 24px", background:"rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:48, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:24 }}>
            <div style={{ maxWidth:500 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div className="section-line"/>
                <span style={{ fontSize:"0.75rem", color:"#3b82f6", letterSpacing:"0.12em", fontWeight:600, textTransform:"uppercase" }}>Case Studies</span>
              </div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.9rem,4vw,2.8rem)", lineHeight:1.15 }}>
                Proof That{" "}
                <span style={{ background:"linear-gradient(135deg,#f59e0b,#ef4444)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  Pays Off
                </span>
              </h2>
            </div>
            {/* Filter */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {TAGS.map(t=>(
                <button key={t} className={`filter-btn${filter===t?" active":""}`}
                  onClick={()=>setFilter(t)}
                  style={{ padding:"7px 18px", borderRadius:999, fontWeight:500 }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="portfolio-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }}>
            {filtered.map((p,i)=><PortfolioCard key={p.id} p={p} idx={i}/>)}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>

            {/* Image */}
            <div style={{ position:"relative" }}>
              <div style={{
                borderRadius:24, overflow:"hidden", position:"relative",
                border:"1px solid rgba(59,130,246,0.15)"
              }}>
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=85"
                  alt="Nico Adajar"
                  loading="lazy"
                  style={{ width:"100%", height:500, objectFit:"cover", objectPosition:"top", display:"block" }}
                />
                <div style={{ position:"absolute", inset:0,
                  background:"linear-gradient(to right, rgba(6,6,16,0.05) 0%, transparent 40%, transparent 100%)" }}/>
              </div>
              {/* Experience badge */}
              <div className="glass" style={{
                position:"absolute", bottom:-20, right:-20, borderRadius:18, padding:"20px 24px",
                textAlign:"center", minWidth:140
              }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"2.2rem",
                  background:"linear-gradient(135deg,#3b82f6,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>5+</div>
                <div style={{ fontSize:"0.78rem", color:"#64748b" }}>Years Experience</div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div className="section-line"/>
                <span style={{ fontSize:"0.75rem", color:"#3b82f6", letterSpacing:"0.12em", fontWeight:600, textTransform:"uppercase" }}>About Nico</span>
              </div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.5vw,2.6rem)", lineHeight:1.15, marginBottom:24 }}>
                The Growth Partner{" "}
                <span style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  Behind the Numbers
                </span>
              </h2>

              <p style={{ color:"#94a3b8", lineHeight:1.85, marginBottom:18, fontSize:"0.95rem" }}>
                I'm Nico Adajar — a full-stack digital growth specialist from the Philippines with 5+ years of experience turning online businesses into revenue machines. I don't just deliver services. I architect systems that <strong style={{ color:"#f1f5f9" }}>grow, scale, and compound over time.</strong>
              </p>
              <p style={{ color:"#94a3b8", lineHeight:1.85, marginBottom:28, fontSize:"0.95rem" }}>
                From managing <strong style={{ color:"#f1f5f9" }}>$500K+ in ad spend</strong> to building faceless YouTube channels that generate passive income, I bring a business-owner mindset to every project. My clients don't pay for work — they invest in <strong style={{ color:"#f1f5f9" }}>outcomes.</strong>
              </p>

              {/* Expertise tags */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:32 }}>
                {["Performance Marketing","YouTube Systems","Conversion CRO","AI Automation","Full-Stack Dev","Content Strategy"].map(t=>(
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>

              {/* Values */}
              {[
                { icon:ICONS.zap, label:"Speed", desc:"Fast execution without sacrificing quality" },
                { icon:ICONS.chart, label:"Results", desc:"ROI-first mindset in every decision" },
                { icon:ICONS.shield, label:"Trust", desc:"Transparent communication, always" },
              ].map((v,i)=>(
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:18 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"rgba(59,130,246,0.1)",
                    border:"1px solid rgba(59,130,246,0.2)", display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0 }}>
                    <Icon d={v.icon} size={18} color="#3b82f6"/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.9rem", marginBottom:2 }}>{v.label}</div>
                    <div style={{ color:"#64748b", fontSize:"0.82rem" }}>{v.desc}</div>
                  </div>
                </div>
              ))}

              <button className="btn-primary" onClick={()=>scrollTo("contact")} style={{
                marginTop:12, padding:"13px 32px", borderRadius:12, fontFamily:"Syne,sans-serif",
                fontWeight:700, fontSize:"0.9rem", position:"relative", zIndex:1
              }}>
                Work With Nico →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding:"100px 24px", background:"rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
              <div className="section-line"/>
              <span style={{ fontSize:"0.75rem", color:"#3b82f6", letterSpacing:"0.12em", fontWeight:600, textTransform:"uppercase" }}>Client Wins</span>
              <div className="section-line"/>
            </div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.9rem,4vw,2.8rem)", lineHeight:1.15, marginBottom:14 }}>
              What Clients{" "}
              <span style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Say & Achieve
              </span>
            </h2>
            <p style={{ color:"#64748b", maxWidth:480, margin:"0 auto", fontSize:"0.92rem" }}>
              Real results from real businesses. Every testimonial comes with measurable proof.
            </p>
          </div>

          <div className="testi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {TESTIMONIALS.map((t,i)=><TestiCard key={i} t={t} idx={i}/>)}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:"100px 24px", position:"relative", overflow:"hidden" }}>
        {/* BG accents */}
        <div style={{ position:"absolute", top:"10%", right:"5%", width:400, height:400,
          background:"radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:400, height:400,
          background:"radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
              <div className="section-line"/>
              <span style={{ fontSize:"0.75rem", color:"#3b82f6", letterSpacing:"0.12em", fontWeight:600, textTransform:"uppercase" }}>Get In Touch</span>
              <div className="section-line"/>
            </div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.9rem,4vw,2.8rem)", lineHeight:1.15, marginBottom:14 }}>
              Ready to{" "}
              <span style={{ background:"linear-gradient(135deg,#3b82f6,#f59e0b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Scale Your Business?
              </span>
            </h2>
            <p style={{ color:"#64748b", maxWidth:520, margin:"0 auto", fontSize:"0.92rem", lineHeight:1.75 }}>
              Whether you need ads, content, or a full digital growth strategy — I'm here to deliver results. Let's talk.
            </p>
          </div>

          <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:40 }}>

            {/* Left: Direct contact */}
            <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
              <div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.15rem", marginBottom:6 }}>Direct Contact</h3>
                <p style={{ color:"#64748b", fontSize:"0.85rem" }}>Prefer to reach out directly? All channels are active.</p>
              </div>

              {[
                { icon:ICONS.mail, label:"Email", value:"nicoadajar@email.com", url:"mailto:nicoadajar@email.com", color:"#3b82f6" },
                { icon:ICONS.fb,   label:"Facebook", value:"facebook.com/nicoadajar", url:"https://facebook.com/nicoadajar", color:"#1877f2" },
                { icon:ICONS.tg,   label:"Telegram", value:"t.me/nicoadajar", url:"https://t.me/nicoadajar", color:"#26a5e4" },
                { icon:ICONS.wa,   label:"WhatsApp", value:"+63 9XX XXX XXXX", url:"https://wa.me/639XXXXXXXXX", color:"#25d366" },
              ].map((c,i)=>(
                <a key={i} href={c.url} target="_blank" rel="noopener" style={{
                  display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
                  borderRadius:14, border:"1px solid rgba(255,255,255,0.07)",
                  background:"rgba(255,255,255,0.025)", textDecoration:"none", color:"var(--text)",
                  transition:"all 0.3s ease"
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color+"50";e.currentTarget.style.background=c.color+"10";e.currentTarget.style.transform="translateX(4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.background="rgba(255,255,255,0.025)";e.currentTarget.style.transform="translateX(0)";}}>
                  <div style={{ width:40, height:40, borderRadius:10, background:c.color+"15",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon d={c.icon} size={18} color={c.color}/>
                  </div>
                  <div>
                    <div style={{ fontSize:"0.75rem", color:"#64748b", marginBottom:2 }}>{c.label}</div>
                    <div style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:"0.9rem", color:c.color }}>{c.value}</div>
                  </div>
                  <div style={{ marginLeft:"auto" }}>
                    <Icon d={ICONS.ext} size={15} color="#475569"/>
                  </div>
                </a>
              ))}

              {/* Response time */}
              <div style={{ padding:"16px 20px", borderRadius:14, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", animation:"pulse 2s ease infinite" }}/>
                  <span style={{ color:"#6ee7b7", fontSize:"0.82rem", fontWeight:600 }}>Typically responds within 2–4 hours</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="glass" style={{ borderRadius:24, padding:"36px 32px" }}>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.15rem", marginBottom:6 }}>Send a Message</h3>
              <p style={{ color:"#64748b", fontSize:"0.85rem", marginBottom:28 }}>Fill out the form and get an instant AI-powered acknowledgment.</p>
              <ContactForm/>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid var(--border)", padding:"40px 24px 30px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
            {/* Brand */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:34, height:34, borderRadius:9,
                background:"linear-gradient(135deg,#3b82f6,#7c3aed)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.8rem", color:"#fff"
              }}>NA</div>
              <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.95rem" }}>
                Nico<span style={{ color:"#3b82f6" }}>Adajar</span>
              </span>
            </div>

            {/* Links */}
            <div style={{ display:"flex", gap:24 }}>
              {["Services","Portfolio","About","Contact"].map(l=>(
                <span key={l} style={{ color:"#64748b", fontSize:"0.82rem", cursor:"pointer", transition:"color 0.3s" }}
                  onClick={()=>scrollTo(l.toLowerCase())}
                  onMouseEnter={e=>e.currentTarget.style.color="#94a3b8"}
                  onMouseLeave={e=>e.currentTarget.style.color="#64748b"}>{l}</span>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display:"flex", gap:10 }}>
              {[
                { icon:ICONS.mail, url:"mailto:nicoadajar@email.com", color:"#3b82f6" },
                { icon:ICONS.fb, url:"https://facebook.com/nicoadajar", color:"#1877f2" },
                { icon:ICONS.tg, url:"https://t.me/nicoadajar", color:"#26a5e4" },
                { icon:ICONS.wa, url:"https://wa.me/639XXXXXXXXX", color:"#25d366" },
              ].map((s,i)=>(
                <a key={i} href={s.url} target="_blank" rel="noopener" style={{
                  width:34, height:34, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)",
                  background:"rgba(255,255,255,0.03)", display:"flex", alignItems:"center",
                  justifyContent:"center", transition:"all 0.3s", textDecoration:"none"
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background=s.color+"15";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.background="rgba(255,255,255,0.03)";}}>
                  <Icon d={s.icon} size={15} color={s.color}/>
                </a>
              ))}
            </div>
          </div>

          <div style={{ marginTop:28, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.04)",
            display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <span style={{ color:"#334155", fontSize:"0.78rem" }}>
              © 2025 Nico Adajar. All rights reserved.
            </span>
            <span style={{ color:"#334155", fontSize:"0.78rem" }}>
              Full Stack Digital Growth Specialist · Philippines
            </span>
          </div>
        </div>
      </footer>

      {/* ── FLOATING BUTTONS ── */}
      {/* WhatsApp */}
      <a href="https://wa.me/639XXXXXXXXX" target="_blank" rel="noopener"
        className="float-btn"
        style={{ bottom:100, background:"#25d366", color:"#fff" }}
        title="Chat on WhatsApp">
        <Icon d={ICONS.wa} size={22} color="#fff"/>
      </a>

      {/* Telegram */}
      <a href="https://t.me/nicoadajar" target="_blank" rel="noopener"
        className="float-btn"
        style={{ bottom:40, background:"#26a5e4", color:"#fff" }}
        title="Message on Telegram">
        <Icon d={ICONS.tg} size={22} color="#fff"/>
      </a>

      {/* Scroll to top */}
      <button onClick={()=>scrollTo("home")}
        className="float-btn"
        style={{ bottom:160, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
          color:"#94a3b8", backdropFilter:"blur(10px)" }}
        title="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
}
