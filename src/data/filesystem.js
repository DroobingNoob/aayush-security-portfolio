export function createFilesystem({
  append,
  appendMarkdown,
  clear,
  onPath,
  openLink,
}) {
  const home = "/home/aayush";
  let cwd = home;
  let history = [];
  const directories = new Set([
    home,
    home + "/projects",
    home + "/experience",
    home + "/credentials",
    home + "/links",
  ]);
  const files = {
    [home + "/README.md"]:
      "# Aayush Dasgupta\n\nEnterprise software and application security practitioner.\n\nStart with: ls -la, tree, or cat README.md",
    [home + "/about.txt"]:
      "Aayush Dasgupta\nM.Sc. Enterprise & IT Security — Hochschule Offenburg\nFocus: application security, secure software development, and security architecture.",
    [home + "/projects/obsidian.md"]:
      "# Obsidian\n\nA full-stack platform for authorized security assessment.\nIntegrates Nmap, OWASP ZAP, and Nuclei with evidence normalization, contextual risk scoring, false-positive assessment, and attack-path correlation.\n\nStack: React, TypeScript, Python, FastAPI, Tailwind, Docker.",
    [home + "/projects/geo-encryption.md"]:
      "# Geo-Encryption\n\nLocation-aware encryption prototype that combines a user key with live coordinates to bind decryption to the original geographic context.",
    [home + "/projects/web-application-firewall.md"]:
      "# Web Application Firewall\n\nA Python proxy for HTTP inspection, SQL injection and XSS detection, traffic logging, and rule-based / ML-supported request classification.",
    [home + "/experience/pwc-india.txt"]:
      "PwC India — Associate (2025–2026)\nReact-based enterprise applications in the Guidewire ecosystem.\nBuilt an AI-enabled BRD/FSD/test-case/log-analysis platform adopted by enterprise clients; contributed to three releases across two client projects.",
    [home + "/experience/security-internships.txt"]:
      "CyberSRC Consultancy · Virtually Testing Foundation · Slytherin EduTech\nNetwork mapping, vulnerability assessment, penetration testing, security administration, and cyber-forensics research.",
    [home + "/credentials/certifications.txt"]:
      "Oracle Certified AI Foundations Associate (expires Oct 2027)\nCertified Network Security Practitioner\nCertified AppSec Practitioner\nFundamentals of Network Security — Palo Alto Networks\nFundamentals of Cloud Security — Palo Alto Networks\nFundamentals of SOC — Palo Alto Networks\nRansomware Uncovered Specialist — ICTTF\nOpen Source Intelligence — Basel Institute on Governance\nIntro to Splunk — Splunk\nThreat Hunting Bootcamp 2023 — Virtually Testing Foundation\nFoundations of Operationalizing MITRE ATT&CK — AttackIQ\nDAMNCON 2022 — Damn Secure Pentesting Hub\nGET SET HACK Certificate — RISE\nTryHackMe Pre Security Learning Path\nTryHackMe Advent of Cyber 3 — 2021\nCyber Apocalypse CTF 2022 — Hack The Box\nFireside CTF Challenge — Whizoid Studio LLC\nNSE-1 Network Security Associate — Fortinet (expired Feb 2026)",
    [home + "/credentials/awards.txt"]:
      "3× PwC Change Catalyst Award\nGET SET HACK — Top 100 (76th of 22,000 participants)",
    [home + "/links/linkedin.url"]: "https://linkedin.com/in/aayush-dasgupta",
    [home + "/links/github.url"]: "https://github.com/DroobingNoob",
    [home + "/links/medium.url"]: "https://droobingnoob.medium.com",
  };
  const displayPath = () => (cwd === home ? "~" : "~" + cwd.slice(home.length));
  const updatePrompt = () => onPath(displayPath());
  const resolve = (value = ".") => {
    let raw =
      value === "~"
        ? home
        : value.startsWith("~/")
          ? home + value.slice(1)
          : value.startsWith("/")
            ? value
            : cwd + "/" + value;
    const parts = [];
    raw.split("/").forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") parts.pop();
      else parts.push(part);
    });
    return "/" + parts.join("/");
  };
  const children = (dir) => {
    const base = dir.endsWith("/") ? dir : dir + "/";
    const values = [...directories, ...Object.keys(files)]
      .filter((p) => p.startsWith(base) && !p.slice(base.length).includes("/"))
      .map((p) => ({
        path: p,
        name: p.slice(base.length),
        dir: directories.has(p),
      }));
    return values.sort((a, b) => a.name.localeCompare(b.name));
  };
  const tree = (dir, prefix = "") => {
    const items = children(dir);
    return items.flatMap((item, i) => {
      const last = i === items.length - 1;
      const line =
        prefix + (last ? "└── " : "├── ") + item.name + (item.dir ? "/" : "");
      return item.dir
        ? [line, ...tree(item.path, prefix + (last ? "    " : "│   "))]
        : [line];
    });
  };
  const help =
    "Virtual Linux-like commands:\n  pwd                 print current directory\n  ls [-la] [path]     list directory contents\n  cd [path]           change directory\n  cat <file>          read a portfolio file\n  tree [path]         show the portfolio filesystem\n  find . -type f      list all portfolio files\n  whoami, uname -a    inspect the sandbox\n  open <linkedin|github|medium>\n  clear, history, help\n\nTip: use ↑ / ↓ for command history and Tab for completion.";
  const execute = (raw) => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    const target = resolve(arg || ".");
    if (!cmd) return;
    if (cmd === "help") return append(help);
    if (cmd === "pwd") return append(cwd);
    if (cmd === "clear") {
      clear();
      return;
    }
    if (cmd === "whoami")
      return append("visitor (read-only portfolio sandbox)");
    if (cmd === "uname" && args[0] === "-a")
      return append("AD PortfolioOS 1.0.0 browser-sandbox x86_64");
    if (cmd === "history")
      return history.map((entry, i) =>
        append(String(i + 1).padStart(4, " ") + "  " + entry),
      );
    if (cmd === "cd") {
      const next = resolve(arg || "~");
      if (!directories.has(next))
        return append("cd: " + (arg || "~") + ": No such directory");
      cwd = next;
      updatePrompt();
      return;
    }
    if (cmd === "ls") {
      const lsPath = resolve(args.find((a) => !a.startsWith("-")) || ".");
      if (!directories.has(lsPath))
        return append(
          "ls: cannot access " + (arg || ".") + ": No such directory",
        );
      const long = args.some((a) => a.includes("l"));
      const items = children(lsPath);
      return long
        ? items.forEach((item) =>
            append(
              (item.dir ? "drwxr-xr-x" : "-rw-r--r--") +
                "  portfolio  " +
                item.name +
                (item.dir ? "/" : ""),
            ),
          )
        : append(
            items.map((item) => item.name + (item.dir ? "/" : "")).join("    "),
          );
    }
    if (cmd === "cat") {
      if (!arg) return append("cat: missing file operand");
      if (!files[target]) return append("cat: " + arg + ": No such file");
      return target.endsWith(".md")
        ? appendMarkdown(files[target])
        : append(files[target]);
    }
    if (cmd === "tree") {
      if (!directories.has(target))
        return append("tree: " + (arg || ".") + ": No such directory");
      append((target === home ? "~" : target) + "/");
      tree(target).forEach((line) => append(line));
      return;
    }
    if (cmd === "find") {
      if (args[0] !== "." || (args[1] && args.slice(1).join(" ") !== "-type f"))
        return append("find: supported usage: find . -type f");
      return Object.keys(files)
        .filter((p) => p.startsWith(cwd + "/") || cwd === home)
        .forEach((p) => append("./" + p.slice(cwd.length + 1)));
    }
    if (cmd === "open") {
      const links = {
        linkedin: "https://linkedin.com/in/aayush-dasgupta",
        github: "https://github.com/DroobingNoob",
        medium: "https://droobingnoob.medium.com",
      };
      if (!links[args[0]])
        return append("open: choose linkedin, github, or medium");
      openLink(links[args[0]]);
      return append("Opening " + args[0] + "…");
    }
    append(cmd + ": command not found. Type help for available commands.");
  };

  return {
    history,
    displayPath,
    submit(raw) {
      append("visitor@portfolio:" + displayPath() + "$ " + raw, "ok");
      history.push(raw);
      execute(raw);
    },
  };
}
