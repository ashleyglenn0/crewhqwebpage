import { useMemo, useState, useEffect} from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { theme } from "./theme";
import logoMint from "./assets/newlogo.PNG";
import ashleyPhoto from "./assets/ashley.jpeg";
import mikalPhoto from "./assets/mikal.JPEG";
import emailjs from "@emailjs/browser";

const CONTAINER = 1200;
const RECRUITING_APP_URL = "https://motionmethodrecruitingapp.netlify.app/";

// ── Tiny helpers ──────────────────────────────────────────────

const t = (style) => ({ transition: style });

const Section = ({ id, children, alt = false, style = {} }) => (
  <section
    id={id}
    style={{
      width: "100%",
      padding: "100px 32px",
      background: alt ? theme.surface : theme.background,
      ...style,
    }}
  >
    <div style={{ maxWidth: CONTAINER, margin: "0 auto" }}>{children}</div>
  </section>
);

const SectionHeader = ({ eyebrow, title, subtitle, center = false }) => (
  <div style={{ marginBottom: 48, textAlign: center ? "center" : "left", maxWidth: center ? 640 : 720, margin: center ? "0 auto 48px" : "0 0 48px" }}>
    {eyebrow && (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(28,74,54,0.07)", border: `1px solid ${theme.border}`,
        borderRadius: 100, padding: "5px 14px", marginBottom: 16,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
        textTransform: "uppercase", color: theme.primary,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.secondary, display: "inline-block", flexShrink: 0 }} />
        {eyebrow}
      </div>
    )}
    <h2 style={{
      margin: "0 0 14px", color: theme.primary,
      fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
      letterSpacing: "-0.03em", lineHeight: 1.1,
      fontFamily: "'Playfair Display', serif",
    }}>{title}</h2>
    {subtitle && (
      <p style={{ margin: 0, fontSize: 17, color: theme.textMuted, lineHeight: 1.7, fontWeight: 300 }}>
        {subtitle}
      </p>
    )}
  </div>
);

const Card = ({ children, style = {}, hover = true }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: theme.surface,
        borderRadius: 14,
        padding: "28px 30px",
        border: `1px solid ${hovered ? theme.borderStrong : theme.border}`,
        boxShadow: hovered ? "0 20px 60px rgba(17,24,39,0.1)" : "0 2px 16px rgba(17,24,39,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.22s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Button = ({ variant = "primary", children, style = {}, ...props }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isPrimary = variant === "primary";
  const isGold = variant === "gold";

  const bg = isPrimary ? theme.primary : isGold ? theme.accent : "transparent";
  const color = isPrimary ? theme.onPrimary : isGold ? theme.primaryDark : theme.primary;
  const border = isPrimary || isGold ? "none" : `1.5px solid ${theme.borderStrong}`;

  return (
    <button
      {...props}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        padding: "13px 22px", borderRadius: 10, border,
        background: hovered && isPrimary ? theme.primaryDark : hovered && isGold ? "#d4b050" : bg,
        color, fontWeight: 600, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        letterSpacing: "0.02em",
        boxShadow: isPrimary ? (hovered ? "0 16px 36px rgba(28,74,54,0.25)" : "0 8px 24px rgba(28,74,54,0.15)") : "none",
        transform: pressed ? "scale(0.98)" : hovered && !pressed ? "translateY(-1px)" : "none",
        transition: "all 0.18s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const Pill = ({ children, color }) => (
  <span style={{
    background: color ? `${color}18` : "rgba(28,74,54,0.07)",
    color: color || theme.primary,
    border: `1px solid ${color ? `${color}30` : theme.border}`,
    padding: "5px 13px", borderRadius: 999,
    fontWeight: 600, fontSize: 11,
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif",
  }}>{children}</span>
);

const StatBlock = ({ number, label }) => (
  <div style={{ textAlign: "center", padding: "0 16px" }}>
    <div style={{
      fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700,
      color: theme.primary, lineHeight: 1,
      fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em",
    }}>{number}</div>
    <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
  </div>
);

const Divider = () => (
  <div style={{ width: 1, height: 48, background: theme.border, flexShrink: 0 }} />
);

// ── Lead Magnet Popup ─────────────────────────────────────────
const LeadMagnetPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_CHECKLIST,
        { first_name: name.trim(), to_email: email.trim() }
      );
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${focused === field ? theme.primary : theme.border}`,
    borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    background: theme.offWhite, color: theme.text, outline: "none",
    boxShadow: focused === field ? `0 0 0 3px rgba(28,74,54,0.09)` : "none",
    transition: "all 0.18s ease",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(21,41,32,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.25s ease",
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: theme.surface, borderRadius: 18, padding: "40px 36px",
        maxWidth: 460, width: "100%", position: "relative",
        boxShadow: "0 32px 80px rgba(17,24,39,0.18)",
        animation: "slideUp 0.3s ease",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", cursor: "pointer",
          color: theme.textMuted, fontSize: 20, lineHeight: 1, padding: 4,
        }}>✕</button>

        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: "rgba(28,74,54,0.08)", border: `1px solid ${theme.border}`,
          display: "grid", placeItems: "center", marginBottom: 20,
          fontSize: 20,
        }}>📋</div>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
            <h3 style={{ margin: "0 0 10px", color: theme.primary, fontFamily: "'Playfair Display', serif", fontSize: 22 }}>
              On its way.
            </h3>
            <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>
              Check your inbox for the Operational Readiness Checklist.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{
              margin: "0 0 8px", color: theme.primary,
              fontFamily: "'Playfair Display', serif",
              fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em",
            }}>
              Get the free checklist.
            </h3>
            <p style={{ margin: "0 0 24px", color: theme.textMuted, fontSize: 14, lineHeight: 1.65 }}>
              The <strong style={{ color: theme.text }}>Operational Readiness Checklist</strong> — a practical tool for evaluating whether your event infrastructure is ready to run under pressure. No fluff.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              <input
                type="text" placeholder="First name" value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                style={inputStyle("name")} required
              />
              <input
                type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                style={inputStyle("email")} required
              />
              <Button type="submit" style={{ width: "100%", marginTop: 4 }}>
                {status === "loading" ? "Sending..." : "Send me the checklist"}
              </Button>
              {status === "error" && (
                <p style={{ margin: 0, fontSize: 12, color: "#C0392B", textAlign: "center" }}>
                  Something went wrong — try again or email us directly.
                </p>
              )}
            </form>
            <p style={{ margin: "14px 0 0", fontSize: 11, color: theme.textMuted, textAlign: "center", lineHeight: 1.5 }}>
              One email. No list. No follow-up unless you reach out.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ── Founder Card ──────────────────────────────────────────────
const FounderCard = ({ name, title, bio, photo, imgPosition = "50% 25%" }) => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 12, overflow: "hidden",
        border: `1px solid ${theme.border}`, flexShrink: 0,
      }}>
        <img src={photo} alt={name} style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: imgPosition, display: "block",
        }} />
      </div>
      <div>
        <div style={{ fontWeight: 700, color: theme.primary, fontSize: 17, fontFamily: "'Playfair Display', serif" }}>{name}</div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 3, fontWeight: 400 }}>{title}</div>
      </div>
    </div>
    <p style={{ margin: 0, lineHeight: 1.7, color: theme.text, fontSize: 14, opacity: 0.9 }}>{bio}</p>
  </Card>
);

// ── Form input style ──────────────────────────────────────────
const useInputStyle = () => {
  const [focused, setFocused] = useState(null);
  const inputStyle = (field) => ({
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${focused === field ? theme.primary : theme.border}`,
    borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    background: theme.offWhite, color: theme.text, outline: "none",
    boxShadow: focused === field ? `0 0 0 3px rgba(28,74,54,0.09)` : "none",
    transition: "all 0.18s ease", boxSizing: "border-box",
  });
  return { inputStyle, setFocused };
};

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [sales, setSales] = useState({ contactName: "", email: "", orgName: "", role: "", eventType: "", message: "" });
  const [salesStatus, setSalesStatus] = useState(null);

  const { inputStyle: salesInputStyle, setFocused: setSalesFocused } = useInputStyle();

  // Show popup on scroll after 40%
  useEffect(() => {
    const handleScroll = () => {
      if (popupShown) return;
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.4) {
        setShowPopup(true);
        setPopupShown(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [popupShown]);

  const nav = useMemo(() => [
    { label: "What We Do", href: "#fit" },
    { label: "Our Work", href: "#work" },
    { label: "How We Engage", href: "#engagement" },
    { label: "Founders", href: "#founders" },
    { label: "Join Us", href: "#talent" },
    { label: "Contact", href: "#contact" },
  ], []);

  const submitSales = async (e) => {
    e.preventDefault();
    setSalesStatus("loading");
    try {
      await addDoc(collection(db, "sales_leads"), {
        ...sales, source: "website", createdAt: serverTimestamp(),
      });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_SALES,
        { first_name: sales.contactName, to_email: sales.email, org_name: sales.orgName, role: sales.role, event_type: sales.eventType, message: sales.message }
      );
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_SALES_NOTIFY,
        { full_name: sales.contactName, to_email: sales.email, org_name: sales.orgName, role: sales.role, event_type: sales.eventType, message: sales.message }
      );
      setSalesStatus("success");
      setSales({ contactName: "", email: "", orgName: "", role: "", eventType: "", message: "" });
    } catch (err) {
      console.error(err);
      setSalesStatus("error");
    }
  };

  // EmailJS init
  useEffect(() => {
    emailjs.init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY });
  }, []);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'system-ui', sans-serif",
      background: theme.background, minHeight: "100vh", color: theme.text,
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.6s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.2s ease both; }

        input::placeholder, textarea::placeholder { color: rgba(31,42,36,0.3); }
        textarea { resize: vertical; }
        a { transition: opacity 0.16s ease; }
        a:hover { opacity: 0.8; }

        .nav-link:hover { opacity: 1 !important; color: ${theme.primary} !important; }

        @media (max-width: 768px) {
          section { padding: 72px 20px !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .four-col { grid-template-columns: 1fr 1fr !important; }
          .stats-row { flex-wrap: wrap !important; gap: 24px !important; }
          .stats-row > div { flex: 1 1 40% !important; }
          .hide-mobile { display: none !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, width: "100%",
        background: "rgba(247,244,234,0.94)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: "0 4px 20px rgba(17,24,39,0.05)",
      }}>
        <div style={{
          maxWidth: CONTAINER, margin: "0 auto",
          padding: "14px 24px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, overflow: "hidden",
              border: `1px solid ${theme.border}`, flexShrink: 0,
            }}>
              <img src={logoMint} alt="Motion & Method" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontWeight: 700, color: theme.primary, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Motion & Method
            </span>
          </a>

          <div className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {nav.map(n => (
              <a key={n.href} href={n.href} className="nav-link" style={{
                color: theme.textMuted, textDecoration: "none",
                fontSize: 13, fontWeight: 500, letterSpacing: "0.04em",
              }}>{n.label}</a>
            ))}
            <Button variant="gold" style={{ padding: "9px 18px", fontSize: 13 }}
              onClick={() => setShowPopup(true)}>
              Free Checklist
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        width: "100%", padding: "120px 32px 90px",
        background: `linear-gradient(160deg, ${theme.background} 60%, rgba(88,176,108,0.07) 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Watermark */}
        <div style={{
          position: "absolute", right: -60, top: "50%",
          transform: "translateY(-50%)", width: 480, height: 480,
          opacity: 0.04, pointerEvents: "none", filter: "grayscale(1)",
        }}>
          <img src={logoMint} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <div className="hero-grid" style={{
          maxWidth: CONTAINER, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1.3fr 0.7fr",
          gap: 48, alignItems: "center",
        }}>
          <div className="fade-up">
            <Pill>People Infrastructure · Operational Systems · Execution</Pill>

            <h1 style={{
              margin: "20px 0 0", color: theme.primaryDark,
              fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.02,
              letterSpacing: "-0.03em", fontWeight: 600,
              fontFamily: "'Playfair Display', serif",
            }}>
              Events don't fail<br />
              <em style={{ color: theme.primary, fontStyle: "italic" }}>from bad ideas.</em>
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.7, marginTop: 20,
              maxWidth: 580, color: theme.textMuted, fontWeight: 300,
            }}>
              They fail from unclear roles, unsupported teams, and operations built on improvisation. Motion & Method builds the infrastructure that keeps execution steady under pressure.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
              <a href="#contact" style={{ textDecoration: "none" }}>
                <Button>Book a Discovery Call</Button>
              </a>
              <a href="#engagement" style={{ textDecoration: "none" }}>
                <Button variant="secondary">See How We Work</Button>
              </a>
              <button
                onClick={() => setShowPopup(true)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: theme.primary, fontSize: 14, fontWeight: 600,
                  textDecoration: "underline", textDecorationColor: theme.accent,
                  textUnderlineOffset: 3, fontFamily: "'DM Sans', sans-serif",
                  padding: 0,
                }}
              >
                Get free checklist →
              </button>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <a href="mailto:sales@motionmethodgroup.com" style={{ color: theme.textMuted, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                sales@motionmethodgroup.com
              </a>
              <a href="mailto:recruiting@motionmethodgroup.com" style={{ color: theme.textMuted, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                recruiting@motionmethodgroup.com
              </a>
            </div>
          </div>

          <div className="fade-up-2">
            <Card style={{ background: theme.primary, borderColor: "transparent" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.accent, marginBottom: 14 }}>
                Operating Philosophy
              </div>
              <p style={{ margin: "0 0 20px", color: "rgba(252,253,251,0.88)", lineHeight: 1.7, fontSize: 15 }}>
                Well-supported people create successful operations. We design systems that promote clarity, accountability, and respect — so teams can execute with confidence.
              </p>
              <div style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)", fontSize: 13, color: theme.accent, fontWeight: 600, lineHeight: 1.8 }}>
                People First<br />Clarity Over Chaos<br />Respect the Day-Of Reality
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{
        width: "100%", background: theme.primary, padding: "48px 32px",
      }}>
        <div style={{
          maxWidth: CONTAINER, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 0,
        }} className="stats-row">
          {[
            { number: "8,000+", label: "Peak event attendance" },
            null,
            { number: "4", label: "Combined years at RenderATL" },
            null,
            { number: "400+", label: "Volunteers coordinated" },
            null,
            { number: "3", label: "Major productions" },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="hide-mobile" style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)", margin: "0 40px", flexShrink: 0 }} />
            ) : (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
                  color: theme.accent, lineHeight: 1,
                  fontFamily: "'Playfair Display', serif",
                }}>{item.number}</div>
                <div style={{ fontSize: 12, color: "rgba(252,253,251,0.65)", marginTop: 6, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <Section id="who" alt>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <SectionHeader
            eyebrow="Who We Are"
            title="Built from the floor up."
            center
          />
          <p style={{ fontSize: 17, lineHeight: 1.8, color: theme.textMuted, fontWeight: 300, margin: "0 0 24px" }}>
            Motion & Method was founded by two people who started as volunteers and spent years running the floor before they had a company name. We didn't build a methodology in theory — we built it under pressure, at scale, in front of thousands of people.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: theme.textMuted, fontWeight: 300, margin: 0 }}>
            We exist because most events are staffed but not <em>structured</em>. People show up without clarity, teams run without support, and execution depends on whoever's willing to improvise. We fix that — at the system level, not the surface level.
          </p>
        </div>
      </Section>

      {/* ── WHO WE WORK WITH ── */}
      <Section id="audience">
        <SectionHeader
          eyebrow="Who We Work With"
          title="You'll recognize yourself here."
          subtitle="We work with organizations running complex, high-coordination operations where execution has to work — not just happen."
        />
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: "🎪", label: "Conference & Festival Producers", desc: "Multi-day, high-attendance events where volunteer coordination, zone management, and escalation paths are mission-critical." },
            { icon: "💻", label: "Tech Event Organizers", desc: "RenderATL, Atlanta Tech Week — communities that run complex programming across large footprints and diverse audiences." },
            { icon: "🏛️", label: "Nonprofits & Civic Organizations", desc: "Institutions running large public activations where staff capacity is limited and the stakes for attendee experience are high." },
            { icon: "🏢", label: "Corporate Event Teams", desc: "Internal teams running activations, summits, or brand events who need operational structure without building it from scratch." },
            { icon: "🎓", label: "Universities & Institutions", desc: "Campus and institutional events where leadership development, volunteer management, and operational clarity compound over time." },
            { icon: "🤝", label: "Strategic Partners", desc: "Organizations ready to co-execute at scale — bringing Motion & Method into the operating layer of their events under a shared model." },
          ].map(({ icon, label, desc }) => (
            <Card key={label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div style={{ fontWeight: 700, color: theme.primary, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>{label}</div>
              <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.65 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── WHERE WE FIT ── */}
      <Section id="fit" alt>
        <SectionHeader
          eyebrow="What We Do"
          title="The operating layer most events are missing."
          subtitle="We build the structure that keeps execution steady — so leadership has clarity, teams have direction, and the day-of runs the way it was designed to."
        />
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              num: "01",
              title: "Operational Infrastructure",
              desc: "Documented roles, workflows, escalation paths, and staffing logic. Your team stops improvising and starts executing.",
            },
            {
              num: "02",
              title: "Leadership Enablement",
              desc: "Team leads who know their lanes, coordinators who can make decisions, and a culture that performs under pressure.",
            },
            {
              num: "03",
              title: "Execution Reinforcement",
              desc: "On-site support and post-event refinement that makes the system stronger every time you run it.",
            },
          ].map(({ num, title, desc }) => (
            <Card key={num}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, letterSpacing: "0.1em", marginBottom: 12 }}>{num}</div>
              <h3 style={{ margin: "0 0 10px", color: theme.primary, fontSize: 17, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.7 }}>{desc}</p>
            </Card>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#contact" style={{ textDecoration: "none" }}><Button>Book Discovery Call</Button></a>
          <a href="#engagement" style={{ textDecoration: "none" }}><Button variant="secondary">See the Engagement Model</Button></a>
        </div>
      </Section>

      {/* ── PROVEN WORK ── */}
      <Section id="work">
        <SectionHeader
          eyebrow="Proven Work"
          title="The methods were tested before the company had a name."
          subtitle="Motion & Method's operating frameworks were developed and battle-tested across these productions. The system works because we've already run it — at scale, under pressure, for real audiences."
        />

        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
          {[
            {
              name: "RenderATL",
              tag: "4 combined years · Paid engagement",
              stats: "8,000+ attendees at peak",
              desc: "Atlanta's premier tech conference. Driver operated for 3 years, Ash for 1. The system that became Motion & Method's foundation was stress-tested here — volunteer coordination, zone management, and Axis deployed at full scale.",
              color: theme.secondary,
            },
            {
              name: "Atlanta Tech Week",
              tag: "1 year · Paid engagement",
              stats: "Multi-event format",
              desc: "Multi-day, city-wide tech activation. Motion & Method's multi-event coordination model and leadership frameworks were proven across simultaneous productions.",
              color: theme.accent,
            },
            {
              name: "GovTechCon",
              tag: "2 years · Axis mobile proven here",
              stats: "60 attendees Year 1",
              desc: "Government technology conference run primarily using the Axis mobile platform. First field validation of Axis in a live, high-coordination environment.",
              color: theme.primary,
            },
          ].map(({ name, tag, stats, desc, color }) => (
            <Card key={name} style={{ borderTop: `3px solid ${color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h3 style={{ margin: 0, color: theme.primary, fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{name}</h3>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{tag}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, marginBottom: 12 }}>{stats}</div>
              <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.65 }}>{desc}</p>
            </Card>
          ))}
        </div>

        {/* Current engagements */}
        <div style={{
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 12, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: theme.secondary, flexShrink: 0,
            boxShadow: `0 0 0 3px rgba(88,176,108,0.2)`,
          }} />
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.secondary }}>Now Operating</span>
            <div style={{ fontSize: 14, color: theme.text, fontWeight: 600, marginTop: 2 }}>
              The Queens Chalice · 849 Agency
            </div>
          </div>
        </div>
      </Section>

      {/* ── OPERATING PILLARS ── */}
      <Section id="pillars" alt>
        <SectionHeader
          eyebrow="What We Offer"
          title="Four capabilities. One operating model."
          subtitle="Every engagement draws from these capabilities in combination — not as standalone services."
        />
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              pill: "P1", pillColor: theme.secondary,
              title: "Operational Execution",
              desc: "Structured execution reinforcement in live, high-coordination environments. We ensure the system performs under real-world pressure — not just in planning documents.",
            },
            {
              pill: "P2", pillColor: theme.accent,
              title: "Leadership & Culture Enablement",
              desc: "Leadership calibration, expectation architecture, and team lead preparation. We align culture, decision authority, and coordination within the operating system.",
            },
            {
              pill: "P3", pillColor: theme.primary,
              title: "Strategic Design Support",
              desc: "Engaged when deeper structural alignment is required. Advisory that integrates with — but doesn't replace — the broader operating model.",
            },
            {
              pill: "P4", pillColor: theme.textMuted,
              title: "Infrastructure Design",
              desc: "Operating systems, workflows, escalation paths, and structural frameworks. We convert strategy into executable infrastructure your team can actually run.",
            },
          ].map(({ pill, pillColor, title, desc }) => (
            <Card key={pill} style={{ display: "flex", gap: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `${pillColor}18`, border: `1px solid ${pillColor}30`,
                display: "grid", placeItems: "center",
                fontSize: 11, fontWeight: 700, color: pillColor, letterSpacing: "0.06em",
              }}>{pill}</div>
              <div>
                <h3 style={{ margin: "0 0 8px", color: theme.primary, fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.65 }}>{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── ENGAGEMENT ARCHITECTURE ── */}
      <Section id="engagement">
        <SectionHeader
          eyebrow="How We Engage"
          title="A sequence, not a menu."
          subtitle="Our engagements follow a defined arc. Each phase builds on the last — so execution is supported from strategy through strike."
        />
        <div style={{ display: "grid", gap: 12, maxWidth: 800 }}>
          {[
            { n: "1", title: "Discovery & Alignment", desc: "Executive alignment and structured intake to define objectives, surface constraints, assess risk exposure, and establish strategic clarity before any design begins." },
            { n: "2", title: "System Architecture", desc: "Development of the operating structure — role design, workflow modeling, escalation paths, and coordination frameworks that convert strategy into executable infrastructure." },
            { n: "3", title: "Leadership Enablement", desc: "Leadership calibration, expectation architecture, and culture reinforcement that ensures decision authority, coordination rhythms, and accountability align with the operating model." },
            { n: "4", title: "Execution Reinforcement & Iteration", desc: "Live-environment reinforcement and post-engagement refinement to validate performance under pressure and strengthen long-term operational stability." },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{
              display: "flex", gap: 20, alignItems: "flex-start",
              padding: "20px 24px", background: theme.surface,
              border: `1px solid ${theme.border}`, borderRadius: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: theme.primary, display: "grid", placeItems: "center",
                fontSize: 13, fontWeight: 700, color: theme.onPrimary,
                fontFamily: "'DM Sans', sans-serif",
              }}>{n}</div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: theme.primary, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── GUIDING PRINCIPLES ── */}
      <Section alt>
        <SectionHeader
          eyebrow="Guiding Principles"
          title="How we think about the work."
          center
        />
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            {
              title: "People First",
              desc: "Systems are designed around people. Performance, dignity, and respect are not trade-offs — they are structural requirements.",
              icon: "◆",
            },
            {
              title: "Clarity Over Chaos",
              desc: "Defined roles, decision authority, and expectations reduce risk and create sustainable execution. Ambiguity is the enemy.",
              icon: "◆",
            },
            {
              title: "Respect the Day-Of Reality",
              desc: "Operational design must account for real-world variables. Judgment and adaptability matter more than rigid scripts.",
              icon: "◆",
            },
          ].map(({ title, desc, icon }) => (
            <Card key={title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, color: theme.accent, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ margin: "0 0 10px", color: theme.primary, fontSize: 17, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: theme.textMuted, lineHeight: 1.7 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── VIDEO / PROBLEM SECTION ── */}
      <Section id="problem">
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <SectionHeader
              eyebrow="The Problem We Solve"
              title="Most events are staffed. Very few are structured."
            />
            <p style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.8, marginBottom: 20, fontWeight: 300 }}>
              When something goes wrong on event day, it's rarely a staffing shortage. It's a clarity shortage. No one knows who owns the decision. No one knows who to escalate to. Teams are present but not prepared.
            </p>
            <p style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.8, marginBottom: 28, fontWeight: 300 }}>
              Motion & Method builds the operating layer that solves this — before the day-of, not during it.
            </p>
            <a href="#contact" style={{ textDecoration: "none" }}>
              <Button>Talk to Us About Your Event</Button>
            </a>
          </div>

          {/* Video placeholder */}
          <div style={{
            background: theme.primary, borderRadius: 16,
            aspectRatio: "16/9", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 16, position: "relative", overflow: "hidden",
            border: `1px solid ${theme.borderStrong}`,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at 30% 50%, rgba(88,176,108,0.15), transparent 60%)",
            }} />
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "rgba(235,199,100,0.15)", border: `2px solid ${theme.accent}`,
              display: "grid", placeItems: "center", position: "relative",
            }}>
              <div style={{
                width: 0, height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: `18px solid ${theme.accent}`,
                marginLeft: 4,
              }} />
            </div>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div style={{ color: "rgba(252,253,251,0.9)", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                Video coming soon
              </div>
              <div style={{ color: "rgba(252,253,251,0.45)", fontSize: 12 }}>
                The problem. The system. The value.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOUNDERS ── */}
      <Section id="founders" alt>
        <SectionHeader eyebrow="The Founders" title="Who's behind the system." />
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <FounderCard
            name="Ashley Glenn"
            photo={ashleyPhoto}
            title="Co-Founder · People Infrastructure & Operations"
            bio="Ashley builds people infrastructure for high-coordination operations, architecting the systems, expectations, and leadership rhythms that stabilize execution at scale. Drawing from experience across technology, live operations, and organizational design, she develops scalable operating frameworks that align leadership intent with day-of performance."
            imgPosition="30% 25%"
          />
          <FounderCard
            name="Mikal Driver"
            photo={mikalPhoto}
            title="Co-Founder · People Infrastructure Strategist"
            bio="Mikal designs leadership-aligned operating systems informed by over a decade of experience in education and institutional development. He builds leadership enablement frameworks, decision-making structures, and partnership models that translate institutional strategy into measurable, sustainable execution."
            imgPosition="70% 25%"
          />
        </div>
      </Section>

      {/* ── TALENT NETWORK ── */}
      <Section id="talent">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="two-col">
          <div>
            <SectionHeader
              eyebrow="Talent Network"
              title="Join the operation."
            />
            <p style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.8, marginBottom: 12, fontWeight: 300 }}>
              We build our volunteer and contractor pipeline from people who want to be part of something that actually runs well. Opportunities range from unpaid volunteer floor support to paid contractor engagements.
            </p>
            <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, marginBottom: 28, fontWeight: 300 }}>
              Placement is based on event needs — submitting doesn't guarantee a specific role or paid position. We'll always be upfront before you commit to anything.
            </p>
            <a href={RECRUITING_APP_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Button>Apply to Join the Network →</Button>
            </a>
          </div>
          <Card style={{ background: theme.primary, borderColor: "transparent" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.accent, marginBottom: 16 }}>
              The Pathway
            </div>
            {[
              { stage: "Volunteer", desc: "Zone-level floor support. Own your assignment, hold the standard." },
              { stage: "Team Lead", desc: "Lead a zone. Brief your volunteers. Report up the chain." },
              { stage: "Contractor / IC", desc: "Paid engagement. Signed IC Agreement. Rate established." },
            ].map(({ stage, desc }, i) => (
              <div key={stage} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                paddingBottom: i < 2 ? 14 : 0,
                marginBottom: i < 2 ? 14 : 0,
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(235,199,100,0.15)", border: `1px solid ${theme.accent}`,
                  display: "grid", placeItems: "center",
                  fontSize: 11, fontWeight: 700, color: theme.accent,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, color: theme.accent, fontSize: 14, marginBottom: 3 }}>{stage}</div>
                  <div style={{ fontSize: 13, color: "rgba(252,253,251,0.65)", lineHeight: 1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact" alt>
        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 48, alignItems: "start" }} className="two-col">
          <div>
            <SectionHeader eyebrow="Contact" title="Let's talk about your operation." />

            <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
              <a href="tel:+16783295909" style={{ textDecoration: "none" }}>
                <Card style={{ padding: "16px 20px" }} hover={false}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Phone</div>
                  <div style={{ fontWeight: 600, color: theme.primary, fontSize: 15 }}>(678) 329-5909</div>
                </Card>
              </a>
              <a href="mailto:sales@motionmethodgroup.com" style={{ textDecoration: "none" }}>
                <Card style={{ padding: "16px 20px" }} hover={false}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Business</div>
                  <div style={{ fontWeight: 600, color: theme.primary, fontSize: 15 }}>sales@motionmethodgroup.com</div>
                </Card>
              </a>
              <a href="mailto:recruiting@motionmethodgroup.com" style={{ textDecoration: "none" }}>
                <Card style={{ padding: "16px 20px" }} hover={false}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Recruiting</div>
                  <div style={{ fontWeight: 600, color: theme.primary, fontSize: 15 }}>recruiting@motionmethodgroup.com</div>
                </Card>
              </a>
            </div>

            <a href="https://calendly.com/ashley-motionmethodgroup/30min" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Button variant="secondary" style={{ width: "100%" }}>Book on Calendly →</Button>
            </a>
            <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 10, lineHeight: 1.5 }}>
              Reserved for organizations seeking operational and infrastructure support — not for volunteer or contractor inquiries.
            </p>
          </div>

          <Card>
            <h3 style={{ margin: "0 0 6px", color: theme.primary, fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Send a message
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: theme.textMuted }}>We respond within 1–2 business days.</p>

            <form onSubmit={submitSales} style={{ display: "grid", gap: 12 }}>
              {[
                { key: "contactName", placeholder: "Full name", type: "text" },
                { key: "email", placeholder: "Email address", type: "email" },
                { key: "orgName", placeholder: "Company / Organization", type: "text" },
                { key: "role", placeholder: "Your role", type: "text" },
                { key: "eventType", placeholder: "Event type (optional)", type: "text" },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key} type={type} placeholder={placeholder}
                  value={sales[key]}
                  onChange={(e) => setSales({ ...sales, [key]: e.target.value })}
                  onFocus={() => setSalesFocused(key)}
                  onBlur={() => setSalesFocused(null)}
                  style={salesInputStyle(key)}
                />
              ))}
              <textarea
                placeholder="Tell us what you're building and what you need help with"
                rows={4} value={sales.message}
                onChange={(e) => setSales({ ...sales, message: e.target.value })}
                onFocus={() => setSalesFocused("message")}
                onBlur={() => setSalesFocused(null)}
                style={{ ...salesInputStyle("message"), minHeight: 100 }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                <Button type="submit" style={{ flex: 1 }}>
                  {salesStatus === "loading" ? "Sending..." : "Send Message"}
                </Button>
                {salesStatus === "success" && (
                  <span style={{ fontSize: 13, color: theme.primary, fontWeight: 600 }}>✓ Received — we'll reply soon.</span>
                )}
                {salesStatus === "error" && (
                  <span style={{ fontSize: 13, color: "#C0392B", fontWeight: 600 }}>Something went wrong. Try again.</span>
                )}
              </div>
            </form>
          </Card>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "36px 24px 60px",
        borderTop: `1px solid ${theme.border}`,
        background: theme.background,
      }}>
        <div style={{
          maxWidth: CONTAINER, margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <div style={{ fontWeight: 700, color: theme.primary, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Motion & Method
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted }}>Atlanta, GA · motionmethodgroup.com</div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="mailto:sales@motionmethodgroup.com" style={{ color: theme.textMuted, fontSize: 13, textDecoration: "none" }}>sales@motionmethodgroup.com</a>
            <a href="mailto:recruiting@motionmethodgroup.com" style={{ color: theme.textMuted, fontSize: 13, textDecoration: "none" }}>recruiting@motionmethodgroup.com</a>
          </div>
        </div>
      </footer>

      {/* ── LEAD MAGNET POPUP ── */}
      {showPopup && <LeadMagnetPopup onClose={() => setShowPopup(false)} />}

    </div>
  );
}