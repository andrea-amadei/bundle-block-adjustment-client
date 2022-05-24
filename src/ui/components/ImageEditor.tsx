import './ImageEditor.scss';

import { useMatch, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import WZoom from 'vanilla-js-wheel-zoom';
import { selectImageById } from '../../core/model/slices/imageListSlice';
import { selectTiePointsOnImage } from '../../core/model/slices/tiePointsSlice';
import { selectGroundControlPointsOnImage } from '../../core/model/slices/groundControlPointsSlice';
import { PointMarker } from './PointMarker';

// eslint-disable-next-line import/prefer-default-export
export function ImageEditor() {
  const { selectedImageId } = useParams();
  const match = useMatch("/editor/:imgId/:pointType/:pointId");
  const selectedPointId = match?.params.pointId ? parseInt(match?.params.pointId) : undefined;
  const selectedPointType = match?.params.pointType;
  console.log("ie", selectedPointId, selectedPointType)

  if (!selectedImageId) throw new Error('No image selected!');

  const selectedImage = useSelector(
    selectImageById(parseInt(selectedImageId, 10))
  );

  const tpList = useSelector(
    selectTiePointsOnImage(parseInt(selectedImageId, 10))
  );
  const gcpList = useSelector(
    selectGroundControlPointsOnImage(parseInt(selectedImageId, 10))
  );

  const canvasRef = useRef(null);
  const groupRef = useRef(null);
  const imgRef = useRef(null);
  const inputRangeRef = useRef(null);

  const [wzoom, setWzoom] = useState(null);
  const [zoomValue, setZoomValue] = useState(1);
  const [isLocked, setLocked] = useState(true);
  const [isTPVisible, setTPVisible] = useState(true);
  const [isGCPVisible, setGCPVisible] = useState(true);

  let scale;

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'NumpadAdd':
        wzoom?.zoomUp();
        break;
      case 'NumpadSubtract':
        wzoom?.zoomDown();
        break;
      default:
        break;
    }
  };

  useLayoutEffect(() => {
    scale = 0.5 * Math.min(
        canvasRef.current.clientWidth / groupRef.current.clientWidth,
        canvasRef.current.clientHeight / groupRef.current.clientHeight
      );

    setWzoom(
      WZoom.create('.editor-group', {
        type: 'html',
        zoomOnClick: false,
        smoothExtinction: 0,
        minScale: scale,
        maxScale: 30,
        speed: 1 / scale,
        watchImageChange: false,
        dragScrollable: true,
        dragScrollableOptions: {
          smoothExtinction: 0,
          onGrab() {
            canvasRef.current.style.cursor = 'grabbing';
          },
          onDrop() {
            canvasRef.current.style.cursor = 'grab';
          },
        },
      })
    );
  }, [canvasRef]);

  const initialize = () => {
    if (wzoom != null) {
      wzoom.prepare();
      wzoom.options.rescale = () => setZoomValue(wzoom?.content.currentScale);
      wzoom.zoomUp();

      inputRangeRef.current.min = wzoom.options.minScale;
      inputRangeRef.current.defaultValue = wzoom.options.minScale;
      inputRangeRef.current.max = wzoom.options.maxScale;
      inputRangeRef.current.step = 1 / wzoom.options.speed;
      setZoomValue(wzoom.content.currentScale);

      window.addEventListener('keypress', handleKeyDown);

      groupRef.current.removeEventListener('mousedown', wzoom.dragScrollable._grabHandler);
      groupRef.current.addEventListener('mousedown', wzoom.dragScrollable._grabHandler);
    }
  };

  useEffect(() => {
    initialize();

    window.addEventListener('keypress', handleKeyDown);
    return () => window.removeEventListener('keypress', handleKeyDown);
  }, [wzoom]);

  if (selectedImage)
    return (
      <div className="editor-img-container">
        <div className="img-header">
          <div className="img-title">
            {`[${selectedImage.id}] ${selectedImage.name}`}
          </div>
          <div className="img-controls">
            <div className="img-controls-points" style={{ marginRight: '5%' }}>
              <input type="checkbox" id="tp-checkbox" checked={isTPVisible} onChange={() => setTPVisible(!isTPVisible)} />
              <label htmlFor="tp-checkbox">TP</label>
              <input type="checkbox" id="gcp-checkbox" checked={isGCPVisible} onChange={() => setGCPVisible(!isGCPVisible)} />
              <label htmlFor="gcp-checkbox">GCP</label>
              <button onClick={() => setLocked(!isLocked)}>{isLocked ? 'X' : '_'}</button>
            </div>
            <span className="img-controls-label">Zoom</span>
            <input type="range" ref={inputRangeRef} value={zoomValue} onInput={() =>
                Number(inputRangeRef.current.value) > wzoom.content.currentScale
                  ? wzoom.zoomUp()
                  : wzoom.zoomDown()
              }
            />
            <button onClick={() => wzoom?.zoomUp()}>+</button>
            <button onClick={() => wzoom?.zoomDown()}>-</button>
          </div>
        </div>
        <div className="editor-canvas" ref={canvasRef}>
          <div className="editor-group" ref={groupRef}>
            <img className="editor-img" ref={imgRef} src={selectedImage.path} alt={selectedImage.path}/>
            <div className="editor-points">
              {isTPVisible
                ? tpList.map((tp) => (
                  <PointMarker
                    point={tp}
                    zoomValue={zoomValue}
                    wzoom={wzoom}
                    type="TP"
                    isMovable={!isLocked && selectedPointType === "TP" && selectedPointId === tp.pointId}
                    isSelected={selectedPointType === "TP" && selectedPointId === tp.pointId}
                  />
                )) : null
              }
              {isGCPVisible
                ? gcpList.map((gcp) => (
                  <PointMarker
                    point={gcp}
                    zoomValue={zoomValue}
                    wzoom={wzoom}
                    type="GCP"
                    isMovable={!isLocked && selectedPointType === "GCP" && selectedPointId === gcp.pointId}
                    isSelected={selectedPointType === "GCP" && selectedPointId === gcp.pointId}
                  />
                )) : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  return <div>Loading...</div>;
}
