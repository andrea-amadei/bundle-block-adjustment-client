import React, { useState } from "react";
import './PointInspector.scss';
import { InputField } from '../../common/InputField';
import { FieldsContainer } from '../../common/FieldsContainer';
import { ImagePreview } from '../images/ImagePreview';
import { LinkNewImgPopup } from "./LinkNewImagePopup";
import { useSelector } from "react-redux";
import { selectAllImages } from "../../../../core/model/slices/imageListSlice";

interface PointInspectorPropType {
  pointType: string;
  pointId: number;
  imgId: number;
  pointX: number;
  setPointX: (x: number) => void;
  pointY: number;
  setPointY: (y: number) => void;
  linkedImg: Array<{
    id: number;
    name: string;
    url: string;
  }>;
  additionalGlobalFields?: any;
}

export const PointInspector: React.FC<PointInspectorPropType> = ({
  pointType,
  pointId,
  imgId,
  linkedImg,
  pointX,
  pointY,
  setPointX,
  setPointY,
  additionalGlobalFields,
}) => {

  const imageList = useSelector(selectAllImages);

  const [showLinkNewImgPopup, setShowNewImgPopup] = useState(false);

  return (
    <div className="point-inspector-component">
      {showLinkNewImgPopup &&
        <LinkNewImgPopup
          show={showLinkNewImgPopup}
          hidePopup={() => setShowNewImgPopup(false)}
          pointType={pointType}
          pointId={pointId}
          images={imageList.map( img => ({title: img.name, id: img.id, src: img.path}))}
          initiallySelectedImagesId={linkedImg.map( img => img.id)}
        />
      }
      <div className="header">{`${pointType} ${pointId}`}</div>
      <FieldsContainer title="Image based TP properties">
        <div className="point-local">
          <div className="point-position">
            <InputField
              type="number"
              label="X"
              value={pointX}
              setValue={setPointX}
            />
            <InputField
              type="number"
              label="Y"
              value={pointY}
              setValue={setPointY}
            />
          </div>
        </div>
      </FieldsContainer>
      <FieldsContainer title="Global TP properties">
        <div className="point-global">
          {additionalGlobalFields}
          <div className="linked-img-container">
            <div className="group-header">
              <div className="linked-img-text"> Images linked to TP</div>
              <div className="add-btn" onClick={() => setShowNewImgPopup(true)}>
                <span className="material-symbols-outlined btn"> add </span>
              </div>
            </div>
            <div className="linked-img">
              {linkedImg.map((img) => (
                <ImagePreview
                  key={img.id}
                  imageId={img.id}
                  imageName={img.name}
                  imageUrl={img.url}
                />
              ))}
            </div>
          </div>
        </div>
      </FieldsContainer>
    </div>
  );
};
