import React, { useState } from 'react';
import { PointSummary } from '../points/PointSummary';
import './SideList.scss';
import { Button } from 'react-bootstrap';
import { PointOnImage } from '../../../../core/model/slices/common/interfaces';

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
            <div className="source-group">
              {POINTS_SOURCE_LABEL[source as keyof typeof POINTS_SOURCE_LABEL]}
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
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
