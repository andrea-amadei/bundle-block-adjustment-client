import './ImageEditor.scss';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import WZoom from 'vanilla-js-wheel-zoom';
import { selectImageById } from '../../core/model/slices/imageListSlice';
import { selectAllTiePoints, selectTiePointsOnImage } from '../../core/model/slices/tiePointsSlice';
import { selectAllGroundControlPoints } from '../../core/model/slices/groundControlPointsSlice';
import { PointMarker } from './PointMarker';

// eslint-disable-next-line import/prefer-default-export
export function ImageEditor() {
  const { selectedImageId } = useParams();

  if (!selectedImageId) throw new Error('No image selected!');

  const selectedImage = useSelector(selectImageById(selectedImageId));
  const tpList = useSelector(
    selectTiePointsOnImage(parseInt(selectedImageId, 10))
  );
  const gcpList = useSelector(selectAllGroundControlPoints);

  const canvasRef = useRef(null);
  const groupRef = useRef(null);
  const imgRef = useRef(null);
  const inputRangeRef = useRef(null);

  let [wzoom, setWzoom] = useState(null);
  let [zoomValue, setZoomValue] = useState(1);
  let [isLocked, setLocked] = useState(true);

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
            <button style={{ marginRight: '5%' }} onClick={() => setLocked(!isLocked)}>{isLocked ? 'X' : '_'}</button>
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
              {tpList.map((tp) => (
                <PointMarker point={tp} zoomValue={zoomValue} wzoom={wzoom} type="TP" isMovable={!isLocked} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  return <div>Loading...</div>;
}
