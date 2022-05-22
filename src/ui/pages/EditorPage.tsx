import './EditorPage.scss';
import { ImageThumbnailNavLink } from 'ui/components/ImageThumbnailNavLink';
import { useSelector } from 'react-redux';
import { Link, Outlet, useMatch, useParams } from 'react-router-dom';
import { ImageEditor } from 'ui/components/ImageEditor';
import { selectAllImages } from '../../core/model/slices/imageListSlice';
import { CardLayoutTabsPanel } from '../common/CardLayoutTabsPanel';

// eslint-disable-next-line import/prefer-default-export
export function EditorPage() {
  const imgList = useSelector(selectAllImages);
  const { selectedImageId, selectedPointId } = useParams();
  const match = useMatch('/editor/:imgId/:pointType');

  let contentMainSection;
  if (selectedImageId) {
    contentMainSection = (
      <>
        <ImageEditor key={selectedImageId} />
        {selectedPointId && <div className="point-inspector" />}
        {!selectedPointId && (
          <div className="no-point-selected">
            Select a point using the right sidebar
          </div>
        )}
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
          {/* <div className="title">Image list</div> */}
          <div className="list">
            {imgList.map(({ id, name, path }) => (
              <ImageThumbnailNavLink
                title={name}
                imgSrc={path}
                link={`/editor/${id}`}
              />
            ))}
          </div>
        </div>
        <div className="main-section">{contentMainSection}</div>
        <CardLayoutTabsPanel
          className="gpc-tp-point-list"
          tabHeaderList={[
            {
              tabId: 'TP',
              label: (
                <Link className="tab-link" to="TP">
                  TP
                </Link>
              ),
            },
            {
              tabId: 'GCP',
              label: (
                <Link className="tab-link" to="GCP">
                  GCP
                </Link>
              ),
            },
          ]}
          content={<Outlet />}
          activeTabId={match?.params.pointType}
        />
      </div>
    </>
  );
}
