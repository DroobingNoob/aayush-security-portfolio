import Terminal from "../components/Terminal.jsx";
export default function StandardView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <div className="wrap">
      {"\n  "}
      <nav className="nav">
        <div className="brand">{"AAYUSH DASGUPTA"}</div>
        <div className="mono">
          {"ENTERPRISE SOFTWARE / APPLICATION SECURITY"}
        </div>
        <div>
          <button
            className="studio-toggle"
            id="studioToggle"
            type="button"
            aria-pressed="false"
            {...bindings.studioToggle}
          >
            <i></i>
            <span>{"STUDIO MODE"}</span>
          </button>
          <a
            className="mono"
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/aayush-dasgupta/"
          >
            {"LINKEDIN ↗"}
          </a>
        </div>
      </nav>
      {"\n  "}
      <header className="hero">
        <div>
          <div className="eyebrow mono">
            {"CURRENTLY / M.SC. ENTERPRISE & IT SECURITY"}
          </div>
          <h1>
            {"Build it."}
            <br />
            {"Break it."}
            <br />
            {"Make it safer."}
          </h1>
          <p className="lede">
            {
              "Computer Science graduate and enterprise software professional with hands-on application security experience. I work across React-based systems, secure software development, vulnerability assessment, and security architecture."
            }
          </p>
          <div className="links">
            <a className="button" href="#work">
              {"EXPLORE THE WORK ↓"}
            </a>
            <a
              className="button soft"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/DroobingNoob"
            >
              {"GITHUB ↗"}
            </a>
            <a
              className="button soft"
              target="_blank"
              rel="noreferrer"
              href="https://droobingnoob.medium.com"
            >
              {"WRITING ↗"}
            </a>
          </div>
        </div>
        <aside className="facts">
          <div className="portrait-wrap">
            <img
              className="portrait"
              src="assets/aayush-portrait-cutout.png"
              alt="Aayush Dasgupta"
            />
          </div>
          <p className="mono">{"01 / NOW"}</p>
          <strong>{"M.Sc. Enterprise & IT Security"}</strong>
          <p>{"Hochschule Offenburg · Germany"}</p>
          <p className="mono">{"02 / RECENT"}</p>
          <strong>{"Associate, PwC India"}</strong>
          <p>
            {"Enterprise application development and secure software practice"}
          </p>
          <p className="mono">{"03 / FOCUS"}</p>
          <strong>
            {
              "Application security · secure development · security architecture"
            }
          </strong>
        </aside>
        <div className="studio-avatar" aria-hidden="true">
          <img src="assets/aayush-studio-portrait.png" alt="" />
        </div>
      </header>
      {"\n  "}
      <section id="work">
        <div className="section-head">
          <b className="mono">{"01"}</b>
          <h2>{"Selected systems"}</h2>
        </div>
        <div className="split">
          {"\n    "}
          <article className="project">
            <div className="tag">{"APPLICATION SECURITY PLATFORM"}</div>
            <h3>{"Obsidian"}</h3>
            <p>
              {
                "A full-stack platform for authorized security assessment. It combines Nmap, OWASP ZAP, and Nuclei with evidence normalization, contextual risk scoring, false-positive assessment, and attack-path correlation. An OpenAI-compatible backend provides evidence-constrained analysis and remediation guidance."
              }
            </p>
            <div className="stack">
              {"REACT · TYPESCRIPT · PYTHON · FASTAPI · TAILWIND · DOCKER"}
            </div>
          </article>
          {"\n    "}
          <article className="project">
            <div className="tag">{"CRYPTOGRAPHY EXPERIMENT"}</div>
            <h3>{"Geo-Encryption"}</h3>
            <p>
              {
                "Location-aware encryption that uses live coordinates with a user-defined key, binding decryption to the original geographic context."
              }
            </p>
            <div className="stack">
              {"GEOLOCATION APIS · CUSTOM ENCRYPTION LOGIC"}
            </div>
          </article>
          {"\n    "}
          <article className="project">
            <div className="tag">{"DEFENSIVE ENGINEERING"}</div>
            <h3>{"Web Application Firewall"}</h3>
            <p>
              {
                "A Python proxy that inspects HTTP traffic, detects SQL injection and XSS patterns, logs features, and applies rule-based and ML-supported request classification."
              }
            </p>
            <div className="stack">
              {"PYTHON · HTTP INSPECTION · TRAFFIC ANALYSIS"}
            </div>
          </article>
          {"\n  "}
        </div>
      </section>
      {"\n  "}
      <Terminal />
      {"\n  "}
      <section>
        <div className="section-head">
          <b className="mono">{"03"}</b>
          <h2>{"Enterprise delivery"}</h2>
        </div>
        <div className="timeline">
          {"\n    "}
          <article className="role">
            <time>{"APR 2025 — SEP 2026"}</time>
            <h3>
              {"Associate "}
              <span className="company">{"/ PwC India"}</span>
            </h3>
            <p>
              {
                "Developed React-based enterprise applications in the Guidewire ecosystem across client projects. Led development of an AI-enabled platform for BRD, FSD, test-case generation, and log analysis that was presented to and adopted by external enterprise clients. Built an SAP Effort Estimator recognized by senior management and contributed to three releases across two client projects."
              }
            </p>
          </article>
          {"\n    "}
          <article className="role">
            <time>{"SEP 2024 — MAR 2025"}</time>
            <h3>
              {"Specialist "}
              <span className="company">{"/ PwC India"}</span>
            </h3>
            <p>
              {
                "Enhanced React applications and developed working knowledge of Guidewire and Jutro across ClaimCenter, ContactManager, CustomerEngage, and VendorEngage."
              }
            </p>
          </article>
          {"\n    "}
          <article className="role">
            <time>{"JAN 2024 — SEP 2024"}</time>
            <h3>
              {"Internship Trainee "}
              <span className="company">{"/ PwC India"}</span>
            </h3>
            <p>
              {
                "Built frontend architecture for a Learning Management System and responsive UI components, with focus on performance and user experience."
              }
            </p>
          </article>
          {"\n    "}
          <article className="role">
            <time>{"2022 — 2023"}</time>
            <h3>
              {"Security internships "}
              <span className="company">
                {
                  "/ CyberSRC · Virtually Testing Foundation · Slytherin EduTech"
                }
              </span>
            </h3>
            <p>
              {
                "Conducted network mapping, vulnerability assessment, and penetration testing; administered security solutions; and researched cyber forensics and cybercrime topics."
              }
            </p>
          </article>
          {"\n  "}
        </div>
      </section>
      {"\n  "}
      <section>
        <div className="section-head">
          <b className="mono">{"04"}</b>
          <h2>{"Education & credentials"}</h2>
        </div>
        <div className="grid3">
          {"\n    "}
          <article className="cell">
            <div className="tag">{"EDUCATION"}</div>
            <h3>{"M.Sc. Enterprise & IT Security"}</h3>
            <p>
              {"Hochschule Offenburg"}
              <br />
              {"2026 — present"}
            </p>
          </article>
          <article className="cell">
            <div className="tag">{"EDUCATION"}</div>
            <h3>{"B.Tech. Computer Science & Engineering"}</h3>
            <p>
              {"Kalinga Institute of Industrial Technology"}
              <br />
              {"2020 — 2024 · 8.66"}
            </p>
          </article>
          <article className="cell">
            <div className="tag">{"CERTIFICATIONS"}</div>
            <h3>{"Oracle Certified AI Foundations Associate"}</h3>
            <p>{"Oracle · 2025"}</p>
          </article>
          <article className="cell">
            <div className="tag">{"CERTIFICATIONS"}</div>
            <h3>{"Certified Network Security Practitioner"}</h3>
            <p>{"The SecOps Group · 2023"}</p>
          </article>
          <article className="cell">
            <div className="tag">{"CERTIFICATIONS"}</div>
            <h3>{"Certified AppSec Practitioner"}</h3>
            <p>{"The SecOps Group · 2022"}</p>
          </article>
          <article className="cell">
            <div className="tag">{"CONTINUING PRACTICE"}</div>
            <h3>{"TryHackMe CTF Player & Medium Blogger"}</h3>
            <p>
              {
                "Hands-on security learning and technical writing since 2022 and 2023 respectively."
              }
            </p>
          </article>
          {"\n  "}
        </div>
      </section>
      {"\n  "}
      <section>
        <div className="section-head">
          <b className="mono">{"05"}</b>
          <h2>{"Additional licenses & certifications"}</h2>
        </div>
        <div className="grid3">
          {"\n    "}
          <article className="cell">
            <div className="tag">{"PALO ALTO NETWORKS · 2023"}</div>
            <h3>{"Fundamentals of Network Security"}</h3>
            <p>{"Networking and network security foundations."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"PALO ALTO NETWORKS · 2023"}</div>
            <h3>{"Fundamentals of Cloud Security"}</h3>
            <p>{"Cloud-computing and cloud-security foundations."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"PALO ALTO NETWORKS · 2023"}</div>
            <h3>{"Fundamentals of SOC"}</h3>
            <p>
              {
                "Security Operations Center and cyber-threat-intelligence foundations."
              }
            </p>
          </article>
          <article className="cell">
            <div className="tag">{"ICTTF · 2023"}</div>
            <h3>{"Ransomware Uncovered Specialist"}</h3>
            <p>{"NIST Cybersecurity Framework and ransomware awareness."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"BASEL INSTITUTE · 2023"}</div>
            <h3>{"Open Source Intelligence"}</h3>
            <p>{"OSINT methods and applied research."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"SPLUNK · 2023"}</div>
            <h3>{"Intro to Splunk"}</h3>
            <p>{"Security-data and Splunk foundations."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"VIRTUALLY TESTING FOUNDATION · 2023"}</div>
            <h3>{"Threat Hunting Bootcamp"}</h3>
            <p>{"Cyber-threat-hunting practice."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"ATTACKIQ · 2023"}</div>
            <h3>{"Operationalizing MITRE ATT&CK"}</h3>
            <p>{"Foundations of working with the MITRE ATT&CK framework."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"DAMN SECURE PENTESTING HUB · 2022"}</div>
            <h3>{"DAMNCON 2022"}</h3>
            <p>{"Pentesting and cryptography challenge participation."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"RISE · 2022"}</div>
            <h3>{"GET SET HACK Certificate"}</h3>
            <p>{"Cryptography and forensics hackathon participation."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"TRYHACKME · 2022"}</div>
            <h3>{"Pre Security Learning Path"}</h3>
            <p>{"Practical security foundations and Shodan exposure."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"TRYHACKME · 2022"}</div>
            <h3>{"Advent of Cyber 3 — 2021"}</h3>
            <p>{"Hands-on seasonal security learning challenge."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"HACK THE BOX · 2022"}</div>
            <h3>{"Cyber Apocalypse CTF"}</h3>
            <p>{"Competitive cybersecurity challenge participation."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"WHIZOID STUDIO · 2022"}</div>
            <h3>{"Fireside CTF Challenge"}</h3>
            <p>{"Cryptography and security challenge participation."}</p>
          </article>
          <article className="cell">
            <div className="tag">{"FORTINET · 2023"}</div>
            <h3>{"NSE-1 Network Security Associate"}</h3>
            <p>{"Expired February 2026."}</p>
          </article>
          {"\n  "}
        </div>
      </section>
      {"\n  "}
      <section>
        <div className="section-head">
          <b className="mono">{"06"}</b>
          <h2>{"Recognition"}</h2>
        </div>
        <div className="awards">
          <article className="award">
            <b>{"3× PwC Change Catalyst Award"}</b>
            <span>
              {
                "Recognition for innovation, client impact, technical problem-solving, and contributions across projects."
              }
            </span>
          </article>
          <article className="award">
            <b>{"GET SET HACK — Top 100"}</b>
            <span>
              {
                "Ranked 76th of 22,000 participants in RISE WPU's cryptography and forensics hackathon."
              }
            </span>
          </article>
        </div>
      </section>
      {"\n  "}
      <footer>
        <div>
          <div
            className="mono"
            style={{ color: "var(--lime)", marginBottom: "14px" }}
          >
            {"LET'S CONNECT"}
          </div>
          <div className="contact">
            {"Interested in secure"}
            <br />
            {"systems? "}
            <a
              href="https://www.linkedin.com/in/aayush-dasgupta/"
              target="_blank"
              rel="noreferrer"
            >
              {"Say hello ↗"}
            </a>
          </div>
        </div>
        <div className="small">
          {"AAYUSH DASGUPTA"}
          <br />
          {"ENTERPRISE & IT SECURITY"}
          <br />
          {"OFFENBURG, GERMANY"}
        </div>
      </footer>
      {"\n"}
    </div>
  );
}
