import React from "react";
import "./PointSummary.scss";

interface PropType {
  type: string,
  id: string | number,
  additionalInfo?: {
    [key: string]: string | number
  },
  compact?: boolean
}

function getStyleForPointType(type: string) {
  switch (type) {
    case "TP":
      return "tp-style";
    case "GCP":
      return "gcp-style";
    default:
      return "";
  }
}

function renderCompactContent(type: string, id: string | number) {
  return (
    <>
      <div className="id-text">{id}</div>
    </>
  );
}

function renderContent(type: string, id: string | number, additionalInfo: Map<string, string|number>) {
  return (
    <>
      <div className="id-text">{id}</div>
      <div className="additional-info-container">
        {Array.from(additionalInfo.entries()).map(([key, val]) => (
          <div>
            {key.search("hidden") === -1 && <div className="additional-info-key-text">{key}: </div>}
            <div className="additional-info-value-text">{val}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export const PointSummary: React.FC<PropType> = ({compact, type, id, additionalInfo}) => {


  let content;
  if(compact)
    content = renderCompactContent(type, id);
  else
    content = renderContent(type, id, new Map(Object.entries(additionalInfo)));

  return (
    <div className={"point-summary "+getStyleForPointType(type)}>
      {content}
    </div>
  );
}



PointSummary.defaultProps = {
  additionalInfo: {},
  compact: false
}