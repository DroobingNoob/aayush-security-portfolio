export default function WafView({
  bindings = {},
  text = {},
  cardProps,
  slideProps,
  tabProps,
} = {}) {
  return (
    <div className="concept-demo">
      <div className="demo-prompt">
        <span>{"TRY IT / 03"}</span>
        <h4>{"Choose a request to send to the website."}</h4>
      </div>
      {"\n            "}
      <div
        className="request-board"
        id="requestBoard"
        {...bindings.requestBoard}
      >
        <div className="request-node">{"Visitor"}</div>
        <span className="path-arrow">{"→"}</span>
        <div className="request-node firewall">{"Firewall"}</div>
        <span className="path-arrow" id="requestArrow">
          {text.requestArrow}
        </span>
        <div className="request-node" id="websiteNode">
          {text.websiteNode}
        </div>
        <div className="request-packet" id="requestPacket">
          {text.requestPacket}
        </div>
      </div>
      {"\n            "}
      <div className="demo-buttons request-options">
        <button type="button" id="sendSafe" {...bindings.sendSafe}>
          {"Normal visit"}
        </button>
        <button type="button" id="sendSqli" {...bindings.sendSqli}>
          {"SQL injection"}
        </button>
        <button type="button" id="sendXss" {...bindings.sendXss}>
          {"Script injection"}
        </button>
      </div>
      {"\n            "}
      <p className="demo-feedback" id="wafFeedback" role="status">
        {text.wafFeedback}
      </p>
      {"\n          "}
    </div>
  );
}
