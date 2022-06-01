import  './DataPage.scss'
import { useState } from 'react';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';
import { CameraSettingsTable } from '../components/editor/tables/CameraSettingsTable';
import { GCPObjectTable } from '../components/editor/tables/GCPObjectTable';
import { GCPImageTable } from '../components/editor/tables/GCPImageTable';
import { TPImageTable } from '../components/editor/tables/TPImageTable';
import { CameraPositionTable } from '../components/editor/tables/CameraPositionTable';
import { PointCloudTable } from '../components/editor/tables/PointCloudTable';

export function DataPage() {
  const [activeSideTab, setActiveSideTab] = useState('camera');

  const tables = {
    camera: <CameraSettingsTable />,
    gcp_obj: <GCPObjectTable />,
    gcp_img: <GCPImageTable />,
    tp_img: <TPImageTable />,
    img: <CameraPositionTable />,
    cloud: <PointCloudTable />,
  };

  return (
    <div className="data-page">
      <div className="header-section"></div>
      <CardLayoutTabsPanel
        className="main-section"
        tabHeaderList={[
          {
            tabId: 'camera',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('camera')}>
                Camera Settings
              </div>
            ),
          },
          {
            tabId: 'gcp_obj',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('gcp_obj')}>
                GCP Global Positioning
              </div>
            ),
          },
          {
            tabId: 'gcp_img',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('gcp_img')}>
                GCP Image Positioning
              </div>
            ),
          },
          {
            tabId: 'tp_img',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('tp_img')}>
                TP Image Positioning
              </div>
            ),
          },
          {
            tabId: 'img',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('img')}>
                Images
              </div>
            ),
          },
          {
            tabId: 'cloud',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('cloud')}>
                Point Cloud
              </div>
            ),
          },
        ]}
        content={
          <div className="main-content">
            {tables[activeSideTab]}
          </div>
        }
        activeTabId={activeSideTab}
      />
    </div>
  );
}
