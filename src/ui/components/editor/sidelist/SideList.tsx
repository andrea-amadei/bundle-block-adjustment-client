import React, { useEffect, useRef, useState } from "react";
import { PointSummary } from '../points/PointSummary';
import './SideList.scss';
import { Button } from 'react-bootstrap';
import { PointOnImage } from '../../../../core/model/slices/common/interfaces';
import { useOnClickOutsideRef } from "../../../../utils/useOnClickOutside";

interface PropType {
  pointType: 'TP' | 'GCP';
  points: {
    manual: PointOnImage[];
    imported: PointOnImage[];
    auto?: PointOnImage[];
  };
}

const POINTS_SOURCE_LABEL = {
  manual: 'MANUAL',
  imported: 'IMPORTED',
  auto: 'AUTO',
} as const;

export const SideList: React.FC<PropType> = ({ pointType, points }) => {
  const [isCompact, setIsCompact] = useState(false);
  const [showOptionsForPointId, setShowOptionsForPointId] = useState<number | null>(null);
  useEffect(
    () => { if(isCompact) setShowOptionsForPointId(null);},
    [isCompact]
  );

  let compactBtn;
  if (isCompact) {
    compactBtn = (
      <Button className="compact-btn" onClick={() => setIsCompact(false)}>
        {'<->'}
      </Button>
    );
  } else {
    compactBtn = (
      <Button className="compact-btn" onClick={() => setIsCompact(true)}>
        {'>-<'}
      </Button>
    );
  }

  return (
    <div className="point-side-list-container">
      <div className="point-side-list-header">{compactBtn}</div>
      <div className="source-groups-container">
        {Object.entries(points)
          .filter(([source, pointList]) => pointList.length > 0)
          .map(([source, pointList]) => (
            <div className="source-group" key={source}>>
              <div className="group-header">
                {POINTS_SOURCE_LABEL[source as keyof typeof POINTS_SOURCE_LABEL]}
                {source === 'manual' &&
                  <div className="add-btn">
                    <span className="material-symbols-outlined btn"> add </span>
                  </div>
                }
              </div>
              <hr className="divider" />
              <div className={`point-side-list ${isCompact ? 'compact' : ''}`}>
                {pointList.map((tp) => (
                  <PointSummary
                    type={pointType}
                    id={tp.pointId}
                    additionalInfo={{
                      'key-hidden': `(${tp.x}, ${tp.y})`,
                    }}
                    compact={isCompact}
                    key={tp.pointId}
                    showOptions={showOptionsForPointId === tp.pointId}
                    enableShowOptions={() => setShowOptionsForPointId(tp.pointId)}
                    disableShowOptions={() => setShowOptionsForPointId(null)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
