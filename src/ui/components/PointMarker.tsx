import './PointMarker.scss';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PointOnImage } from '../../core/model/slices/common/interfaces';
import { store } from '../../core/model/store';
import {
  setLinkedPointX as setLinkedPointX_TP,
  setLinkedPointY as setLinkedPointY_TP,
} from '../../core/model/slices/tiePointsSlice';
import {
  PointOnImageGCP,
  setLinkedPointX as setLinkedPointX_GCP,
  setLinkedPointY as setLinkedPointY_GCP,
} from '../../core/model/slices/groundControlPointsSlice';

interface PointMarkerAttributes {
  point: PointOnImage | PointOnImageGCP;
  type: 'TP' | 'GCP';
  isMovable?: boolean;
  isSelected?: boolean;
  zoomValue: number;
  wzoom: any;
}

// eslint-disable-next-line import/prefer-default-export
export function PointMarker(props: PointMarkerAttributes) {
  const { point, type, isMovable, isSelected, zoomValue, wzoom } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  if (type === undefined) throw Error('Attribute "type" is required');

  const [dragged, setDragged] = useState('none');

  const [mouseStartingX, setMouseStartingX] = useState(0);
  const [mouseStartingY, setMouseStartingY] = useState(0);
  const [pointStartingX, setPointStartingX] = useState(0);
  const [pointStartingY, setPointStartingY] = useState(0);

  const handleMouseMovement = (e) => {
    document.removeEventListener(
      'mousemove',
      wzoom.dragScrollable._moveHandler
    );

    if (dragged === 'all' || dragged === 'right') {
      if (type === 'TP')
        store.dispatch(
          setLinkedPointX_TP(
            point.pointId,
            point.imageId,
            pointStartingX + Math.floor((e.pageX - mouseStartingX) / zoomValue)
          )
        );
      else
        store.dispatch(
          setLinkedPointX_GCP(
            point.pointId,
            point.imageId,
            pointStartingX + Math.floor((e.pageX - mouseStartingX) / zoomValue)
          )
        );
    }

    if (dragged === 'all' || dragged === 'bottom') {
      if (type === 'TP')
        store.dispatch(
          setLinkedPointY_TP(
            point.pointId,
            point.imageId,
            pointStartingY + Math.floor((e.pageY - mouseStartingY) / zoomValue)
          )
        );
      else
        store.dispatch(
          setLinkedPointY_GCP(
            point.pointId,
            point.imageId,
            pointStartingY + Math.floor((e.pageY - mouseStartingY) / zoomValue)
          )
        );
    }
  };

  const _handleMouseMovement = (e) => handleMouseMovement(e);

  const handleMouseHold = (e, dragType: 'right' | 'bottom' | 'all') => {
    if (e.type === 'mousedown') {
      setDragged(dragType);
      setMouseStartingX(e.pageX);
      setMouseStartingY(e.pageY);
      setPointStartingX(point.x);
      setPointStartingY(point.y);
    } else {
      setDragged('none');
    }
  };

  const _handleMouseHold = (e) => handleMouseHold(e, 'all');

  useEffect(() => {
    document.addEventListener('mouseup', _handleMouseHold);

    return () => {
      document.removeEventListener('mouseup', _handleMouseHold);
    };
  });

  useEffect(() => {
    if (dragged !== 'none') {
      document.addEventListener('mousemove', _handleMouseMovement);
    }

    return () => {
      document.removeEventListener('mousemove', _handleMouseMovement);
    };
  }, [dragged]);

  return (
    <svg
      className="point-marker"
      viewBox="0 0 200 200"
      width="30px"
      height="30px"
      style={{ left: point.x - 8, top: point.y - 8, position: 'absolute' }}
      onClick={() => {
        searchParams.set('pointId', String(point.pointId));
        searchParams.set('pointType', type);
        setSearchParams(searchParams);
      }}
    >
      <circle cx="50" cy="50" r="1" stroke="white" strokeWidth="1" fill="black" />
      {isMovable ? (
        <>
          <g onMouseDown={(e) => handleMouseHold(e, 'right')} visibility={dragged === 'none' || dragged === 'right' ? 'visible' : 'hidden'}>
            <rect x="95" y="30" width="85" height="40" fillOpacity="0" />
            <line x1='95' y1='50' x2='160' y2='50' stroke='black' strokeWidth='8'/>
            <polygon points="160 70, 180 50, 160 30" stroke="black" />
          </g>
          <g onMouseDown={(e) => handleMouseHold(e, 'bottom')} visibility={dragged === 'none' || dragged === 'bottom' ? 'visible' : 'hidden'}>
            <rect x="30" y="95" width="40" height="85" fillOpacity="0" />
            <line x1='50' y1='95' x2='50' y2='160' stroke='black' strokeWidth='8'/>
            <polygon points="70 160, 50 180, 30 160" stroke="black" />
          </g>
        </>
      ) : (
        <></>
      )}
      <circle
        className={`${isSelected ? "point-selected" : ""} outer-circle point-type-${type.toLowerCase()} dragged-${dragged}`}
        cx="50"
        cy="50"
        r="40"
        strokeWidth="15"
        fillOpacity="0"
        onMouseDown={(e) => isMovable ? handleMouseHold(e, "all") : null}
      />
    </svg>
  );
}

PointMarker.defaultProps = {
  isMovable: false,
  isSelected: false,
};
