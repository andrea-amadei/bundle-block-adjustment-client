import  './DataPage.scss'
import { useState } from 'react';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';
import { CameraSettingsTable } from '../components/data/tables/CameraSettingsTable';
import { GCPObjectTable } from '../components/data/tables/GCPObjectTable';
import { GCPImageTable } from '../components/data/tables/GCPImageTable';
import { TPImageTable } from '../components/data/tables/TPImageTable';
import { CameraPositionTable } from '../components/data/tables/CameraPositionTable';
import { PointCloudTable } from '../components/data/tables/PointCloudTable';

export function DataPage() {
  const [activeSideTab, setActiveSideTab] = useState('camera');
  const [enableImport, setEnableImport] = useState(false);

  const tables = {
    camera: <CameraSettingsTable showImportButton={enableImport} />,
    gcp_obj: <GCPObjectTable showImportButton={enableImport} />,
    gcp_img: <GCPImageTable showImportButton={enableImport} />,
    tp_img: <TPImageTable showImportButton={enableImport} />,
    img: <CameraPositionTable showImportButton={enableImport} />,
    cloud: <PointCloudTable showImportButton={enableImport} />,
  };

  return (
    <div className="data-page">
      <div className="header-section">
        <h1>Import instructions</h1>
        <p>
          Importing single files is susceptible to import order. To avoid
          conflicts, please follow the strict order of import presented by the
          tabs below (left to right).
        </p>
        <p>Allow importing files <input type="checkbox" onChange={(event) => setEnableImport(event.target.checked)} checked={enableImport} /></p>
      </div>
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
                Camera Positions
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
