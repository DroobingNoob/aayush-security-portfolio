import React from "react";
import Projects from "../components/Projects.jsx";
import Credentials from "../components/Credentials.jsx";
export default function StudioView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <React.Fragment>
      <div className="noise"></div>
      <div className="progress"></div>
      <nav className="nav">
        <span>{"AD / FRONTEND STUDY_01"}</span>
        <a className="back" href="index.html">
          {"← STANDARD PORTFOLIO"}
        </a>
      </nav>
      {"\n"}
      <main id="studioScroll" tabIndex="0" aria-label="Studio chapters">
        {"\n  "}
        <section className="scene hero" id="intro" aria-label="intro">
          <i className="orb a"></i>
          <i className="orb b"></i>
          <div className="hero-copy reveal">
            <div className="eyebrow">
              {"AAYUSH DASGUPTA / FRONTEND + APPLICATION SECURITY"}
            </div>
            <h1>
              {"Aayush"}
              <br />
              <em>{"Dasgupta."}</em>
            </h1>
            <p>
              {
                "Previously Associate at PwC India. M.Sc. Enterprise & IT Security candidate at Hochschule Offenburg. I build React-based enterprise products and investigate the security behind them."
              }
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img src="assets/aayush-studio-portrait.png" alt="" />
          </div>
          <div className="scroll-cue">{"EXPLORE THE RECORD"}</div>
        </section>
        {"\n  "}
        <section className="scene" id="frontend" aria-label="frontend">
          <div className="marquee" data-speed="-0.16">
            {"REACT · GUIDEWIRE · APPSEC · FASTAPI · "}
          </div>
          <i className="orb c"></i>
          <div className="chapter reveal">
            <div className="eyebrow">{"01 / PRODUCTION FRONTEND"}</div>
            <h2>
              {"React in production."}
              <br />
              <i>{"Security in practice."}</i>
            </h2>
            <p className="statement">
              {
                "My core work is frontend delivery inside enterprise software: responsive React applications, Guidewire and Jutro interfaces, client releases, application quality, testing, and code review."
              }
            </p>
          </div>
          <div className="flow reveal">
            <article
              className="flow-card tilt-card"
              style={{ "--lift": "32px" }}
            >
              <b>{"PWC INDIA / 2025–2026"}</b>
              <h3>{"Associate"}</h3>
              <p>
                {
                  "Built React-based enterprise applications and an AI-enabled BRD, FSD, test-case, and log-analysis platform adopted by external enterprise clients."
                }
              </p>
            </article>
            <article className="flow-card tilt-card">
              <b>{"PWC INDIA / 2024–2025"}</b>
              <h3>{"Specialist"}</h3>
              <p>
                {
                  "Worked across Guidewire and Jutro, including ClaimCenter, ContactManager, CustomerEngage, and VendorEngage."
                }
              </p>
            </article>
            <article
              className="flow-card tilt-card"
              style={{ "--lift": "65px" }}
            >
              <b>{"PWC INDIA / 2024"}</b>
              <h3>{"Internship Trainee"}</h3>
              <p>
                {
                  "Built frontend architecture and responsive UI components for a Learning Management System."
                }
              </p>
            </article>
          </div>
        </section>
        {"\n  "}
        <Projects />
        {"\n  "}
        <Credentials />
        {"\n  "}
        <section className="scene" id="delivery" aria-label="delivery">
          <div className="chapter reveal">
            <div className="eyebrow">{"04 / DELIVERY + STUDY"}</div>
            <h2>
              {"From client releases"}
              <br />
              {"to "}
              <i>{"security architecture."}</i>
            </h2>
            <p className="statement">
              {
                "Three successful releases across two PwC client projects, three Change Catalyst Awards, and ongoing study in Enterprise & IT Security."
              }
            </p>
          </div>
          <div className="experience-grid reveal">
            <article>
              <time>{"2025 — 2026 / PWC INDIA"}</time>
              <h3>{"Associate"}</h3>
              <p>
                {
                  "Delivered customized client solutions, supported testing and debugging, and contributed to secure coding and quality improvements."
                }
              </p>
            </article>
            <article>
              <time>{"2024 — 2025 / PWC INDIA"}</time>
              <h3>{"Specialist"}</h3>
              <p>
                {
                  "Designed responsive, user-focused interfaces in Agile teams for enterprise insurance platform solutions."
                }
              </p>
            </article>
            <article>
              <time>{"3× PWC CHANGE CATALYST"}</time>
              <h3>{"Recognized"}</h3>
              <p>
                {
                  "Awards for innovation, client impact, technical problem-solving, and meaningful contribution across projects."
                }
              </p>
            </article>
            <article>
              <time>{"NOW / OFFENBURG"}</time>
              <h3>{"M.Sc. Enterprise & IT Security"}</h3>
              <p>
                {
                  "Building on a B.Tech. in Computer Science & Engineering with a focus on secure development and security architecture."
                }
              </p>
            </article>
          </div>
        </section>
        {"\n  "}
        <section className="scene closing" id="connect" aria-label="connect">
          <i className="orb b"></i>
          <div className="reveal">
            <div className="eyebrow">{"05 / CONNECT"}</div>
            <h2>
              {"Have a product,"}
              <br />
              {"security problem, or"}
              <br />
              <i>{"frontend system?"}</i>
            </h2>
            <p className="statement">
              {
                "Start with the work that matters. The standard portfolio has the full résumé and a Linux-style filesystem to explore."
              }
            </p>
            <div className="contact-panel">
              <a
                href="https://www.linkedin.com/in/aayush-dasgupta/"
                target="_blank"
                rel="noreferrer"
              >
                {"CONNECT ON LINKEDIN ↗"}
              </a>
              <a
                href="https://github.com/DroobingNoob"
                target="_blank"
                rel="noreferrer"
              >
                {"VIEW GITHUB ↗"}
              </a>
              <a href="index.html">{"OPEN STANDARD PORTFOLIO →"}</a>
            </div>
          </div>
        </section>
        {"\n"}
      </main>
      {"\n"}
      <nav className="chapter-controls" aria-label="Chapter navigation">
        {"\n"}
        <button
          type="button"
          id="previousChapter"
          aria-label="Previous chapter"
        >
          {"↑"}
        </button>
        {"\n"}
        <span id="chapterCounter">{"01 / 06"}</span>
        {"\n"}
        <button type="button" id="nextChapter" aria-label="Next chapter">
          {"↓"}
        </button>
        {"\n"}
      </nav>
      {"\n\n"}
    </React.Fragment>
  );
}
