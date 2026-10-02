export default function CredentialsView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <section
      className="scene credentials-scene"
      id="credentials"
      aria-label="credentials and security practice"
    >
      {"\n  "}
      <div className="chapter reveal">
        <div className="eyebrow">{"03 / EVIDENCE OF PRACTICE"}</div>
        <h2>
          {"Credentials, CTFs,"}
          <br />
          {"and "}
          <i>{"curiosity."}</i>
        </h2>
        <p className="statement">
          {
            "A complete record of formal credentials, focused learning, and hands-on security challenges."
          }
        </p>
        <div className="credential-summary">
          <span>
            <b>{"14"}</b>
            {" credentials"}
          </span>
          <span>
            <b>{"4"}</b>
            {" CTFs + challenges"}
          </span>
          <span>
            <b>{"2"}</b>
            {" ongoing practices"}
          </span>
        </div>
      </div>
      {"\n  "}
      <div className="credential-atlas reveal">
        {"\n    "}
        <div
          className="credential-filter"
          role="group"
          aria-label="Filter credentials"
        >
          <button
            type="button"
            data-credential-filter="all"
            aria-pressed="true"
            {...bindings.all}
          >
            {"All"}
          </button>
          <button
            type="button"
            data-credential-filter="credential"
            aria-pressed="false"
            {...bindings.credential}
          >
            {"Credentials"}
          </button>
          <button
            type="button"
            data-credential-filter="challenge"
            aria-pressed="false"
            {...bindings.challenge}
          >
            {"CTFs + challenges"}
          </button>
          <button
            type="button"
            data-credential-filter="practice"
            aria-pressed="false"
            {...bindings.practice}
          >
            {"Practice"}
          </button>
        </div>
        {"\n    "}
        <div
          className="credential-drift"
          id="credentialDeck"
          aria-live="polite"
          {...bindings.credentialDeck}
        >
          {"\n      "}
          <article data-kind="credential" {...cardProps(0)}>
            <small>{"ORACLE · 2025–2027"}</small>
            <h3>{"AI Foundations Associate"}</h3>
            <p>
              {
                "Foundational AI concepts, data handling, model training, and real-world applications."
              }
            </p>
            <span className="credential-state active">{"ACTIVE"}</span>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(1)}>
            <small>{"THE SECOPS GROUP · 2023"}</small>
            <h3>{"Certified Network Security Practitioner"}</h3>
            <p>
              {
                "Network-security practice covering defensive concepts, cryptography, and technical assessment."
              }
            </p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(2)}>
            <small>{"THE SECOPS GROUP · 2022"}</small>
            <h3>{"Certified AppSec Practitioner"}</h3>
            <p>
              {
                "Application-security practice with a hands-on Linux foundation."
              }
            </p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(3)}>
            <small>{"PALO ALTO NETWORKS · 2023"}</small>
            <h3>{"Fundamentals of Network Security"}</h3>
            <p>{"Networking and network-security foundations."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(4)}>
            <small>{"PALO ALTO NETWORKS · 2023"}</small>
            <h3>{"Fundamentals of Cloud Security"}</h3>
            <p>{"Cloud-computing and cloud-security foundations."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(5)}>
            <small>{"PALO ALTO NETWORKS · 2023"}</small>
            <h3>{"Fundamentals of SOC"}</h3>
            <p>
              {
                "Security Operations Center and cyber-threat-intelligence foundations."
              }
            </p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(6)}>
            <small>{"ICTTF · 2023"}</small>
            <h3>{"Ransomware Uncovered Specialist"}</h3>
            <p>{"NIST Cybersecurity Framework and ransomware awareness."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(7)}>
            <small>{"BASEL INSTITUTE · 2023"}</small>
            <h3>{"Open Source Intelligence"}</h3>
            <p>{"OSINT methods and applied research."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(8)}>
            <small>{"SPLUNK · 2023"}</small>
            <h3>{"Intro to Splunk"}</h3>
            <p>{"Security-data and Splunk foundations."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(9)}>
            <small>{"VIRTUALLY TESTING FOUNDATION · 2023"}</small>
            <h3>{"Threat Hunting Bootcamp"}</h3>
            <p>{"Cyber-threat-hunting practice."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(10)}>
            <small>{"ATTACKIQ · 2023"}</small>
            <h3>{"Operationalizing MITRE ATT&CK"}</h3>
            <p>{"Foundations of working with the MITRE ATT&CK framework."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(11)}>
            <small>{"FORTINET · 2023–2026"}</small>
            <h3>{"NSE-1 Network Security Associate"}</h3>
            <p>
              {
                "Network-security awareness and foundational defensive concepts."
              }
            </p>
            <span className="credential-state expired">
              {"EXPIRED FEB 2026"}
            </span>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(12)}>
            <small>{"TRYHACKME · 2022"}</small>
            <h3>{"Pre Security Learning Path"}</h3>
            <p>{"Practical security foundations and Shodan exposure."}</p>
          </article>
          {"\n      "}
          <article data-kind="credential" {...cardProps(13)}>
            <small>{"TRYHACKME · 2022"}</small>
            <h3>{"Advent of Cyber 3 — 2021"}</h3>
            <p>{"Hands-on seasonal security learning challenge."}</p>
          </article>
          {"\n      "}
          <article data-kind="challenge" {...cardProps(14)}>
            <small>{"DAMN SECURE PENTESTING HUB · 2022"}</small>
            <h3>{"DAMNCON 2022"}</h3>
            <p>{"Pentesting and cryptography challenge participation."}</p>
          </article>
          {"\n      "}
          <article data-kind="challenge" {...cardProps(15)}>
            <small>{"RISE · 2022"}</small>
            <h3>{"GET SET HACK"}</h3>
            <p>
              {
                "Ranked 76th of 22,000 participants in a cryptography and forensics hackathon."
              }
            </p>
            <span className="credential-state active">{"TOP 100"}</span>
          </article>
          {"\n      "}
          <article data-kind="challenge" {...cardProps(16)}>
            <small>{"HACK THE BOX · 2022"}</small>
            <h3>{"Cyber Apocalypse CTF"}</h3>
            <p>{"Competitive cybersecurity challenge participation."}</p>
          </article>
          {"\n      "}
          <article data-kind="challenge" {...cardProps(17)}>
            <small>{"WHIZOID STUDIO · 2022"}</small>
            <h3>{"Fireside CTF Challenge"}</h3>
            <p>{"Cryptography and security challenge participation."}</p>
          </article>
          {"\n      "}
          <article data-kind="practice" {...cardProps(18)}>
            <small>{"ONGOING · SINCE 2022 / 2023"}</small>
            <h3>{"TryHackMe CTF Player & Medium Blogger"}</h3>
            <p>{"Hands-on security learning and technical writing."}</p>
            <span className="credential-state active">{"ONGOING"}</span>
          </article>
          {"\n    "}
        </div>
        {"\n    "}
        <div className="deck-controls">
          <button
            type="button"
            id="previousCredential"
            aria-label="Previous credential"
            {...bindings.previousCredential}
          >
            {"Previous"}
          </button>
          <span id="credentialCounter" aria-live="polite">
            {text.credentialCounter}
          </span>
          <button
            type="button"
            id="nextCredential"
            aria-label="Next credential"
            {...bindings.nextCredential}
          >
            {"Next"}
          </button>
        </div>
        {"\n  "}
      </div>
      {"\n"}
    </section>
  );
}
