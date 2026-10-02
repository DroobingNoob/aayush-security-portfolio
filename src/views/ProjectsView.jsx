import { ObsidianDemo, GeoDemo, WafDemo } from "../components/Demos.jsx";
export default function ProjectsView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <section
      className="scene projects-stage"
      id="projects"
      aria-label="selected security projects"
    >
      {"\n    "}
      <div className="chapter">
        <div className="eyebrow">{"02 / SELECTED SECURITY PROJECTS"}</div>
        <h2>
          {"Try the idea."}
          <br />
          <i>{"See what changes."}</i>
        </h2>
        <p className="statement">
          {"Three security projects. A small experiment inside each one."}
        </p>
      </div>
      {"\n    "}
      <div
        className="project-carousel"
        id="projectCarousel"
        aria-roledescription="carousel"
        aria-label="Selected security projects"
      >
        {"\n      "}
        <div
          className="project-tabs"
          role="group"
          aria-label="Choose a project"
        >
          <button
            className="project-tab"
            type="button"
            aria-pressed="true"
            {...tabProps(0)}
          >
            {"01 / OBSIDIAN"}
          </button>
          <button
            className="project-tab"
            type="button"
            aria-pressed="false"
            {...tabProps(1)}
          >
            {"02 / GEO-ENCRYPTION"}
          </button>
          <button
            className="project-tab"
            type="button"
            aria-pressed="false"
            {...tabProps(2)}
          >
            {"03 / WAF"}
          </button>
        </div>
        {"\n      "}
        <div
          className="project-carousel-stage"
          id="projectCarouselStage"
          {...bindings.projectCarouselStage}
        >
          {"\n        "}
          <article
            className="project-slide obsidian-slide is-active"
            aria-hidden="false"
            {...slideProps(0)}
          >
            {"\n          "}
            <div className="project-copy">
              <small>{"OBSIDIAN / INTERACTIVE PREVIEW"}</small>
              <h3>
                {"From scan results"}
                <br />
                {"to "}
                <i>{"what matters."}</i>
              </h3>
              <p>
                {
                  "Multiple scanners can leave you with repeated warnings and little context. Obsidian connects the evidence so you can decide what needs attention, what needs validation, and what to fix."
                }
              </p>
              <p className="project-tech">
                {"REACT · TYPESCRIPT · PYTHON · FASTAPI · DOCKER"}
              </p>
            </div>
            {"\n          "}
            <ObsidianDemo />
            {"\n        "}
          </article>
          {"\n        "}
          <article
            className="project-slide"
            aria-hidden="true"
            inert={true}
            {...slideProps(1)}
          >
            {"\n          "}
            <div className="project-copy">
              <small>{"GEO-ENCRYPTION"}</small>
              <h3>
                {"The right key."}
                <br />
                <i>{"The right place."}</i>
              </h3>
              <p>
                {
                  "A location-based encryption system that combines a user key with geographic coordinates. Decryption depends on returning to the original location."
                }
              </p>
              <p className="project-tech">
                {"GEOLOCATION APIS · CUSTOM ENCRYPTION LOGIC"}
              </p>
            </div>
            {"\n          "}
            <GeoDemo />
            {"\n        "}
          </article>
          {"\n        "}
          <article
            className="project-slide"
            aria-hidden="true"
            inert={true}
            {...slideProps(2)}
          >
            {"\n          "}
            <div className="project-copy">
              <small>{"WEB APPLICATION FIREWALL"}</small>
              <h3>
                {"Let good traffic in."}
                <br />
                <i>{"Stop the threat."}</i>
              </h3>
              <p>
                {
                  "A Python proxy that inspects HTTP requests for SQL injection and XSS patterns, logs features, and classifies traffic before forwarding it."
                }
              </p>
              <p className="project-tech">
                {"PYTHON · HTTP INSPECTION · REQUEST CLASSIFICATION"}
              </p>
            </div>
            {"\n          "}
            <WafDemo />
            {"\n        "}
          </article>
          {"\n      "}
        </div>
        {"\n      "}
        <div className="project-footer">
          <span className="demo-caption">
            {"Simplified examples with sample data."}
          </span>
          <div className="project-carousel-nav">
            <button
              type="button"
              id="previousProject"
              aria-label="Previous project"
              {...bindings.previousProject}
            >
              {"←"}
            </button>
            <span id="projectCounter" aria-live="polite">
              {text.projectCounter}
            </span>
            <button
              type="button"
              id="nextProject"
              aria-label="Next project"
              {...bindings.nextProject}
            >
              {"→"}
            </button>
          </div>
        </div>
        {"\n    "}
      </div>
      {"\n  "}
    </section>
  );
}
