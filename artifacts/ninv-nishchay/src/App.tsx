import { useEffect, useRef, useState } from "react";

const EVENTS = [
  {
    id: 1,
    title: "Swachh Bharat Abhiyan — Community Cleanliness Drive",
    date: "2025-04-20",
    image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80",
    description: "Join us for a city-wide cleanliness campaign in Ujjain. Volunteers will clean public spaces, plant trees, and spread awareness about sanitation.",
    location: "Mahakal Temple Road, Ujjain",
  },
  {
    id: 2,
    title: "Health Camp — Free Medical Checkup",
    date: "2025-05-10",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
    description: "Free health checkups, blood tests, and medicine distribution for underprivileged families. Expert doctors will be available on site.",
    location: "Community Hall, Freeganj, Ujjain",
  },
  {
    id: 3,
    title: "Shiksha Utsav — Scholarship Distribution Ceremony",
    date: "2025-06-05",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    description: "Annual scholarship awards for meritorious students from economically weaker sections. Over 50 students to be felicitated.",
    location: "Vikram University Grounds, Ujjain",
  },
  {
    id: 4,
    title: "Mahila Shakti Workshop — Women's Skill Development",
    date: "2025-06-22",
    image: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f5?w=600&q=80",
    description: "A two-day workshop empowering women with skills in tailoring, digital literacy, and entrepreneurship to support self-reliance.",
    location: "Ninv Nishchay Centre, Ujjain",
  },
  {
    id: 5,
    title: "Vriksh Mitra — Tree Plantation Drive",
    date: "2025-07-14",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
    description: "Plantation of 500+ native trees across Ujjain district in collaboration with local schools and Gram Panchayats.",
    location: "Various locations, Ujjain District",
  },
  {
    id: 6,
    title: "Poshak Daan — Winter Clothes Distribution",
    date: "2025-12-10",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80",
    description: "Collection and distribution of warm clothes, blankets, and essentials to homeless and destitute families ahead of winter.",
    location: "Multiple locations, Ujjain",
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
    full: d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
  };
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

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
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={() => handleNav("#home")}>
            <div className="nav-logo-icon">🌱</div>
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

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
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
            A firm resolve for a brighter tomorrow. We work for the upliftment of marginalized communities
            in Madhya Pradesh through education, healthcare, and holistic community development.
          </p>
          <div className="hero-actions">
            <a
              href="#donate"
              className="btn-primary"
              onClick={(e) => { e.preventDefault(); document.querySelector("#donate")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              💛 Donate Now
            </a>
            <a
              href="#about"
              className="btn-secondary"
              onClick={(e) => { e.preventDefault(); document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Learn More →
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">2500+</span>
            <span className="hero-stat-label">Lives Impacted</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">12+</span>
            <span className="hero-stat-label">Programs Running</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">5</span>
            <span className="hero-stat-label">Districts Covered</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll">SCROLL</div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img-wrap reveal">
            <img
              className="about-img-main"
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
              alt="Ninv Nishchay Foundation volunteers"
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
              Ninv Nishchay Foundation (CIN: U88900MP2025NPL080689) is a not-for-profit organization
              registered under the Companies Act, 2013 in Madhya Pradesh. Founded in 2025 and headquartered
              in Ujjain — the city of faith — we are committed to fostering sustainable change through
              grassroots programs in health, education, environment, and women's empowerment.
            </p>
            <p className="about-body" style={{ marginTop: "-20px" }}>
              We believe that every individual, regardless of their social or economic background,
              deserves dignity, opportunity, and a fair chance at a fulfilling life. Our volunteers,
              donors, and partner organizations form a growing movement rooted in compassion and resolve.
            </p>

            <div className="mvv-grid">
              <div className="mvv-card">
                <div className="mvv-icon">🎯</div>
                <div className="mvv-title">Our Mission</div>
                <div className="mvv-body">
                  To empower marginalized communities through sustainable, people-centric programs that
                  create lasting change across Madhya Pradesh.
                </div>
              </div>
              <div className="mvv-card">
                <div className="mvv-icon">🔭</div>
                <div className="mvv-title">Our Vision</div>
                <div className="mvv-body">
                  A just and equitable society where every citizen has access to health, education,
                  and opportunity regardless of their circumstances.
                </div>
              </div>
              <div className="mvv-card">
                <div className="mvv-icon">❤️</div>
                <div className="mvv-title">Our Values</div>
                <div className="mvv-body">
                  Integrity, compassion, inclusivity, transparency, and a firm resolve to serve
                  without discrimination.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Programs() {
  const programs = [
    {
      title: "Healthcare & Wellness",
      icon: "🏥",
      desc: "Free medical camps, medicines, and health awareness drives for underprivileged families in rural and urban slums across Ujjain district.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
      tag: "Health",
    },
    {
      title: "Education & Scholarships",
      icon: "📚",
      desc: "Scholarships for meritorious students, digital literacy training, free coaching classes, and school supply distribution for children from EWS families.",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80",
      tag: "Education",
    },
    {
      title: "Community Development",
      icon: "🏘️",
      desc: "Skill development workshops, livelihood support, women's self-help groups, and infrastructure projects to uplift entire communities.",
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80",
      tag: "Community",
    },
    {
      title: "Environment & Green India",
      icon: "🌳",
      desc: "Plantation drives, cleanliness campaigns, waste management awareness, and river conservation activities across Madhya Pradesh.",
      image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&q=80",
      tag: "Environment",
    },
    {
      title: "Women Empowerment",
      icon: "👩‍💼",
      desc: "Vocational training, legal awareness camps, support for women entrepreneurs, and initiatives to combat gender-based violence.",
      image: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f5?w=600&q=80",
      tag: "Women",
    },
    {
      title: "Food & Nutrition Security",
      icon: "🍱",
      desc: "Community kitchens, nutrition programs for children and elderly, food distribution during festivals and natural calamities.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
      tag: "Nutrition",
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
            <div className="program-card reveal" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
              <img className="program-img" src={p.image} alt={p.title} loading="lazy" />
              <div className="program-body">
                <div className="program-icon">{p.icon}</div>
                <h3 className="program-title">{p.title}</h3>
                <p className="program-desc">{p.desc}</p>
                <span className="program-tag">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events() {
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

        <div className="events-grid">
          {EVENTS.map((ev, i) => {
            const dt = formatDate(ev.date);
            return (
              <div className="event-card reveal" key={ev.id} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="event-img-wrap">
                  <img className="event-img" src={ev.image} alt={ev.title} loading="lazy" />
                  <div className="event-date-badge">
                    <span className="event-date-day">{dt.day}</span>
                    <span className="event-date-month">{dt.month}</span>
                  </div>
                </div>
                <div className="event-body">
                  <h3 className="event-title">{ev.title}</h3>
                  <p className="event-desc">{ev.description}</p>
                  <div className="event-meta">
                    <span>📍</span> {ev.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Donate() {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate-inner">
          <div className="donate-content reveal">
            <span className="section-label">Fund Us</span>
            <h2 className="section-heading">Support Our Mission</h2>
            <p className="donate-message">
              Your generous contribution — no matter the size — helps us deliver healthcare, education,
              and hope to thousands of families across Madhya Pradesh. Every rupee goes directly to
              those who need it most.
            </p>
            <p className="donate-message" style={{ marginTop: "-12px" }}>
              Scan the QR code to donate instantly via UPI, or use the bank details below.
              Donations to Ninv Nishchay Foundation are eligible for tax benefits under applicable provisions.
            </p>

            <div className="bank-details">
              <h4>Bank Transfer Details</h4>
              <div className="bank-row">
                <span className="bank-label">Account Name</span>
                <span className="bank-value">Ninv Nishchay Foundation</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Account No.</span>
                <span className="bank-value">XXXX XXXX XXXX 0001</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">IFSC Code</span>
                <span className="bank-value">SBIN0XXXXXX</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Bank</span>
                <span className="bank-value">State Bank of India</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Branch</span>
                <span className="bank-value">Freeganj, Ujjain</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">UPI ID</span>
                <span className="bank-value">ninvnishchay@upi</span>
              </div>
            </div>
          </div>

          <div className="qr-panel reveal">
            <div className="qr-box">
              <img
                className="qr-code"
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ninvnishchay@upi%26pn=NinvNishchayFoundation%26cu=INR&color=556020&bgcolor=F5F7EC"
                alt="QR Code for UPI Donation"
              />
              <div className="qr-title">Ninv Nishchay Foundation</div>
              <div className="qr-sub">Scan to donate via any UPI app</div>
              <div className="upi-id">ninvnishchay@upi</div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", textAlign: "center", maxWidth: "280px" }}>
              PayTM · PhonePe · Google Pay · BHIM · any UPI app
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    formRef.current?.reset();
    setTimeout(() => setSubmitted(false), 5000);
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
                  Ninv Nishchay Foundation<br />
                  Freeganj, Ujjain<br />
                  Madhya Pradesh — 456010
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-item-title">Email Us</div>
                <div className="contact-item-body">
                  info@ninvnishchay.org<br />
                  donate@ninvnishchay.org
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <div className="contact-item-title">Call / WhatsApp</div>
                <div className="contact-item-body">
                  +91 XXXXX XXXXX<br />
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
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" type="text" placeholder="Rahul" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" type="text" placeholder="Sharma" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="rahul@example.com" required />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="+91 9876543210" />
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <select className="form-select form-input" required>
                  <option value="">Select a subject</option>
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
                  placeholder="Tell us how you'd like to get involved or ask your question..."
                  required
                />
              </div>

              <button type="submit" className="form-submit">
                Send Message ✉️
              </button>

              {submitted && (
                <div className="form-success" style={{ display: "block" }}>
                  Thank you! Your message has been sent. We'll get back to you within 2 business days.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">Ninv Nishchay Foundation</div>
            <div className="footer-brand-tag">Dridh Sankalp, Ujjwal Bhavishya</div>
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
                  <a href={id} onClick={(e) => { e.preventDefault(); scroll(id); }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Our Programs</div>
            <ul className="footer-links">
              {["Healthcare & Wellness","Education & Scholarships","Community Development","Women Empowerment","Environment","Food Security"].map((p) => (
                <li key={p}><a href="#programs" onClick={(e) => { e.preventDefault(); scroll("#programs"); }}>{p}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Contact</div>
            <div className="footer-contact-item">
              <span>📍</span>
              <span>Freeganj, Ujjain, Madhya Pradesh — 456010</span>
            </div>
            <div className="footer-contact-item">
              <span>✉️</span>
              <span>info@ninvnishchay.org</span>
            </div>
            <div className="footer-contact-item">
              <span>📞</span>
              <span>+91 XXXXX XXXXX</span>
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
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919999999999?text=Hello%20Ninv%20Nishchay%20Foundation%2C%20I%27d%20like%20to%20know%20more%20about%20your%20work."
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

export default function App() {
  useReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Events />
        <Donate />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
