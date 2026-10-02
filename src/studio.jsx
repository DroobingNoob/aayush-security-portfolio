import React from "react";
import { createRoot } from "react-dom/client";
import StudioView from "./views/StudioView.jsx";
import useStudioMotion from "./hooks/useStudioMotion.js";
import "./styles/studio.css";
import "./styles/studio-overrides.css";

function Studio() {
  useStudioMotion();
  return <StudioView />;
}

createRoot(document.getElementById("root")).render(<Studio />);
