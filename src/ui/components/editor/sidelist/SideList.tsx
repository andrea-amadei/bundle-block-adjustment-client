import React, { useEffect, useRef, useState } from "react";
import { PointSummary } from '../points/PointSummary';
import './SideList.scss';
import { Button } from 'react-bootstrap';
import { PointOnImage } from '../../../../core/model/slices/common/interfaces';
import { useOnClickOutsideRef } from "../../../../utils/useOnClickOutside";
import { useSearchParams } from "react-router-dom";
import { store } from "../../../../core/model/store";

interface PropType {
  pointType: 'TP' | 'GCP';
  points: {
    manual: PointOnImage[];
    imported: PointOnImage[];
    auto?: PointOnImage[];
  };
  addPoint: () => void;
  unlinkPoint: (pointId: number, imageId: number) => void;
  deletePoint: (pointId: number) => void;
}

const POINTS_SOURCE_LABEL = {
  manual: 'MANUAL',
  imported: 'IMPORTED',
  auto: 'AUTO',
} as const;

export const SideList: React.FC<PropType> = (
  { pointType, points , addPoint, unlinkPoint, deletePoint}
) => {
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
        <span className="material-symbols-outlined">expand_more</span>
      </Button>
    );
  } else {
    compactBtn = (
      <Button className="compact-btn" onClick={() => setIsCompact(true)}>
        <span className="material-symbols-outlined">expand_less</span>
      </Button>
    );
  }

  return (
    <div className="point-side-list-container">
      <div className="point-side-list-header">{compactBtn}</div>
      <div className="source-groups-container-wrapper">
        <div className="source-groups-container">
          {Object.entries(points)
            .filter(([source, pointList]) => pointList.length > 0 || source === 'manual')
            .map(([source, pointList]) => (
              <div className="source-group" key={source}>
                <div className="group-header">
                  {POINTS_SOURCE_LABEL[source as keyof typeof POINTS_SOURCE_LABEL]}
                  {source === 'manual' &&
                    <div className="add-btn" onClick={addPoint}>
                      <span className="material-symbols-outlined btn"> add </span>
                    </div>
                  }
                </div>
                { pointList.length > 0 && <hr className="divider" /> }
                <div className={`point-side-list ${isCompact ? 'compact' : ''}`}>
                  {pointList.map((pointOnImg) => (
                    <PointSummary
                      type={pointType}
                      id={pointOnImg.pointId}
                      additionalInfo={{
                        'key-hidden': `(${pointOnImg.x}, ${pointOnImg.y})`,
                      }}
                      compact={isCompact}
                      key={pointOnImg.pointId}
                      showOptions={showOptionsForPointId === pointOnImg.pointId}
                      enableShowOptions={() => setShowOptionsForPointId(pointOnImg.pointId)}
                      disableShowOptions={() => setShowOptionsForPointId(null)}
                      unlinkPoint={() => unlinkPoint(pointOnImg.pointId, pointOnImg.imageId)}
                      deletePoint={() => deletePoint(pointOnImg.pointId)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
