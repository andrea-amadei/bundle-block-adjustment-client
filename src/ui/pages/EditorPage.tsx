import "./EditorPage.scss"
import { ImageThumbnailNavLink } from "ui/components/ImageThumbnailNavLink";
import { useSelector } from "react-redux";
import { selectAllImages } from "../../core/model/slices/imageListSlice";
import { Link, Outlet, useLocation, useMatch, useParams } from "react-router-dom";
import { ImageEditor } from "ui/components/ImageEditor";
import { CardLayoutTabsPanel } from "../common/CardLayoutTabsPanel";

export function EditorPage(props) {

  const imgList = useSelector(selectAllImages);
  const {selectedImageId, selectedPointType, selectedPointId} = useParams();
  const match = useMatch("/editor/:imgId/:pointType");

  let contentMainSection;
  if(selectedImageId) {
    contentMainSection = (
      <>
        <ImageEditor className="main-img"/>
        {selectedPointId &&
          <div className="point-inspector">

          </div>
        }
        {!selectedPointId &&
          <div className="no-point-selected">
            Select a point using the right sidebar
          </div>
        }
      </>
    );
  } else {
    contentMainSection = (
      <div className="no-image-selected-text">
        Select an image using the left panel
      </div>
    );
  }

  return (
    <>
      <div className="editor-page">
        <div className="image-list">
          <div className="image-list-box">
            {/* <div className="title">Image list</div> */}
            <div className="list">
              {
                imgList.map( ({id, name, path}) => (
                  <ImageThumbnailNavLink title={name} imgSrc={path} link={`/editor/${id}`} />
                ))
              }
            </div>
          </div>
        </div>
        <div className="main-section">
          {contentMainSection}
        </div>
        <CardLayoutTabsPanel
          className="gpc-tp-point-list"
          tabHeaderList={[
            {
              tabId: "TP",
              label: <Link className="tab-link" to="TP">TP</Link>
            },
            {
              tabId: "GCP",
              label: <Link className="tab-link" to="GCP">GCP</Link>
            }
          ]}
          content={<Outlet/>}
          activeTabId={match?.params.pointType}
        />
      </div>
    </>

  );
}