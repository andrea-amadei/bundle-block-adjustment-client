import './EditorPage.scss';
import { ImageThumbnailNavLink } from 'ui/components/ImageThumbnailNavLink';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ImageEditor } from 'ui/components/ImageEditor';
import { useState } from 'react';
import { selectAllImages } from '../../core/model/slices/imageListSlice';
import { CardLayoutTabsPanel } from '../common/CardLayoutTabsPanel';
import { PointInspectorTP } from '../components/PointInspectorTP';
import useGetUrlParams from '../../utils/useGetUrlParams';
import { SideListTP } from '../components/SideListTP';
import { SideListGCP } from '../components/SideListGCP';
import { PointInspectorGCP } from '../components/PointInspectorGCP';

// eslint-disable-next-line import/prefer-default-export
export function EditorPage() {
  const imgList = useSelector(selectAllImages);
  const { selectedImageId } = useParams();
  const { pointType: selectedPointType, pointId: selectedPointId } =
    useGetUrlParams();

  const [activeSideTab, setActiveSideTab] = useState('TP');
  let sideTabContent;
  if (activeSideTab === 'TP') sideTabContent = <SideListTP />;
  else if (activeSideTab === 'GCP') sideTabContent = <SideListGCP />;

  let contentMainSection;
  if (selectedImageId) {
    contentMainSection = (
      <>
        <ImageEditor key={selectedImageId}/>
        {selectedPointId && (
          <div className="point-inspector">
            {selectedPointType === 'TP' && <PointInspectorTP />}
            {selectedPointType === 'GCP' && <PointInspectorGCP />}
          </div>
        )}
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
                <div
                  className="tab-link"
                  onClick={() => setActiveSideTab('TP')}
                >
                  TP
                </div>
              ),
            },
            {
              tabId: 'GCP',
              label: (
                <div
                  className="tab-link"
                  onClick={() => setActiveSideTab('GCP')}
                >
                  GCP
                </div>
              ),
            },
          ]}
          content={sideTabContent}
          activeTabId={activeSideTab}
        />
      </div>
    </>
  );
}
