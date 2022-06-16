import './ComputePage.scss';
import { useState } from 'react';
import { ComputationParams } from '../components/results/ComputationParams';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';
import { CameraParams } from '../components/results/CameraParams';

export function ComputePage() {
  const [params, setParams] = useState({});
  const [activeSideTab, setActiveSideTab] = useState('compute');

  const content = {
    compute: <ComputationParams params={params} setParams={setParams} />,
    camera: <CameraParams />,
  };

  return (
    <div className="compute-page">
      <div className="go-section">
        <h1>Start computation</h1>
        <div className="go-content">
          <div className="go-row-left">
            <div>Insert description here</div>
          </div>
          <div className="go-row-right">
            <button>COMPUTE</button>
          </div>
        </div>
      </div>
      <div className="output-section">
        <h1>Output</h1>
        <div className="cmd-section">_</div>
      </div>
      <CardLayoutTabsPanel
        className="main-section"
        tabHeaderList={[
          {
            tabId: 'compute',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('compute')}>
                Compute Parameters
              </div>
            ),
          },
          {
            tabId: 'camera',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('camera')}>
                Camera Parameters
              </div>
            ),
          },
        ]}
        content={
          <div className="main-content">
            {content[activeSideTab]}
          </div>
        }
        activeTabId={activeSideTab}
      />
    </div>
  );
}
