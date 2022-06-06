import React, { useEffect, useRef, useState } from "react";
import './PointSummary.scss';
import { useSearchParams } from 'react-router-dom';
import { useOnClickOutsideRef } from "../../../../utils/useOnClickOutside";
import { OptionsPanel } from "../../common/OptionsPanel";

interface PropType {
  type: string;
  id: string | number;
  additionalInfo?: {
    [key: string]: string | number;
  };
  compact?: boolean;
  showOptions: boolean;
  enableShowOptions: () => void;
  disableShowOptions: () => void;
}

function getStyleForPointType(type: string) {
  switch (type) {
    case 'TP':
      return 'tp-style';
    case 'GCP':
      return 'gcp-style';
    default:
      return '';
  }
}

function renderCompactContent(type: string, id: string | number) {
  return (
    <>
      <div className="id-text">{id}</div>
    </>
  );
}

function renderContent(
  type: string,
  id: string | number,
  additionalInfo: Map<string, string | number>,
  showOptions: boolean,
  enableShowOptions: () => void,
  disableShowOptions: () => void
) {
  return (
    <>
      <div className="main">
        <div className="id-text">{id}</div>
        <div className="additional-info-container">
          {Array.from(additionalInfo.entries()).map(([key, val]) => (
            <div>
              {key.search('hidden') === -1 && (
                <div className="additional-info-key-text">{key}: </div>
              )}
              <div className="additional-info-value-text">{val}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="gear-container" onClick={enableShowOptions}>
        <span className="material-symbols-outlined">settings</span>
          <div className="options-position">
            <OptionsPanel
              arrow="right"
              options={[
                {text: `Unlink ${type} from current image`, onClick: () => {} },
                {text: `Delete ${type}`, onClick: () => {} }
              ]}
              showOptions={showOptions}
              hideOptions={disableShowOptions}
            />
          </div>
      </div>
    </>
  );
}

export const PointSummary: React.FC<PropType> = ({
  compact,
  type,
  id,
  additionalInfo,
  showOptions,
  enableShowOptions,
  disableShowOptions
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPointId = parseInt(searchParams.get('pointId') as string);
  const selectedPointType = searchParams.get('pointType');
  let content;
  if (compact) content = renderCompactContent(type, id);
  else
    content = renderContent(
      type,
      id,
      new Map(Object.entries(additionalInfo)),
      showOptions,
      enableShowOptions,
      disableShowOptions
    );

  return (
    <div
      className={`point-summary ${getStyleForPointType(type)} ${
        selectedPointId === id && selectedPointType === type ? 'active' : ''
      }`}
      onClick={() => {
        searchParams.set('pointId', String(id));
        searchParams.set('pointType', type);
        setSearchParams(searchParams);
      }}
    >
      {content}
    </div>
  );
};

PointSummary.defaultProps = {
  additionalInfo: {},
  compact: false,
};
