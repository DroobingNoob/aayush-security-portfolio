import { useEffect } from "react";
export default function useStudioMotion() {
  useEffect(() => {
    const cleanups = [];
    const scroller = document.getElementById("studioScroll");
    const scenes = [...scroller.querySelectorAll(".scene")];
    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const previous = document.getElementById("previousChapter");
    const next = document.getElementById("nextChapter");
    const counter = document.getElementById("chapterCounter");
    const progress = document.querySelector(".progress");
    let active = -1,
      frame = 0;

    // Observe the actual scrollport. Never write scroll position from a scroll event.
    function update() {
      frame = 0;
      const viewport = scroller.getBoundingClientRect();
      const focusLine = viewport.top + scroller.clientHeight * 0.45;
      let index = 0;
      scenes.forEach((scene, i) => {
        const bounds = scene.getBoundingClientRect();
        if (bounds.top <= focusLine) index = i;
        if (
          !reduced.matches &&
          bounds.bottom > viewport.top &&
          bounds.top < viewport.bottom
        ) {
          scene.style.setProperty(
            "--drift",
            Math.max(-45, Math.min(45, (viewport.top - bounds.top) * 0.09)) +
              "px",
          );
        }
      });
      if (index !== active) {
        active = index;
        scenes.forEach((scene, i) =>
          scene.classList.toggle("is-active", i === active),
        );
        counter.textContent =
          String(active + 1).padStart(2, "0") +
          " / " +
          String(scenes.length).padStart(2, "0");
        previous.disabled = active === 0;
        next.disabled = active === scenes.length - 1;
      }
      const range = scroller.scrollHeight - scroller.clientHeight;
      progress.style.width =
        (range > 0 ? (scroller.scrollTop / range) * 100 : 0) + "%";
    }
    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function goTo(index) {
      const scene = scenes[Math.max(0, Math.min(scenes.length - 1, index))];
      const top =
        scene.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop;
      scroller.scrollTo({
        top,
        behavior: reduced.matches ? "instant" : "smooth",
      });
    }
    listen(scroller, "scroll", scheduleUpdate, { passive: true });
    listen(window, "resize", scheduleUpdate);
    listen(previous, "click", () => goTo(active - 1));
    listen(next, "click", () => goTo(active + 1));
    listen(scroller, "keydown", (event) => {
      if (
        event.target !== scroller ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      const destinations = {
        PageDown: active + 1,
        PageUp: active - 1,
        Home: 0,
        End: scenes.length - 1,
      };
      if (event.key in destinations) {
        event.preventDefault();
        goTo(destinations[event.key]);
      }
    });
    update();

    // Pointer depth affects surfaces only, never chapter geometry or scroll position.
    document.querySelectorAll(".tilt-card").forEach((card) => {
      listen(card, "pointermove", (event) => {
        if (reduced.matches || event.pointerType !== "mouse") return;
        const box = card.getBoundingClientRect();
        card.style.setProperty(
          "--rx",
          (-(event.clientY - box.top) / box.height) * 10 + 5 + "deg",
        );
        card.style.setProperty(
          "--ry",
          ((event.clientX - box.left) / box.width) * 12 - 6 + "deg",
        );
      });
      listen(card, "pointerleave", () => {
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
    const hero = document.querySelector(".hero");
    const portrait = hero.querySelector("img");
    listen(hero, "pointermove", (event) => {
      if (reduced.matches || event.pointerType !== "mouse") return;
      const box = hero.getBoundingClientRect();
      portrait.style.setProperty(
        "--px",
        ((event.clientX - box.left) / box.width - 0.5) * 18 + "px",
      );
      portrait.style.setProperty(
        "--ry",
        ((event.clientX - box.left) / box.width - 0.5) * 12 + "deg",
      );
    });
    listen(hero, "pointerleave", () => {
      portrait.style.removeProperty("--px");
      portrait.style.removeProperty("--ry");
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
