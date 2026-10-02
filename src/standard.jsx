import React from "react";
import { createRoot } from "react-dom/client";
import StandardView from "./views/StandardView.jsx";
import "./styles/standard.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <StandardView
    bindings={{
      studioToggle: {
        onClick: () => {
          window.location.href = "studio.html";
        },
      },
    }}
  />,
);
