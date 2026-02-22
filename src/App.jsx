import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { theme } from "./theme";
import logoMint from "./assets/logo.jpg";
import founderPhoto from "./assets/mikal-ashley.jpeg";

const CONTAINER = 1240;

const Section = ({ id, title, children, alt = false }) => (
  <section
    id={id}
    style={{
      width: "100%",
      padding: "120px 32px",
      background: alt ? theme.surface : theme.background,
    }}
  >
    <div style={{ maxWidth: CONTAINER, margin: "0 auto" }}>
      <h2
        style={{
          margin: "0 0 28px",
          color: theme.primary,
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: -0.4,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  </section>
);

const Card = ({ children }) => (
  <div
    style={{
      background: theme.surface,
      borderRadius: 12,
      padding: 26,
      boxShadow: "0 18px 60px rgba(0,0,0,0.10)",
      border: "1px solid rgba(10,59,72,0.10)",
      transition: "all 200ms ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 24px 70px rgba(0,0,0,0.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 18px 60px rgba(0,0,0,0.10)";
    }}
  >
    {children}
  </div>
);

const Button = ({ variant = "primary", children, ...props }) => {
  const isPrimary = variant === "primary";
  return (
    <button
      {...props}
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        border: isPrimary ? "none" : `2px solid ${theme.primary}`,
        background: isPrimary ? theme.primary : theme.surface,
        color: isPrimary ? theme.onPrimary : theme.primary,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all 160ms ease",
        boxShadow: isPrimary ? "0 12px 28px rgba(10,59,72,0.18)" : "none",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 18px 36px rgba(10,59,72,0.22)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isPrimary
          ? "0 12px 28px rgba(10,59,72,0.18)"
          : "none";
      }}
    >
      {children}
    </button>
  );
};

const Pill = ({ children }) => (
  <span
    style={{
      background: "rgba(10,59,72,0.08)",
      color: theme.primary,
      padding: "6px 14px",
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 1.1,
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

export default function App() {
  const [sales, setSales] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    eventType: "",
    message: "",
  });

  const [talent, setTalent] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    availability: "",
    interests: "",
    experience: "",
  });

  const [salesStatus, setSalesStatus] = useState(null);
  const [talentStatus, setTalentStatus] = useState(null);

  const nav = useMemo(
    () => [
      { label: "About", href: "#about" },
      { label: "Capabilities", href: "#services" },
      { label: "Engagement Model", href: "#how" },
      { label: "Operating Doctrine", href: "#principles" },
      { label: "Talent Network", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
    [],
  );

  const submitSales = async (e) => {
    e.preventDefault();
    setSalesStatus("loading");
    try {
      await addDoc(collection(db, "sales_leads"), {
        ...sales,
        source: "website",
        createdAt: serverTimestamp(),
      });
      setSalesStatus("success");
      setSales({
        name: "",
        email: "",
        company: "",
        role: "",
        eventType: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setSalesStatus("error");
    }
  };

  const submitTalent = async (e) => {
    e.preventDefault();
    setTalentStatus("loading");
    try {
      await addDoc(collection(db, "talent_pool"), {
        ...talent,
        source: "website",
        createdAt: serverTimestamp(),
      });
      setTalentStatus("success");
      setTalent({
        name: "",
        email: "",
        phone: "",
        city: "",
        availability: "",
        interests: "",
        experience: "",
      });
    } catch (err) {
      console.error(err);
      setTalentStatus("error");
    }
  };

  return (
    <div
      style={{
        fontFamily:
          "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        background: theme.background,
        minHeight: "100vh",
        color: theme.text,
      }}
    >
      {/* Top Nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: "100%",
          background: "rgba(200,227,201,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(10,59,72,0.12)",
        }}
      >
        <div
          style={{
            maxWidth: CONTAINER,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid rgba(10,59,72,0.15)`,
                background: theme.surface,
              }}
            >
              <img
                src={logoMint}
                alt="CrewHQ logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                fontWeight: 900,
                textTransform: "uppercase",
                color: theme.primary,
                letterSpacing: 1,
              }}
            >
              CrewHQ
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                style={{
                  color: theme.primary,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  opacity: 0.8,
                  transition: "opacity 140ms ease",
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section
        style={{
          width: "100%",
          padding: "140px 32px 90px",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,1)), radial-gradient(circle at 20% 20%, rgba(10,59,72,0.05), transparent 60%)",
        }}
      >
        <div
          style={{
            maxWidth: CONTAINER,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.45fr 0.55fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div>
            <Pill>People Infrastructure • Operational Systems • Execution</Pill>

            <h1
              style={{
                margin: "18px 0 0",
                color: theme.primary,
                fontSize: 64,
                lineHeight: 0.98,
                letterSpacing: -0.9,
                fontWeight: 900,
              }}
            >
              Operational clarity at scale.
            </h1>

            <p
              style={{
                fontSize: 19,
                lineHeight: 1.6,
                marginTop: 16,
                maxWidth: 760,
                opacity: 0.95,
              }}
            >
              CrewHQ designs and implements operational systems and people
              infrastructure for organizations operating in complex,
              high-coordination environments.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 22,
                flexWrap: "wrap",
              }}
            >
              <a href="#contact" style={{ textDecoration: "none" }}>
                <Button>Book a Discovery Call</Button>
              </a>
              <a href="#work" style={{ textDecoration: "none" }}>
                <Button variant="secondary">Join Our Staff Pool</Button>
              </a>
            </div>

            <div style={{ marginTop: 18, fontWeight: 800 }}>
              <div>
                Business:{" "}
                <a
                  href="mailto:sales@crewhqllc.com"
                  style={{ color: theme.primary }}
                >
                  sales@crewhqllc.com
                </a>
              </div>
              <div>
                Recruiting:{" "}
                <a
                  href="mailto:recruiting@crewhqllc.com"
                  style={{ color: theme.primary }}
                >
                  recruiting@crewhqllc.com
                </a>
              </div>
            </div>
          </div>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: theme.accent,
                }}
              />
              <div style={{ fontWeight: 900, color: theme.primary }}>
                CrewHQ Operating Philosophy
              </div>
            </div>

            <p style={{ marginTop: 12, opacity: 0.95, lineHeight: 1.5 }}>
              Well-supported people create successful operations. Systems are
              designed to promote clarity, accountability, adaptability, and
              respect in live environments.
            </p>

            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid rgba(10,59,72,0.12)",
                fontWeight: 800,
                color: theme.primary,
              }}
            >
              People First • Clarity Over Chaos • Respect the Day-Of Reality
            </div>
          </Card>
        </div>
      </section>

      {/* Services */}
      <Section id="services" title="Capabilities">
        <p style={{ fontSize: 18, maxWidth: 920, opacity: 0.95 }}>
          CrewHQ operates through a layered people infrastructure model designed
          to create sustainable, scalable operational environments.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 24,
            marginTop: 28,
          }}
        >
          <Card>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Pill>Pillar 1</Pill>
              <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
                Operational Execution
              </h3>
            </div>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              We deliver structured execution support in live environments,
              ensuring systems and leadership frameworks are implemented
              effectively in real-world conditions.
            </p>
          </Card>
          <Card>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Pill>Pillar 2</Pill>
              <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
                Leadership & Culture Enablement
              </h3>
            </div>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              We equip leaders, team leads, and coordinators with clarity,
              expectations, and cultural alignment necessary to execute within
              designed systems.
            </p>
          </Card>
          <Card>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Pill>Pillar 3</Pill>
              <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
                Event Planning & Strategic Design (supporting)
              </h3>
            </div>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              Available when required and does not supersede the layered
              operating model described above.
            </p>
            <p style={{ marginTop: 10, fontWeight: 900, lineHeight: 1.55 }}>
              CrewHQ prioritizes systemic design and human enablement over
              transactional staffing. Execution is delivered within defined
              systems and leadership structures — not as standalone labor.
            </p>
          </Card>
          <Card>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Pill>Pillar 4</Pill>
              <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
                Infrastructure Design
              </h3>
            </div>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              We design the underlying systems, workflows, and structural
              frameworks that enable organizations to operate effectively —
              including process architecture, operational modeling, and
              long-term advisory support.
            </p>
          </Card>
        </div>
      </Section>
      <Section id="deliver" title="Where CrewHQ Fits">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 24,
            marginTop: 8,
          }}
        >
          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 20 }}>
              Operating System Design
            </h3>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              Structural infrastructure design including workflow architecture,
              escalation frameworks, and operational modeling that supports
              long-term scalability.
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 20 }}>
              Leadership Enablement
            </h3>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              Role clarity, cultural alignment, and structured training to
              ensure leadership execution matches the designed system.
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 20 }}>
              Structured Execution Support
            </h3>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              Live-environment operational reinforcement delivered within
              defined systems and leadership structures — not transactional
              staffing.
            </p>
          </Card>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" title="Engagement Model" alt>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            [
              "Discovery & Alignment",
              "Structured intake and executive alignment to clarify objectives, constraints, and operational reality.",
            ],
            [
              "System Architecture",
              "Role definition, workflow modeling, escalation paths, and operational infrastructure design.",
            ],
            [
              "Leadership Enablement",
              "Training and expectation calibration to ensure execution aligns with the designed system.",
            ],
            [
              "Execution & Iteration",
              "Structured live-environment support with post-engagement refinement for scalable improvement.",
            ],
          ].map(([t, d]) => (
            <Card key={t}>
              <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
                {t}
              </h3>
              <p style={{ marginTop: 10, lineHeight: 1.55 }}>{d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Principles */}
      <Section id="principles" title="Operating Doctrine">
        <div style={{ display: "grid", gap: 16 }}>
          {[
            [
              "People First",
              "Volunteers and contractors are partners, not disposable labor.",
            ],
            [
              "Clarity Over Chaos",
              "Defined roles prevent burnout and confusion.",
            ],
            ["Consistency at Scale", "Growth must not degrade experience."],
            [
              "Flexibility in Execution",
              "Plans adapt to real-world conditions.",
            ],
            [
              "Respect the Day-Of Reality",
              "Judgment is valued over rigid scripts.",
            ],
          ].map(([t, d]) => (
            <Card key={t}>
              <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
                {t}
              </h3>
              <p style={{ marginTop: 10, lineHeight: 1.55 }}>{d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="about" title="About CrewHQ" alt>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {/* Left Card – Text */}
          <Card>
            <div
              style={{
                height: "100%",
                minHeight: 280, // match image card height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // this moves it down / centers vertically
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: theme.primary,
                  fontSize: 22,
                }}
              >
                Founder-led operations
              </h3>

              <p
                style={{
                  marginTop: 14,
                  lineHeight: 1.6,
                }}
              >
                CrewHQ is a people infrastructure and operations firm built for
                high-coordination environments. We design the systems, clarify
                leadership expectations, and support execution so teams can
                scale without chaos.
              </p>

              <div
                style={{
                  marginTop: 16,
                  fontWeight: 900,
                  color: theme.primary,
                  letterSpacing: 0.3,
                }}
              >
                Ashley Glenn • Mikal Driver
              </div>
            </div>
          </Card>

          {/* Right Card – Image */}
          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 22 }}>
              Our Founders
            </h3>

            <div
              style={{
                marginTop: 16,
                height: 280,
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(10,59,72,0.18)",
              }}
            >
              <img
                src={founderPhoto}
                alt="Photo of Mikal and Ashley"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </Card>
        </div>
      </Section>

      {/* Work with us */}
      <Section id="work" title="Work with us" alt>
        <Card>
          <p style={{ marginTop: 0, fontWeight: 900, lineHeight: 1.55 }}>
            Join our volunteer and independent contractor talent network.
            Opportunities may be volunteer-based or project-based contractor
            engagements depending on scope and event requirements. Engagements
            are structured in accordance with applicable independent contractor
            guidelines.
          </p>

          <form
            onSubmit={submitTalent}
            style={{ display: "grid", gap: 12, marginTop: 12 }}
          >
            <input
              placeholder="Full name"
              value={talent.name}
              onChange={(e) => setTalent({ ...talent, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={talent.email}
              onChange={(e) => setTalent({ ...talent, email: e.target.value })}
            />
            <input
              placeholder="Phone (optional)"
              value={talent.phone}
              onChange={(e) => setTalent({ ...talent, phone: e.target.value })}
            />
            <input
              placeholder="City / State"
              value={talent.city}
              onChange={(e) => setTalent({ ...talent, city: e.target.value })}
            />
            <input
              placeholder="Availability (ex: weekends, AM/PM shifts)"
              value={talent.availability}
              onChange={(e) =>
                setTalent({ ...talent, availability: e.target.value })
              }
            />
            <input
              placeholder="Interests (ops, team lead, check-in, runner…)"
              value={talent.interests}
              onChange={(e) =>
                setTalent({ ...talent, interests: e.target.value })
              }
            />
            <textarea
              placeholder="Experience (optional)"
              rows={4}
              value={talent.experience}
              onChange={(e) =>
                setTalent({ ...talent, experience: e.target.value })
              }
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              <Button type="submit">
                {talentStatus === "loading" ? "Submitting..." : "Join the Pool"}
              </Button>
              {talentStatus === "success" && (
                <span style={{ fontWeight: 900, color: theme.primary }}>
                  Got it — we’ll be in touch.
                </span>
              )}
              {talentStatus === "error" && (
                <span style={{ fontWeight: 900 }}>
                  Something went wrong. Try again.
                </span>
              )}
            </div>
          </form>
        </Card>
      </Section>

      {/* Contact / Sales */}
      <Section id="contact" title="Book a discovery call">
        <div style={{ display: "grid", gap: 16 }}>
          <Card>
            <p style={{ marginTop: 0 }}>
              Prefer to book immediately? Use Calendly:
            </p>
            <a
              href="https://calendly.com/ashley-crewhqllc/new-meeting"
              target="_blank"
              rel="noreferrer"
              style={{ color: theme.primary, fontWeight: 900 }}
            >
              calendly.com/ashley-crewhqllc/new-meeting
            </a>
            <div
              style={{
                marginTop: 14,
                padding: 14,
                background: "rgba(10,59,72,0.06)",
                border: "1px solid rgba(10,59,72,0.12)",
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              This calendar is reserved for organizations seeking operational
              and infrastructure support. It is not used for volunteer or
              independent contractor opportunity inquiries.
            </div>
          </Card>

          <Card>
            <p style={{ marginTop: 0, fontWeight: 900 }}>
              Or send a message and we’ll respond within 1–2 business days.
            </p>

            <form
              onSubmit={submitSales}
              style={{ display: "grid", gap: 12, marginTop: 12 }}
            >
              <input
                placeholder="Full name"
                value={sales.name}
                onChange={(e) => setSales({ ...sales, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={sales.email}
                onChange={(e) => setSales({ ...sales, email: e.target.value })}
              />
              <input
                placeholder="Company / Organization"
                value={sales.company}
                onChange={(e) =>
                  setSales({ ...sales, company: e.target.value })
                }
              />
              <input
                placeholder="Your role"
                value={sales.role}
                onChange={(e) => setSales({ ...sales, role: e.target.value })}
              />
              <input
                placeholder="Event type / environment (optional)"
                value={sales.eventType}
                onChange={(e) =>
                  setSales({ ...sales, eventType: e.target.value })
                }
              />
              <textarea
                placeholder="Tell us what you’re building + what you need help with"
                rows={5}
                value={sales.message}
                onChange={(e) =>
                  setSales({ ...sales, message: e.target.value })
                }
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 4,
                }}
              >
                <Button type="submit">
                  {salesStatus === "loading" ? "Submitting..." : "Send message"}
                </Button>
                {salesStatus === "success" && (
                  <span style={{ fontWeight: 900, color: theme.primary }}>
                    Received — we’ll reply soon.
                  </span>
                )}
                {salesStatus === "error" && (
                  <span style={{ fontWeight: 900 }}>
                    Something went wrong. Try again.
                  </span>
                )}
              </div>
            </form>

            <div style={{ marginTop: 16, fontWeight: 900 }}>
              Business:{" "}
              <a
                href="mailto:sales@crewhqllc.com"
                style={{ color: theme.primary }}
              >
                sales@crewhqllc.com
              </a>
            </div>
          </Card>
        </div>
      </Section>

      {/* Footer */}
      <footer
        style={{
          padding: "40px 24px 70px",
          borderTop: "1px solid rgba(10,59,72,0.12)",
          background: theme.background,
        }}
      >
        <div
          style={{
            maxWidth: CONTAINER,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontWeight: 900, color: theme.primary }}>
            CrewHQ LLC
          </div>
          <div style={{ fontWeight: 800 }}>
            <a
              href="mailto:sales@crewhqllc.com"
              style={{ color: theme.primary, marginRight: 12 }}
            >
              sales@crewhqllc.com
            </a>
            <a
              href="mailto:recruiting@crewhqllc.com"
              style={{ color: theme.primary }}
            >
              recruiting@crewhqllc.com
            </a>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style>{`
        html { scroll-behavior: smooth; }
        input, textarea {
          padding: 12px 12px;
          border-radius: 12px;
          border: 1px solid rgba(10,59,72,0.22);
          font-size: 14px;
          outline: none;
          background: white;
        }
        input:focus, textarea:focus {
          border-color: rgba(10,59,72,0.55);
          box-shadow: 0 0 0 4px rgba(10,59,72,0.12);
        }
        nav a:hover {
          opacity: 1;
        }
        footer a {
          transition: opacity 160ms ease;
        }
        footer a:hover {
          opacity: 0.75;
        }
        a:hover { opacity: 0.92; }
        @media (max-width: 900px) {
         h1 { font-size: 44px !important; }

        section div[style*="gridTemplateColumns"] {
        grid-template-columns: 1fr !important;
    }
  }
      `}</style>
    </div>
  );
}
