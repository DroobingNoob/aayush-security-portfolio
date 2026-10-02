import { useState } from "react";
import CredentialsView from "../views/CredentialsView.jsx";
import kinds from "../data/credential-kinds.js";
import useSwipe from "../hooks/useSwipe.js";

export default function Credentials() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(0);
  const deck = kinds.flatMap((kind, index) =>
    filter === "all" || kind === filter ? [index] : [],
  );
  const choose = (delta) =>
    setSelected((index) => (index + delta + deck.length) % deck.length);
  const swipe = useSwipe(choose);
  const filters = Object.fromEntries(
    ["all", "credential", "challenge", "practice"].map((kind) => [
      kind,
      {
        "aria-pressed": filter === kind,
        onClick: () => {
          setFilter(kind);
          setSelected(0);
        },
      },
    ]),
  );
  return (
    <CredentialsView
      bindings={{
        ...filters,
        credentialDeck: swipe,
        previousCredential: { onClick: () => choose(-1) },
        nextCredential: { onClick: () => choose(1) },
      }}
      text={{ credentialCounter: `${selected + 1} / ${deck.length}` }}
      cardProps={(index) => {
        const position = deck.indexOf(index);
        const slot = (position - selected + deck.length) % deck.length;
        return {
          hidden: position < 0,
          inert: position < 0 || slot !== 0,
          "aria-hidden": position < 0 || slot !== 0,
          "data-front": String(position >= 0 && slot === 0),
          style: {
            "--slot": slot,
            zIndex: deck.length - slot,
            opacity: slot > 3 ? 0 : 1 - slot * 0.18,
            visibility: slot > 3 ? "hidden" : "visible",
          },
        };
      }}
    />
  );
}
