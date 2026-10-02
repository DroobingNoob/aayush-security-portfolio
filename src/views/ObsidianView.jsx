export default function ObsidianView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <div className="obs-workspace" id="obsidianDemo" {...bindings.obsidianDemo}>
      {"\n            "}
      <div className="obs-toolbar">
        <strong>{"OBSIDIAN"}</strong>
        <span className="obs-sample">{"SAMPLE DEMO"}</span>
      </div>
      {"\n            "}
      <div className="obs-simple">
        {"\n              "}
        <div id="obsStory" role="status" aria-live="polite" aria-atomic="true">
          {"\n                "}
          <span className="obs-label" id="obsStep">
            {text.obsStep}
          </span>
          {"\n                "}
          <h4 id="obsTitle">{text.obsTitle}</h4>
          {"\n                "}
          <p id="obsText">{text.obsText}</p>
          {"\n                "}
          <div className="obs-result" id="obsResult">
            <strong id="obsResultTitle">{text.obsResultTitle}</strong>
            <span id="obsResultText">{text.obsResultText}</span>
          </div>
          {"\n              "}
        </div>
        {"\n              "}
        <div className="demo-buttons">
          <button id="obsNext" type="button" {...bindings.obsNext}>
            {text.obsNext}
          </button>
          <button
            id="obsBack"
            type="button"
            className="demo-secondary"
            disabled={true}
            {...bindings.obsBack}
          >
            {"Back"}
          </button>
        </div>
        {"\n            "}
      </div>
      {"\n            "}
      <p className="obs-footnote">
        {"Fictional sample data. A short illustration of Obsidian's workflow."}
      </p>
      {"\n          "}
    </div>
  );
}
