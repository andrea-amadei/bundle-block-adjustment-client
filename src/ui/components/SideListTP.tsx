import { selectTiePointsOnImage, selectTiePointsOnImageBySourceType } from "../../core/model/slices/tiePointsSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PointSummary } from "./Points/PointSummary";
import { useEffect, useState } from "react";
import "./SideList.scss";
import { Button } from "react-bootstrap";

export function SideListTP() {

  const [isCompact, setIsCompact] = useState(false);

  const {selectedImageId, selectedPointId} = useParams();
  let imgId: undefined | number;
  if(selectedImageId != null)
    imgId = parseInt(selectedImageId);
  const tpList = useSelector(selectTiePointsOnImage(imgId));

  const tpListBySource = {
    "MANUAL": useSelector(selectTiePointsOnImageBySourceType(imgId, "MANUAL")),
    "IMPORTED": useSelector(selectTiePointsOnImageBySourceType(imgId, "IMPORTED")),
    "AUTO": useSelector(selectTiePointsOnImageBySourceType(imgId, "AUTO")),
  }

  useEffect(
    () => console.log("ABC", selectedImageId, imgId, tpList),

  )

  let compactBtn;
  if(isCompact) {
    compactBtn = (
      <Button className="compact-btn" onClick={() => setIsCompact(false)}>{"<->"}</Button>
    );
  } else {
    compactBtn = (
      <Button className="compact-btn" onClick={() => setIsCompact(true)}>{">-<"}</Button>
    );
  }

  return (
    <div className="point-side-list-container">
      <div className="point-side-list-header">
        {compactBtn}
      </div>
      <div className={"source-groups-container"}>
        {Object.entries(tpListBySource)
          .filter(([source, tpList]) => tpList.length > 0)
          .map( ([source, tpList]) => (
            <div className={"source-group"}>
              {source}
              <hr className="divider"/>
              <div className={`point-side-list ${isCompact ? "compact" : ""}`}>
                {tpList.map(tp =>
                  <PointSummary
                    type="TP"
                    id={tp.pointId}
                    additionalInfo={{
                      "key-hidden": `(${tp.x}, ${tp.y})`
                    }}
                    compact={isCompact}
                  />
                )}
              </div>
            </div>
        ))}
      </div>
    </div>
  );

}