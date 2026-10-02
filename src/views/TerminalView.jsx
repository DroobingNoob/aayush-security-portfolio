export default function TerminalView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <section id="terminal">
      <div className="section-head">
        <b className="mono">{"02"}</b>
        <h2>{"Explore the profile"}</h2>
      </div>
      <div className="terminal-shell">
        <div className="terminal-bar">
          <span>{"AD-PORTFOLIO / BROWSER SANDBOX"}</span>
          <span className="terminal-status">{"● SAFE MODE"}</span>
        </div>
        <div
          className="terminal-output"
          id="terminalOutput"
          ref={bindings.outputRef}
        >
          {text.output}
        </div>
        <label className="terminal-input-row" htmlFor="terminalInput">
          {"visitor@portfolio:"}
          <span id="terminalPath">{text.terminalPath}</span>
          {"$ "}
          <input
            id="terminalInput"
            className="terminal-input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="Portfolio terminal command"
            autoFocus={true}
            {...bindings.terminalInput}
          />
        </label>
      </div>
      <p className="terminal-note">
        {"Try: "}
        <code>{"ls -la"}</code>
        {", "}
        <code>{"cd projects"}</code>
        {", "}
        <code>{"cat obsidian.md"}</code>
        {", "}
        <code>{"tree"}</code>
        {", "}
        <code>{"find . -type f"}</code>
        {", or "}
        <code>{"help"}</code>
        {"."}
      </p>
    </section>
  );
}
