import React, { useLayoutEffect, useRef, useState } from "react";
import TerminalView from "../views/TerminalView.jsx";
import { createFilesystem } from "../data/filesystem.js";

const commands = [
  "help",
  "pwd",
  "ls",
  "cd",
  "cat",
  "tree",
  "find",
  "whoami",
  "uname",
  "open",
  "clear",
  "history",
];
const normalize = (text) => String(text).replace(/\\n/g, "\n");

function MarkdownLine({ row }) {
  const tag = row.startsWith("# ")
    ? "h3"
    : row.startsWith("## ")
      ? "h4"
      : row.startsWith("- ")
        ? "li"
        : "div";
  const style = row.startsWith("# ")
    ? { margin: "12px 0 5px", color: "#a8ff5a", font: "600 16px Manrope" }
    : row.startsWith("## ")
      ? { margin: "10px 0 4px", color: "#d8e3e8", font: "600 14px Manrope" }
      : !row
        ? { height: "8px" }
        : undefined;
  return React.createElement(tag, { style }, row.replace(/^#{1,2}\s|^-\s/, ""));
}

export default function Terminal() {
  const [value, setValue] = useState("");
  const [path, setPath] = useState("~");
  const [rows, setRows] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const output = useRef(null);
  const historyIndex = useRef(0);
  const filesystem = useRef(null);
  if (!filesystem.current) {
    const appendRows = (text, props) =>
      setRows((previous) => [
        ...previous,
        ...normalize(text)
          .split("\n")
          .map((row) => ({ row, ...props })),
      ]);
    filesystem.current = createFilesystem({
      append: (text, className = "") => appendRows(text, { className }),
      appendMarkdown: (text) => appendRows(text, { markdown: true }),
      clear: () => {
        setRows([]);
        setShowWelcome(false);
      },
      onPath: setPath,
      openLink: (url) => window.open(url, "_blank", "noopener"),
    });
  }
  useLayoutEffect(() => {
    output.current.scrollTop = output.current.scrollHeight;
  }, [rows]);
  function onKeyDown(event) {
    const fs = filesystem.current;
    if (event.key === "Enter") {
      const raw = value.trim();
      if (!raw) return;
      fs.submit(raw);
      historyIndex.current = fs.history.length;
      setValue("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex.current > 0)
        setValue(fs.history[--historyIndex.current]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex.current < fs.history.length - 1)
        setValue(fs.history[++historyIndex.current]);
      else {
        historyIndex.current = fs.history.length;
        setValue("");
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const match = commands.find((command) =>
        command.startsWith(value.trim()),
      );
      if (match)
        setValue(match + (["cd", "cat", "open"].includes(match) ? " " : ""));
    }
  }
  return (
    <TerminalView
      bindings={{
        outputRef: output,
        terminalInput: {
          value,
          onChange: (event) => setValue(event.target.value),
          onKeyDown,
        },
      }}
      text={{
        terminalPath: path,
        output: (
          <>
            {showWelcome && (
              <>
                <div className="ok">
                  # Welcome to Aayush’s portfolio filesystem
                </div>
                <div className="hint">
                  You are in a read-only browser sandbox. No command reaches a
                  server.
                </div>
                <div className="hint">
                  {"Start with "}
                  <span className="ok">ls</span>
                  {", "}
                  <span className="ok">tree</span>
                  {", or "}
                  <span className="ok">help</span>
                  {"."}
                </div>
              </>
            )}
            {rows.map((line, index) =>
              line.markdown ? (
                <MarkdownLine key={index} row={line.row} />
              ) : (
                <div key={index} className={line.className || undefined}>
                  {line.row}
                </div>
              ),
            )}
          </>
        ),
      }}
    />
  );
}
