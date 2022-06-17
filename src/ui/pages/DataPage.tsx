import './DataPage.scss';
import { useState } from 'react';
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';
import { CameraSettingsTable } from '../components/data/tables/CameraSettingsTable';
import { GCPObjectTable } from '../components/data/tables/GCPObjectTable';
import { GCPImageTable } from '../components/data/tables/GCPImageTable';
import { TPImageTable } from '../components/data/tables/TPImageTable';
import { CameraPositionTable } from '../components/data/tables/CameraPositionTable';
import { store } from '../../core/model/store';
import { addNewMessage } from '../../core/model/slices/messages/messageQueueSlice';
import { ImageListTable } from '../components/data/tables/ImageListTable';
import { saveAll } from '../../core/model/dataManipulation';

export function DataPage() {
  const [activeSideTab, setActiveSideTab] = useState('gcp_obj');
  const [enableImport, setEnableImport] = useState(false);

  const tables = {
    gcp_obj: <GCPObjectTable showImportButton={enableImport} />,
    gcp_img: <GCPImageTable showImportButton={enableImport} />,
    tp_img: <TPImageTable showImportButton={enableImport} />,
    img: <CameraPositionTable showImportButton={enableImport} />,
    camera: <CameraSettingsTable showImportButton={enableImport} />,
    img_list: <ImageListTable showImportButton={enableImport} />,
  };

  return (
    <div className="data-page">
      <div className="save-section">
        <h1>Save Project</h1>
        <div className="save-content">
          <div className="save-row-left">
            <div>
              Save the whole project (including all images and CSV files) as a
              single deflated file to save on time and resources.
            </div>
          </div>
          <div className="save-row-right">
            <button onClick={() => {saveAll(false); window.electron.exportSavesToZip();}}>EXPORT PROJECT</button>
          </div>
        </div>
      </div>
      <div className="info-section">
        <h1>Import instructions</h1>
        <p>
          Importing single files is susceptible to import order. To avoid
          conflicts, please follow the strict order of import presented by the
          tabs below (left to right).
        </p>
        <p>
          Allow importing files{' '}
          <input
            type="checkbox"
            checked={enableImport}
            onChange={(event) => {
              setEnableImport(event.target.checked);

              if (event.target.checked)
                store.dispatch(addNewMessage({
                    message: 'Single file importing enabled. Please use caution',
                    status: 'info',
                  })
                );
            }}
          />
        </p>
      </div>
      <CardLayoutTabsPanel
        className="main-section"
        tabHeaderList={[
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
            tabId: 'camera',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('camera')}>
                Camera Parameters
              </div>
            ),
          },
          {
            tabId: 'img_list',
            label: (
              <div className="tab-link" onClick={() => setActiveSideTab('img_list')}>
                Image List
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
