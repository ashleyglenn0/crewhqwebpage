import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { theme } from "./theme";
import logoMint from "./assets/logo.jpg";
import ashleyPhoto from "./assets/ashley.jpeg";
import mikalPhoto from "./assets/mikal.JPEG";

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

const FounderCard = ({ name, title, bio, photo, imgPosition = "50% 25%" }) => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid rgba(10,59,72,0.18)",
          background: "rgba(10,59,72,0.06)",
          flexShrink: 0,
        }}
      >
        <img
          src={photo}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: imgPosition,
            display: "block",
          }}
        />
      </div>

      <div>
        <div style={{ fontWeight: 900, color: theme.primary, fontSize: 18 }}>
          {name}
        </div>
        <div style={{ fontWeight: 800, opacity: 0.9 }}>{title}</div>
      </div>
    </div>

    <p style={{ marginTop: 14, lineHeight: 1.6, opacity: 0.95 }}>{bio}</p>
  </Card>
);

export default function App() {
  const [sales, setSales] = useState({
    contactName: "",
    email: "",
    orgName: "",
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
      { label: "About", href: "#founders" },
      { label: "Service Pillars", href: "#pillars" },
      { label: "Engagement Model", href: "#how" },
      // ✅ ADD: Walkthrough CTA anchor
      { label: "Walkthrough", href: "#walkthrough" },
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
        linkedin: "",
        social: "",
        phone: "",
        city: "",
        availability: "",
        interests: "",
        experience: "",
        preference: "",
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

          {/* Nav links: single line + scroll on portrait */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "nowrap",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              justifyContent: "flex-start",
              paddingBottom: 2,
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
                  whiteSpace: "nowrap",
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

              {/* ✅ ADD: Walkthrough CTA (framed as part of the system) */}
              <a href="#walkthrough" style={{ textDecoration: "none" }}>
                <Button variant="secondary">30-Min Walkthrough</Button>
              </a>

              <a href="#work" style={{ textDecoration: "none" }}>
                <Button variant="secondary">Join Talent Network</Button>
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
                Operating Philosophy
              </div>
            </div>

            <p style={{ marginTop: 12, opacity: 0.95, lineHeight: 1.5 }}>
              Well supported people create successful operations. Systems are
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

      {/* ✅ ADD: Walkthrough CTA Section */}
      <Section id="walkthrough" title="30-Minute Walkthrough" alt>
        <Card>
          <p style={{ marginTop: 0, fontWeight: 900, lineHeight: 1.55 }}>
            See how CrewHQ operationalizes live environments.
          </p>
          <p style={{ marginTop: 10, lineHeight: 1.55, maxWidth: 980 }}>
            This is a structured walkthrough of how we build clarity and reduce
            day-of risk, including what event leadership can track, what team
            leads manage, and what volunteers experience on-site. The software
            is one part of the system; the operating model is the product.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 14,
              marginTop: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(10,59,72,0.12)",
                background: "rgba(10,59,72,0.05)",
              }}
            >
              <div style={{ fontWeight: 900, color: theme.primary }}>
                What you’ll see
              </div>
              <div style={{ marginTop: 8, lineHeight: 1.55, opacity: 0.95 }}>
                Executive visibility, team lead coordination, and volunteer flow.
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(10,59,72,0.12)",
                background: "rgba(10,59,72,0.05)",
              }}
            >
              <div style={{ fontWeight: 900, color: theme.primary }}>
                Who it’s for
              </div>
              <div style={{ marginTop: 8, lineHeight: 1.55, opacity: 0.95 }}>
                Event founders, ops leads, and teams planning high-coordination work.
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(10,59,72,0.12)",
                background: "rgba(10,59,72,0.05)",
              }}
            >
              <div style={{ fontWeight: 900, color: theme.primary }}>
                Outcome
              </div>
              <div style={{ marginTop: 8, lineHeight: 1.55, opacity: 0.95 }}>
                Clear next steps for staffing, enablement, and execution support.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 18,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <a
              href="https://calendly.com/ashley-crewhqllc/new-meeting-clone"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button>Schedule the Walkthrough</Button>
            </a>

            <a href="#contact" style={{ textDecoration: "none" }}>
              <Button variant="secondary">Prefer discovery first</Button>
            </a>

            <span style={{ fontWeight: 800, color: theme.textMuted }}>
              30 minutes • focused walkthrough • Q&A included
            </span>
          </div>
        </Card>
      </Section>

      {/* Founders */}
      <Section id="founders" title="Meet the Founders" alt>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <FounderCard
            name="Ashley Glenn"
            photo={ashleyPhoto}
            title="Founder • People Infrastructure & Operations"
            bio="Ashley builds people infrastructure for high-coordination environments, architecting the systems, expectations, and leadership rhythms that prevent chaos at scale. With a background spanning technology, live operations, and organizational design, she develops scalable frameworks that align leadership, workflow, and day-of execution. Her work centers on operational clarity, volunteer and contractor enablement, and structured ecosystems where teams feel supported and performance can scale without confusion."
            imgPosition="30% 25%"
          />
          <FounderCard
            name="Mikal Driver"
            photo={mikalPhoto}
            title="Founder • People Infrastructure Strategist"
            bio="Mikal designs people-centered systems at the intersection of education, equity, and opportunity, building aligned ecosystems that move people from potential to power. With over eleven years of experience as an educator and youth development strategist, he architects leadership development, culture design, and partnership models that create measurable and sustainable outcomes. His work focuses on aligning data, family engagement, and institutional decision making to transform long-term trajectories."
            imgPosition="70% 25%"
          />
        </div>
      </Section>

      {/* Service Pillars + Where CrewHQ Fits (combined) */}
      <Section id="pillars" title="Service Pillars">
        <p style={{ fontSize: 18, maxWidth: 980, opacity: 0.95 }}>
          CrewHQ operates through a layered people infrastructure model designed
          to create sustainable, scalable operational environments.
        </p>

        {/* Where CrewHQ Fits — merged intro */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 24,
            marginTop: 22,
          }}
        >
          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 20 }}>
              Operational Infrastructure Blueprint
            </h3>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              A documented operating model: roles, workflows, escalation paths,
              staffing logic, and the system your team can run without
              improvising under pressure.
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 20 }}>
              Leadership Enablement Package
            </h3>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              Clear expectations, training assets, and coordinator/team lead
              playbooks that translate the system into consistent execution
              across people and shifts.
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: 0, color: theme.primary, fontSize: 20 }}>
              Execution Reinforcement & Debrief
            </h3>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              On the ground reinforcement (when needed), plus post-engagement
              insights and revisions so the system improves with each cycle, not
              just each event.
            </p>
          </Card>
        </div>

        {/* 2x2 Pillars */}
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
              Structured execution support in live environments, ensuring
              systems and leadership frameworks are implemented effectively in
              real-world conditions.
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
              Leader, team lead, and coordinator enablement through clarity,
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
                Strategic Design Support (when required)
              </h3>
            </div>
            <p style={{ marginTop: 10, lineHeight: 1.55 }}>
              Available when required and does not supersede the layered
              operating model described above.
            </p>
            <p style={{ marginTop: 10, fontWeight: 900, lineHeight: 1.55 }}>
              CrewHQ prioritizes systemic design and human enablement over
              transactional staffing. Execution is delivered within defined
              systems and leadership structures, not as standalone labor.
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
              The underlying systems, workflows, and structural frameworks that
              enable organizations to operate effectively, including process
              architecture, operational modeling, and long-term advisory
              support.
            </p>
          </Card>
        </div>
      </Section>

      {/* Engagement Model */}
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

        {/* Divider */}
        <div
          style={{
            marginTop: 60,
            paddingTop: 40,
            borderTop: "1px solid rgba(10,59,72,0.15)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 24,
              color: theme.primary,
              fontWeight: 900,
            }}
          >
            Guiding Principles
          </h3>

          <div
            style={{
              display: "grid",
              gap: 16,
              marginTop: 20,
            }}
          >
            {[
              [
                "People First",
                "Volunteers and contractors are partners, not disposable labor.",
              ],
              [
                "Clarity Over Chaos",
                "Defined roles and expectations prevent burnout and confusion.",
              ],
              [
                "Respect the Day-Of Reality",
                "Judgment and adaptability matter more than rigid scripts.",
              ],
            ].map(([t, d]) => (
              <Card key={t}>
                <h4 style={{ margin: 0, color: theme.primary, fontSize: 18 }}>
                  {t}
                </h4>
                <p style={{ marginTop: 8, lineHeight: 1.55 }}>{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Talent Network */}
      <Section id="work" title="Talent Network" alt>
        <Card>
          <p style={{ marginTop: 0, fontWeight: 900, lineHeight: 1.55 }}>
            Join our talent network.
          </p>
          <p style={{ marginTop: 10, lineHeight: 1.55 }}>
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
              placeholder="LinkedIn URL (preferred)"
              value={talent.linkedin || ""}
              onChange={(e) =>
                setTalent({ ...talent, linkedin: e.target.value })
              }
            />
            <input
              placeholder="Other social handle or portfolio link (optional)"
              value={talent.social || ""}
              onChange={(e) => setTalent({ ...talent, social: e.target.value })}
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

            {/* Preference */}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>
                Preference (optional)
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {[
                  { value: "volunteer", label: "Volunteer" },
                  { value: "contractor", label: "Contractor" },
                  { value: "both", label: "Both" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: `1px solid ${theme.border}`,
                      background:
                        talent.preference === opt.value
                          ? theme.surface
                          : theme.inputBg,
                    }}
                  >
                    <input
                      type="radio"
                      name="talentPreference"
                      value={opt.value}
                      checked={talent.preference === opt.value}
                      onChange={(e) =>
                        setTalent({ ...talent, preference: e.target.value })
                      }
                      style={{ accentColor: theme.primary }}
                    />
                    <span style={{ fontWeight: 800 }}>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Soft disclaimer */}
              <p
                style={{
                  margin: "10px 0 0",
                  lineHeight: 1.5,
                  color: theme.textMuted,
                }}
              >
                We’ll always do our best to match your preference. Final
                placements may shift based on event needs, schedule coverage,
                and role fit.
              </p>
            </div>

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
                {talentStatus === "loading" ? "Submitting..." : "Submit"}
              </Button>
              {talentStatus === "success" && (
                <span style={{ fontWeight: 900, color: theme.primary }}>
                  Received — we’ll be in touch.
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
      <Section id="contact" title="Contact">
        <div style={{ display: "grid", gap: 16 }}>
          <Card>
            <p style={{ marginTop: 0, fontWeight: 900 }}>
              Book a discovery call
            </p>

            <a
              href="https://calendly.com/ashley-crewhqllc/new-meeting"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button>Open Calendly</Button>
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
                value={sales.contactName}
                onChange={(e) =>
                  setSales({ ...sales, contactName: e.target.value })
                }
              />
              <input
                placeholder="Email"
                value={sales.email}
                onChange={(e) => setSales({ ...sales, email: e.target.value })}
              />
              <input
                placeholder="Company / Organization"
                value={sales.orgName}
                onChange={(e) =>
                  setSales({ ...sales, orgName: e.target.value })
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
          <div style={{ fontWeight: 900, color: theme.primary }}>CrewHQ</div>
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
        a:hover { opacity: 0.92; }
        footer a {
          transition: opacity 160ms ease;
        }
        footer a:hover { opacity: 0.75; }

        /* Portrait / mobile cleanup */
        @media (max-width: 768px) and (orientation: portrait) {

          /* Reduce section padding */
          section {
            padding: 80px 20px !important;
          }

          /* Collapse all grids */
          section div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }

          /* Hero headline scale */
          h1 {
            font-size: 36px !important;
            line-height: 1.08 !important;
            letter-spacing: -0.6px !important;
          }

          h2 {
            font-size: 32px !important;
          }

          /* Reduce hero vertical padding */
          section:first-of-type {
            padding-top: 100px !important;
            padding-bottom: 60px !important;
          }

        }
      `}</style>
    </div>
  );
}