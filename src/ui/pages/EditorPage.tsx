import './EditorPage.scss';
import { ImageThumbnailNavLink } from 'ui/components/editor/images/ImageThumbnailNavLink';
import { useSearchParams } from 'react-router-dom';
import { ImageEditor } from 'ui/components/editor/ImageEditor';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';
import { PointInspectorTP } from '../components/editor/points/PointInspectorTP';
import { PointInspectorGCP } from '../components/editor/points/PointInspectorGCP';
import { useState } from 'react';
import { SideListTP } from '../components/editor/sidelist/SideListTP';
import { SideListGCP } from '../components/editor/sidelist/SideListGCP';
import { selectAllImages } from '../../core/model/slices/imageListSlice';
import { useSelector } from 'react-redux';

// eslint-disable-next-line import/prefer-default-export
export function EditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPointId = parseInt(searchParams.get('pointId') as string);
  const selectedPointType = searchParams.get('pointType');
  const selectedImageId = parseInt(searchParams.get('imgId') as string);

  const [activeSideTab, setActiveSideTab] = useState('TP');

  const imgList = useSelector(selectAllImages);

  let sideTabContent;
  if (activeSideTab === 'TP') sideTabContent = <SideListTP />;
  else if (activeSideTab === 'GCP') sideTabContent = <SideListGCP />;

  let contentMainSection;
  if (selectedImageId) {
    contentMainSection = (
      <>
        <ImageEditor key={selectedImageId} />
        {selectedPointId >= 0 ? (
          <div className="point-inspector">
            {selectedPointType === 'TP' ? (
              <PointInspectorTP />
            ) : (
              <PointInspectorGCP />
            )}
          </div>
        ) : (
          <div className="no-point-selected">
            Select a point using the right sidebar or the editor
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
                imgId={id}
                key={id}
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
