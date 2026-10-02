export default function GeoView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <div className="concept-demo">
      <div className="demo-prompt">
        <span>{"TRY IT / 02"}</span>
        <h4>{"Can you open the file from somewhere else?"}</h4>
      </div>
      {"\n            "}
      <div
        className="location-board"
        id="locationBoard"
        {...bindings.locationBoard}
      >
        <div className="location-home">{"ORIGINAL LOCATION"}</div>
        <div className="location-file" id="locationFile">
          <span>{"PRIVATE FILE"}</span>
          <strong id="fileState">{text.fileState}</strong>
          <small id="fileContent">{text.fileContent}</small>
        </div>
      </div>
      {"\n            "}
      <label className="demo-range" htmlFor="fileLocation">
        {"Move the file "}
        <span id="locationLabel">{text.locationLabel}</span>
        <input
          id="fileLocation"
          type="range"
          min="0"
          max="100"
          value="0"
          {...bindings.fileLocation}
        />
        <span className="range-endpoints">
          <span>{"Original location"}</span>
          <span>{"Somewhere else"}</span>
        </span>
      </label>
      {"\n            "}
      <label className="demo-check">
        <input
          id="correctKey"
          type="checkbox"
          checked={true}
          {...bindings.correctKey}
        />
        {" Use the correct key"}
      </label>
      {"\n            "}
      <p className="demo-feedback" id="geoFeedback" role="status">
        {text.geoFeedback}
      </p>
      {"\n          "}
    </div>
  );
}
