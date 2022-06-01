import  './DataPage.scss'
import { useState } from 'react';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';

export function DataPage() {
  const [activeSideTab, setActiveSideTab] = useState('global');

  return (
    <div className="data-page">
      <div className="header-section"></div>
      <CardLayoutTabsPanel
        className="main-section"
        tabHeaderList={[
          {
            tabId: 'global',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('global')}>
                Global Settings
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
            tabId: 'camera',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('camera')}>
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
        content={<h1>CONTENT</h1>}
        activeTabId={activeSideTab}
      />
    </div>
  );
}
