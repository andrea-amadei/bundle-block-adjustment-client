import React, { useEffect, useState } from "react";
import "./LinkNewImgPopup.scss"

interface PointInspectorPropType {
  pointType: string;
  pointId: number;
  images: Array<{
    title: string;
    src: string;
    id: number;
  }>;
  initiallySelectedImagesId: Array<number>;
  show: boolean;
  hidePopup: () => void;
  setLinkedImg: (imgIds: Array<number>) => void;
}

export const LinkNewImgPopup: React.FC<PointInspectorPropType> = ({
  images, initiallySelectedImagesId, pointId,
  pointType, show, hidePopup, setLinkedImg
}) => {

  const [selectedImageIds, setSelectedImageIds] = useState([...initiallySelectedImagesId]);
  useEffect(() => {
    if (!show) setSelectedImageIds([...initiallySelectedImagesId]);
  }, [show, initiallySelectedImagesId])
  return (
    <div className="link-img-popup" >
      <div className="container">
        <div className="header">Choose images to link to the selected TP</div>
        <hr />
        <div className="content">
          {
            images.map(img => (
              <div className="img-container" onClick={() => {
                if (selectedImageIds.includes(img.id))
                  setSelectedImageIds(selectedImageIds.filter(id => id !== img.id));
                else
                  setSelectedImageIds([...selectedImageIds, img.id]);
              }}>
                <div className="img-box">
                  <img src={img.src} alt={img.title}/>
                  {selectedImageIds.includes(img.id) &&
                    <div className="selected">
                      <span className="material-symbols-outlined icon">
                        check
                      </span>
                    </div>
                  }
                </div>
                <div className="title">{`[${img.id}] ${img.title}`}</div>
              </div>
            ))
          }
        </div>
        <div className="footer">
          <button className="cancel" onClick={hidePopup} >Annulla</button>
          <button className="confirm" onClick={() => setLinkedImg(selectedImageIds)} >Conferma</button>
        </div>
      </div>
    </div>
  );

}