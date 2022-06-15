import './ResultPage.scss';
import { useState } from 'react';
import { ComputationParams } from '../components/results/ComputationParams';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';

export function ResultsPage() {
  const [params, setParams] = useState({});

  return (
    <div className="results-page">
      <div className="setting-container">
        <CardLayoutTabsPanel
          activeTabId="COMPUTE-PARAMS"
          tabHeaderList={[
            {
              tabId: 'COMPUTE-PARAMS',
              label: 'Computation parameters',
              onClick: () => {},
            },
          ]}
          content={<ComputationParams params={params} setParams={setParams} />}
          className="setting-tabs"
        />
      </div>
      <div className="cmd-container">NONE</div>
    </div>
    // <button onClick={window.electron.computeResults}>COSE</button>
  );
}
