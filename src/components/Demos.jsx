import { useState } from "react";
import ObsidianView from "../views/ObsidianView.jsx";
import GeoView from "../views/GeoView.jsx";
import WafView from "../views/WafView.jsx";

const steps = [
  [
    "THE PROBLEM",
    "Six warnings. Where do you start?",
    "Three security tools checked a sample shop. Some warnings describe the same problem.",
    "6 scanner reports",
    "From Nmap, ZAP, and Nuclei",
    "Make sense of the results",
  ],
  [
    "THE PRIORITY",
    "Start with the exposed debug page.",
    "Obsidian groups repeated reports into three issues. The public debug page deserves attention first because it reveals internal details.",
    "6 reports → 3 issues",
    "One priority: internal details visible to visitors",
    "Show me what to do",
  ],
  [
    "THE NEXT STEP",
    "Close the exposure. Check again.",
    "Disable public debug output, then check that visitors can no longer see internal details. Keep the evidence from both scanners with the issue.",
    "A clear action, backed by evidence",
    "The old-server warning still needs validation; a banner alone does not prove a vulnerability.",
    "Try again",
  ],
];

export function ObsidianDemo() {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  return (
    <ObsidianView
      bindings={{
        obsidianDemo: { "data-step": String(index) },
        obsNext: { onClick: () => setIndex((i) => (i + 1) % steps.length) },
        obsBack: {
          disabled: index === 0,
          onClick: () => setIndex((i) => Math.max(0, i - 1)),
        },
      }}
      text={{
        obsStep: `${index + 1} / 3 · ${step[0]}`,
        obsTitle: step[1],
        obsText: step[2],
        obsResultTitle: step[3],
        obsResultText: step[4],
        obsNext: step[5],
      }}
    />
  );
}

export function GeoDemo() {
  const [distance, setDistance] = useState(0);
  const [correctKey, setCorrectKey] = useState(true);
  const original = distance === 0;
  const unlocked = original && correctKey;
  return (
    <GeoView
      bindings={{
        locationBoard: {
          className: `location-board${unlocked ? "" : " locked"}`,
          style: { "--distance": distance + "%" },
        },
        fileLocation: {
          value: distance,
          onChange: (event) => setDistance(Number(event.target.value)),
        },
        correctKey: {
          checked: correctKey,
          onChange: (event) => setCorrectKey(event.target.checked),
        },
      }}
      text={{
        fileState: unlocked ? "Unlocked" : "Locked",
        fileContent: unlocked ? "Meeting at 10:00" : "•••• •••• ••••",
        locationLabel: original
          ? "At original location"
          : "Away from original location",
        geoFeedback: !correctKey
          ? "The key is wrong. Returning to the original location alone cannot unlock the file."
          : original
            ? "Correct key + original location: the file opens. Try moving it away."
            : "The key is correct, but the location has changed. Move all the way back to unlock the file.",
      }}
    />
  );
}

const requests = {
  Safe: [
    "allowed",
    "Allowed",
    "Normal visit delivered. The request passes inspection and reaches the website.",
  ],
  Sqli: [
    "blocked",
    "Blocked · SQL injection",
    "Stopped at the firewall. This sample tries to change a database query through user input.",
  ],
  Xss: [
    "blocked",
    "Blocked · script injection",
    "Stopped at the firewall. This sample tries to insert a script into a page a visitor would open.",
  ],
};

export function WafDemo() {
  const [request, setRequest] = useState(null);
  const allowed = request?.[0] === "allowed";
  return (
    <WafView
      bindings={{
        requestBoard: {
          className: `request-board${request ? " " + request[0] : ""}`,
        },
        ...Object.fromEntries(
          Object.entries(requests).map(([name, detail]) => [
            "send" + name,
            { onClick: () => setRequest(detail) },
          ]),
        ),
      }}
      text={{
        requestArrow: !request || allowed ? "→" : "×",
        websiteNode: !request ? "Website" : allowed ? "Received" : "Protected",
        requestPacket: request?.[1] || "Choose below",
        wafFeedback:
          request?.[2] ||
          "Send a normal visit first, then try an attack to compare the paths.",
      }}
    />
  );
}
