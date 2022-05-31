import React from 'react';
import './PointInspector.scss';
import { InputField } from '../common/InputField';
import { FieldsContainer } from "../common/FieldsContainer";
import { ImagePreview } from "./ImagePreview";

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
    linkPath: string;
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
  additionalGlobalFields
}) => {
  return (
    <div className="point-inspector-component">
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
            <div className="linked-img-text"> Images linked to TP</div>
            <div className="linked-img">
              {linkedImg.map(img => (
                <ImagePreview
                  key={img.id}
                  imageId={img.id}
                  imageName={img.name}
                  imageUrl={img.url}
                  linkPath={img.linkPath}
                />
              ))}
            </div>
          </div>
        </div>
      </FieldsContainer>
    </div>
  );
};
