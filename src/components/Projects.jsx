import { useState } from "react";
import ProjectsView from "../views/ProjectsView.jsx";
import useSwipe from "../hooks/useSwipe.js";

export default function Projects() {
  const [selected, setSelected] = useState(0);
  const choose = (delta) => setSelected((index) => (index + delta + 3) % 3);
  const swipe = useSwipe(choose, true);
  return (
    <ProjectsView
      bindings={{
        previousProject: { onClick: () => choose(-1) },
        nextProject: { onClick: () => choose(1) },
        projectCarouselStage: swipe,
      }}
      text={{ projectCounter: `${selected + 1} / 3` }}
      tabProps={(index) => ({
        "aria-pressed": selected === index,
        onClick: () => setSelected(index),
      })}
      slideProps={(index) => ({
        className: `project-slide${index === 0 ? " obsidian-slide" : ""}${selected === index ? " is-active" : ""}`,
        inert: selected !== index,
        "aria-hidden": selected !== index,
      })}
    />
  );
}
