import { useEffect, useRef, useState } from "react";
import { Router, Route, Switch } from "wouter";
import AdminPanel from "./pages/AdminPanel";

/* ─── EVENTS DEFAULT DATA ─────────────────────────────────────────────────────
 * Edit this array to add, remove, or update events.
 * Fields: id, title, date (YYYY-MM-DD), image (https URL), location, description, tags[]
 * "Upcoming" / "Past" status is auto-computed from the date — no manual tag needed.
 * Changes made via the Admin Panel (/admin-panel-nnf) override this array in localStorage.
 * ─────────────────────────────────────────────────────────────────────────── */
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "Poshak Daan — Winter Clothes Distribution",
    date: "2025-01-15",
    image: "https://st5.depositphotos.com/85374488/70881/i/450/depositphotos_708816192-stock-photo-school-children-teacher-ngo-patang.jpg",
    location: "Multiple locations, Ujjain",
    description: "Collection and distribution of warm clothes, blankets, and essentials to homeless and destitute families ahead of winter.",
    tags: ["Community", "Relief"],
  },
  {
    id: 2,
    title: "Makar Sankranti Blood Donation Camp",
    date: "2025-01-14",
    image: "https://www.shutterstock.com/image-photo/delhi-india-june-19-2023-600nw-2370827869.jpg",
    location: "Civil Hospital, Ujjain",
    description: "A community blood donation drive held in collaboration with civil hospital. Over 80 units collected, benefiting hundreds of patients.",
    tags: ["Health"],
  },
  {
    id: 3,
    title: "Swachh Bharat Abhiyan — Community Cleanliness Drive",
    date: "2026-04-22",
    image: "https://media.gettyimages.com/id/524106594/photo/new-delhi-india-bjp-workers-participate-in-cleaning-the-yamuna-river-during-atal-clean-yamuna.jpg?s=612x612&w=0&k=20&c=0rcc3CN6Y2Nvl8PJjkXPca1igXBwqgFiVpbwWq8rqbw=",
    location: "Mahakal Temple Road, Ujjain",
    description: "Join us for a city-wide cleanliness campaign. Volunteers will clean public spaces, plant saplings, and spread awareness about sanitation.",
    tags: ["Environment"],
  },
  {
    id: 4,
    title: "Health Camp — Free Medical Checkup",
    date: "2026-05-10",
    image: "https://thumbs.dreamstime.com/b/ngo-activity-doctor-examine-child-health-clinic-center-which-organized-half-india-s-children-under-age-63979746.jpg",
    location: "Community Hall, Freeganj, Ujjain",
    description: "Free health checkups, blood tests, and medicine distribution for underprivileged families. Expert doctors will be on site.",
    tags: ["Health"],
  },
  {
    id: 5,
    title: "Shiksha Utsav — Scholarship Distribution Ceremony",
    date: "2026-06-05",
    image: "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwc3R1ZGVudHN8ZW58MHx8MHx8fDA%3D",
    location: "Vikram University Grounds, Ujjain",
    description: "Annual scholarship awards for meritorious students from economically weaker sections. Over 50 students to be felicitated this year.",
    tags: ["Education"],
  },
  {
    id: 6,
    title: "Mahila Shakti Workshop — Women's Skill Development",
    date: "2026-06-22",
    image: "https://plus.unsplash.com/premium_photo-1681483573122-ab391ec07a87?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29tZW4lMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D",
    location: "Ninv Nishchay Centre, Ujjain",
    description: "A two-day workshop empowering women with skills in tailoring, digital literacy, and entrepreneurship to support self-reliance.",
    tags: ["Women", "Skills"],
  },
  {
    id: 7,
    title: "Vriksh Mitra — Tree Plantation Drive",
    date: "2026-07-14",
    image: "https://images.unsplash.com/photo-1625758476104-f2ed6c81248f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJlZSUyMHBsYW50YXRpb258ZW58MHx8MHx8fDA%3D",
    location: "Various locations, Ujjain District",
    description: "Plantation of 500+ native trees across Ujjain district in collaboration with local schools and Gram Panchayats.",
    tags: ["Environment"],
  },
  {
    id: 8,
    title: "Annadaan Mahotsav — Community Feast & Food Drive",
    date: "2026-09-02",
    image: "https://www.shutterstock.com/image-photo/new-delhi-india-march-12-600nw-1952430571.jpg",
    location: "Ram Ghat, Ujjain",
    description: "A grand community feast serving thousands of underprivileged citizens, combined with dry ration distribution for 200+ families.",
    tags: ["Nutrition", "Community"],
  },
];

export type NNFEvent = typeof DEFAULT_EVENTS[0];

/** Load events from localStorage (set by Admin Panel), or fall back to defaults. */
function loadEvents(): NNFEvent[] {
  try {
    const stored = localStorage.getItem("nnf_events");
    if (stored) return JSON.parse(stored);
  } catch {
    // QuotaExceededError or SecurityError — silently fall back
  }
  return DEFAULT_EVENTS;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
    full: d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
  };
}

/** Re-runs IntersectionObserver whenever deps change so filter changes re-animate cards. */
function useReveal(deps: React.DependencyList = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    // Small delay to let DOM settle after state change
    const timeout = setTimeout(() => {
      const els = document.querySelectorAll(".reveal:not(.visible)");
      els.forEach((el) => observer.observe(el));
    }, 50);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ─── SMOOTH SCROLL WITH NAVBAR OFFSET ───────────────────────────────────── */
function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) {
    const yOffset = -80; // account for 70px sticky navbar + breathing room
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

/* ─── LOGO ─────────────────────────────────────────────────────────────────
 * Place the foundation's real logo as /public/logo.png to activate it.
 * Falls back to the emoji icon if logo.png is not found.
 * ────────────────────────────────────────────────────────────────────────── */
function LogoIcon({ size = 40 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="nav-logo-icon" style={{ fontSize: size * 0.55 }}>🌱</div>
    );
  }
  return (
    <div className="nav-logo-icon" style={{ background: "transparent", padding: 0 }}>
      <img
        src="/logo.png"
        alt="Ninv Nishchay Foundation Logo"
        style={{ width: size, height: size, objectFit: "contain", borderRadius: 4 }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#programs", label: "Our Work" },
    { href: "#events", label: "Events" },
    { href: "#donate", label: "Donate" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNav = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNav("#home"); }}>
            <LogoIcon size={40} />
            <div className="nav-logo-text">
              <span className="nav-logo-name">Ninv Nishchay</span>
              <span className="nav-logo-tag">Foundation</span>
            </div>
          </a>

          <ul className={`nav-links${open ? " open" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={link.href === "#donate" ? "nav-cta" : ""}
                  onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={`nav-hamburger${open ? " open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" id="home">
      <div
        className="hero-bg"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80')" }}
      />
      <div className="hero-overlay" />
      <div className="hero-pattern" />
      <div className="container" style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div className="hero-content">
          <div className="hero-badge">Registered NGO — Ujjain, M.P.</div>
          <h1 className="hero-title">
            <span>Ninv Nishchay</span>
            <br />Foundation
          </h1>
          <p className="hero-tagline">"Dridh Sankalp, Ujjwal Bhavishya"</p>
          <p className="hero-desc">
            A firm resolve for a brighter tomorrow. Ninv Nishchay Foundation works for the upliftment of
            marginalized communities across Madhya Pradesh — with a special focus on farmers and natural
            agriculture — through programs in health, education, women empowerment, and sustainable
            community development.
          </p>
          <div className="hero-actions">
            <a
              href="#donate"
              className="btn-primary"
              onClick={(e) => { e.preventDefault(); scrollTo("#donate"); }}
            >
              💛 Donate Now
            </a>
            <a
              href="#about"
              className="btn-secondary"
              onClick={(e) => { e.preventDefault(); scrollTo("#about"); }}
            >
              Learn More →
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">500+</span>
            <span className="hero-stat-label">Lives Impacted</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">10+</span>
            <span className="hero-stat-label">Programs Running</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">3</span>
            <span className="hero-stat-label">Districts Covered</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll">SCROLL</div>
    </section>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img-wrap reveal">
            <img
              className="about-img-main"
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
              alt="Ninv Nishchay Foundation volunteers in India"
            />
            <div className="about-img-badge">
              <span className="about-img-badge-num">2025</span>
              <span className="about-img-badge-label">Founded</span>
            </div>
          </div>

          <div className="about-content reveal">
            <span className="section-label">About Us</span>
            <h2 className="section-heading">Who We Are</h2>
            <p className="about-body">
              Ninv Nishchay Foundation (CIN: U88900MP2025NPL080689) is a registered Section 8
              not-for-profit company founded in December 2025, headquartered in Ujjain — the heart of
              Malwa's agricultural belt in Madhya Pradesh.
            </p>
            <p className="about-body" style={{ marginTop: "-20px" }}>
              We are a community-driven NGO working across multiple areas of social welfare, with a
              strong emphasis on supporting farmers and promoting sustainable, natural agriculture.
              Alongside our agricultural programs, we run initiatives in rural healthcare, children's
              education, women's empowerment, environmental conservation, and food security — because
              we believe true development is holistic.
            </p>
            <p className="about-body" style={{ marginTop: "-20px" }}>
              Our volunteers, donors, and partner organizations form a growing movement rooted in
              compassion, integrity, and an unwavering resolve to serve without discrimination.
            </p>

            <div className="mvv-grid">
              <div className="mvv-card">
                <div className="mvv-icon">🎯</div>
                <div className="mvv-title">Our Mission</div>
                <div className="mvv-body">
                  To empower farmers, rural families, and marginalized communities through sustainable
                  agriculture, accessible healthcare, quality education, and holistic development
                  programs across Madhya Pradesh.
                </div>
              </div>
              <div className="mvv-card">
                <div className="mvv-icon">🔭</div>
                <div className="mvv-title">Our Vision</div>
                <div className="mvv-body">
                  A self-reliant, equitable society where farmers are respected, rural communities
                  thrive, and every individual has access to dignity, opportunity, and a secure
                  livelihood.
                </div>
              </div>
              <div className="mvv-card">
                <div className="mvv-icon">🌾</div>
                <div className="mvv-title">Our Values</div>
                <div className="mvv-body">
                  Integrity, compassion, respect for nature and farmers, inclusivity, transparency,
                  and an unwavering resolve to serve communities without discrimination.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PROGRAMS ──────────────────────────────────────────────────────────── */
function Programs() {
  const programs = [
    {
      title: "Natural Farming & Agriculture",
      icon: "🌾",
      desc: "Our flagship program — training farmers in chemical-free, natural farming techniques using indigenous seeds, cow-based inputs, and traditional wisdom. We help reduce input costs, restore soil health, and connect farmers to organic markets.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80",
      tag: "Agriculture",
      flagship: true,
    },
    {
      title: "Healthcare & Wellness",
      icon: "🏥",
      desc: "Free medical camps, medicines, and health awareness drives for underprivileged families in rural and urban areas of Ujjain district — with special attention to pesticide-related illnesses in farming communities.",
      image: "https://thumbs.dreamstime.com/b/ngo-activity-doctor-examine-child-health-clinic-center-which-organized-half-india-s-children-under-age-63979746.jpg",
      tag: "Health",
      flagship: false,
    },
    {
      title: "Education & Scholarships",
      icon: "📚",
      desc: "Scholarships for meritorious students from economically weaker sections, digital literacy training, free coaching, and school supply distribution — especially for children of farmers and rural families.",
      image: "https://images.unsplash.com/photo-1652858672796-960164bd632b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "Education",
      flagship: false,
    },
    {
      title: "Women Empowerment",
      icon: "👩‍💼",
      desc: "Vocational training, self-help groups, and entrepreneurship support for rural women — including kitchen gardening, food processing from farm produce, tailoring, and legal awareness programs.",
      image: "https://www.webpulsefoundation.org/uploaded-files/category/images/thumbs/Women-Empowerment-thumbs-500X500.jpg",
      tag: "Women",
      flagship: false,
    },
    {
      title: "Community Development",
      icon: "🏘️",
      desc: "Skill development workshops, livelihood support, farmer collectives, and infrastructure initiatives to uplift entire villages and rural communities in Madhya Pradesh.",
      image: "https://plus.unsplash.com/premium_photo-1723795405075-ba40a9d25dac?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "Community",
      flagship: false,
    },
    {
      title: "Environment & Water Conservation",
      icon: "🌳",
      desc: "Tree plantation drives, watershed management, rainwater harvesting, and cleanliness campaigns — protecting agricultural land and ensuring long-term water availability for farming communities.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
      tag: "Environment",
      flagship: false,
    },
  ];

  return (
    <section className="programs" id="programs">
      <div className="container">
        <div className="section-intro reveal">
          <span className="section-label">Our Work</span>
          <h2 className="section-heading">Programs & Initiatives</h2>
          <p className="section-subheading">
            Six key focus areas where we drive meaningful, lasting change for communities across Madhya Pradesh.
          </p>
        </div>

        <div className="programs-grid">
          {programs.map((p, i) => (
            <div
              className={`program-card reveal${p.flagship ? " program-card--flagship" : ""}`}
              key={i}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <img className="program-img" src={p.image} alt={p.title} loading="lazy" />
              <div className="program-body">
                <div className="program-icon">{p.icon}</div>
                <h3 className="program-title">{p.title}</h3>
                <p className="program-desc">{p.desc}</p>
                <span className={`program-tag${p.flagship ? " program-tag--agriculture" : ""}`}>
                  {p.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── EVENTS ────────────────────────────────────────────────────────────── */
function getEventStatus(dateStr: string): "Upcoming" | "Past" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) >= today ? "Upcoming" : "Past";
}

type FilterType = "All" | "Upcoming" | "Past";

function Events({ events }: { events: NNFEvent[] }) {
  const [filter, setFilter] = useState<FilterType>("All");

  // Reset card visibility when filter changes so reveal re-animates
  useEffect(() => {
    document.querySelectorAll(".event-card.reveal").forEach((el) => {
      el.classList.remove("visible");
    });
  }, [filter]);

  // Re-run reveal observer on filter change
  useReveal([filter]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCount = events.filter((e) => new Date(e.date) >= today).length;
  const pastCount = events.filter((e) => new Date(e.date) < today).length;

  const filtered = events
    .filter((ev) => filter === "All" || getEventStatus(ev.date) === filter)
    .sort((a, b) => {
      if (filter === "Past") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return (
    <section className="events" id="events">
      <div className="container">
        <div className="section-intro reveal">
          <span className="section-label">Events</span>
          <h2 className="section-heading">Upcoming & Recent Events</h2>
          <p className="section-subheading">
            Join us on the ground. Every event is an opportunity to contribute, connect, and create change.
          </p>
        </div>

        <div className="events-filter-bar reveal">
          {(["All", "Upcoming", "Past"] as FilterType[]).map((f) => (
            <button
              key={f}
              className={`events-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="events-filter-count">
                {f === "All" ? events.length : f === "Upcoming" ? upcomingCount : pastCount}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="events-empty">
            <span>No {filter.toLowerCase()} events at the moment.</span>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.map((ev, i) => {
              const dt = formatDate(ev.date);
              const status = getEventStatus(ev.date);
              return (
                <div
                  className={`event-card reveal${status === "Past" ? " event-card--past" : ""}`}
                  key={ev.id}
                  style={{ transitionDelay: `${i * 55}ms` }}
                >
                  <div className="event-img-wrap">
                    <img className="event-img" src={ev.image} alt={ev.title} loading="lazy" />
                    <div className="event-status-pill" data-status={status}>
                      {status === "Upcoming" ? "🟢 Upcoming" : "🕐 Past"}
                    </div>
                    <div className="event-date-badge">
                      <span className="event-date-day">{dt.day}</span>
                      <span className="event-date-month">{dt.month}</span>
                      <span className="event-date-year">{dt.year}</span>
                    </div>
                    {status === "Past" && <div className="event-past-overlay" />}
                  </div>
                  <div className="event-body">
                    <div className="event-tags">
                      {ev.tags.map((tag) => (
                        <span className="event-tag-chip" key={tag}>{tag}</span>
                      ))}
                    </div>
                    <h3 className="event-title">{ev.title}</h3>
                    <p className="event-desc">{ev.description}</p>
                    <div className="event-footer">
                      <div className="event-meta">
                        <span className="event-meta-icon">📍</span>
                        <span>{ev.location}</span>
                      </div>
                      <div className="event-meta">
                        <span className="event-meta-icon">📅</span>
                        <span>{dt.full}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── DONATE ────────────────────────────────────────────────────────────── */
function Donate() {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate-inner" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>

          <div className="donate-content reveal" style={{ textAlign: "center", maxWidth: "680px" }}>
            <span className="section-label">Fund Us</span>
            <h2 className="section-heading">Support Our Mission</h2>
            <p className="donate-message">
              Your generous contribution — no matter the size — helps us deliver healthcare, education,
              and hope to hundreds of families across Madhya Pradesh. Every rupee goes directly to
              those who need it most.
            </p>
            <p className="donate-message" style={{ marginTop: "-12px" }}>
              Scan the QR code to donate instantly via UPI, or use the bank details below.
              Donations to Ninv Nishchay Foundation are eligible for tax benefits under applicable provisions.
            </p>
          </div>

          <div className="qr-panel reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="qr-box">
              <img
                className="qr-code"
                src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=ninvnishchayfoundation@gmail.com%26pn=NinvNishchayFoundation%26cu=INR&color=556020&bgcolor=F5F7EC"
                alt="UPI QR Code — ninvnishchayfoundation@gmail.com"
              />
              <div className="qr-title">Ninv Nishchay Foundation</div>
              <div className="qr-sub">Scan to donate via any UPI app</div>
              <div className="upi-id">ninvnishchayfoundation@gmail.com</div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", textAlign: "center", maxWidth: "280px", marginTop: "12px" }}>
              PayTM · PhonePe · Google Pay · BHIM · any UPI app
            </p>
          </div>

          <div className="donate-content reveal" style={{ maxWidth: "680px", width: "100%" }}>
            <div className="bank-details">
              <h4>Bank Transfer Details</h4>
              <div className="bank-row">
                <span className="bank-label">Account Name</span>
                <span className="bank-value">Ninv Nishchay Foundation</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Account No.</span>
                <span className="bank-value">46390200000074</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">IFSC Code</span>
                <span className="bank-value">BARB0KILOLI</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Bank</span>
                <span className="bank-value">Bank of Baroda</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Branch</span>
                <span className="bank-value">Kiloli, Ujjain</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">UPI ID</span>
                <span className="bank-value">ninvnishchayfoundation@gmail.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ───────────────────────────────────────────────────────────── */
function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // FormSpree handles rate limiting server-side.
  // For additional protection, consider adding a CAPTCHA (e.g., hCaptcha free tier).
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const formData = new FormData(formRef.current!);
      const response = await fetch("https://formspree.io/f/xreoywlg", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setSubmitted(true);
        formRef.current?.reset();
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setSubmitting(false);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-intro reveal">
          <span className="section-label">Contact Us</span>
          <h2 className="section-heading">Get in Touch</h2>
          <p className="section-subheading">
            We'd love to hear from you — whether you want to volunteer, partner, or simply learn more about our work.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info reveal">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-item-title">Address</div>
                <div className="contact-item-body">
                  C/O Ingoria, Badnagar Ujjain — 456222, Madhya Pradesh
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-item-title">Email Us</div>
                <div className="contact-item-body">
                  <a href="mailto:ninvnishchayfoundation@gmail.com" style={{ color: "inherit" }}>
                    ninvnishchayfoundation@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <div className="contact-item-title">Call / WhatsApp</div>
                <div className="contact-item-body">
                  <a href="tel:+916261724448" style={{ color: "inherit" }}>+91 62617 24448</a><br />
                  Mon – Sat, 10 AM – 6 PM
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <div>
                <div className="contact-item-title">Office Hours</div>
                <div className="contact-item-body">
                  Monday to Saturday<br />
                  10:00 AM – 6:00 PM IST
                </div>
              </div>
            </div>

            <div className="cin-box">
              <div className="cin-label">Corporate Identification Number (CIN)</div>
              <div className="cin-value">U88900MP2025NPL080689</div>
            </div>
          </div>

          <div className="contact-form reveal">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "var(--text-dark)", marginBottom: "24px" }}>
              Send us a Message
            </h3>
            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Honeypot field — hidden from real users, catches bots */}
              <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" type="text" name="firstName" placeholder="Rahul" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" type="text" name="lastName" placeholder="Sharma" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" name="email" placeholder="rahul@example.com" required />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" name="phone" placeholder="+91 9876543210" />
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <select className="form-select form-input" name="subject" required defaultValue="">
                  <option value="" disabled>Select a subject</option>
                  <option>General Enquiry</option>
                  <option>Volunteer with Us</option>
                  <option>Partnership / Collaboration</option>
                  <option>Donation Enquiry</option>
                  <option>Media / Press</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  name="message"
                  placeholder="Tell us how you'd like to get involved or ask your question..."
                  required
                />
              </div>

              <button type="submit" className="form-submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="form-spinner" /> Sending...
                  </>
                ) : (
                  <>Send Message ✉️</>
                )}
              </button>

              {submitted && (
                <div className="form-success" style={{ display: "block" }}>
                  Thank you! Your message has been sent to ninvnishchayfoundation@gmail.com. We'll get back to you within 2 business days.
                </div>
              )}
              {error && (
                <div className="form-error" style={{ display: "block" }}>
                  Something went wrong. Please email us directly at{" "}
                  <a href="mailto:ninvnishchayfoundation@gmail.com">ninvnishchayfoundation@gmail.com</a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-wrap">
              <LogoIcon size={36} />
              <div className="footer-logo-text">
                <div className="footer-brand-name">Ninv Nishchay Foundation</div>
                <div className="footer-brand-tag">Dridh Sankalp, Ujjwal Bhavishya</div>
              </div>
            </div>
            <p className="footer-brand-desc">
              A not-for-profit organization working for the upliftment of marginalized communities
              in Madhya Pradesh through health, education, and community development.
            </p>
          </div>

          <div>
            <div className="footer-heading">Quick Links</div>
            <ul className="footer-links">
              {[["#home","Home"],["#about","About Us"],["#programs","Our Work"],["#events","Events"],["#donate","Donate"],["#contact","Contact"]].map(([id, label]) => (
                <li key={id}>
                  <a href={id} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Our Programs</div>
            <ul className="footer-links">
              {["Healthcare & Wellness","Education & Scholarships","Community Development","Women Empowerment","Environment","Food Security"].map((p) => (
                <li key={p}><a href="#programs" onClick={(e) => { e.preventDefault(); scrollTo("#programs"); }}>{p}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Contact</div>
            <div className="footer-contact-item">
              <span>📍</span>
              <span>C/O Ingoria, Badnagar Ujjain — 456222, Madhya Pradesh</span>
            </div>
            <div className="footer-contact-item">
              <span>✉️</span>
              <a href="mailto:ninvnishchayfoundation@gmail.com" style={{ color: "inherit" }}>
                ninvnishchayfoundation@gmail.com
              </a>
            </div>
            <div className="footer-contact-item">
              <span>📞</span>
              <a href="tel:+916261724448" style={{ color: "inherit" }}>+91 62617 24448</a>
            </div>
            <div className="footer-contact-item" style={{ marginTop: "8px" }}>
              <span>🕐</span>
              <span>Mon–Sat, 10 AM – 6 PM</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            © 2025 Ninv Nishchay Foundation. All rights reserved.
          </div>
          <div className="footer-cin">
            CIN: <span>U88900MP2025NPL080689</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <a
            href="/admin-panel-nnf"
            style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─── WHATSAPP ──────────────────────────────────────────────────────────── */
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/916261724448?text=Hello%20Ninv%20Nishchay%20Foundation%2C%20I%27d%20like%20to%20know%20more%20about%20your%20work."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

/* ─── MAIN SITE LAYOUT ──────────────────────────────────────────────────── */
function MainSite() {
  const [events, setEvents] = useState<NNFEvent[]>(loadEvents);

  // Reload events from localStorage if Admin Panel updates them
  useEffect(() => {
    const onStorage = () => setEvents(loadEvents());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Static section reveal (About, Programs, etc.)
  useReveal([]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Events events={events} />
        <Donate />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

/* ─── APP WITH ROUTING ──────────────────────────────────────────────────── */
export default function App() {
  return (
    <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/admin-panel-nnf" component={AdminPanel} />
        <Route component={MainSite} />
      </Switch>
    </Router>
  );
}
