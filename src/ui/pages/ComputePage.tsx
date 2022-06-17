import './ComputePage.scss';
import { useEffect, useState } from "react";
import {
  OptionParams,
  ComputationParamsMap,
  ComputationParamTemplate
} from "../components/common/OptionParams";
import { CardLayoutTabsPanel } from '../components/common/CardLayoutTabsPanel';
import { CameraParams } from '../components/results/CameraParams';
import { stringifyCmdParams, templateComputationParams } from "../../core/model/ComputationParams";
import { ComputeResultsInputData } from "../../core/ipc/api/ComputeResults";
import { useSelector } from "react-redux";
import { selectTiePointList } from "../../core/model/slices/tiePointsSlice";
import { selectGroundControlPointList } from "../../core/model/slices/groundControlPointsSlice";
import { selectAllCameraParams } from "../../core/model/slices/cameraSlice";
import { selectImagesMap } from "../../core/model/slices/imageListSlice";
import { selectAllCameras } from "../../core/model/slices/resultSlice";

export function ComputePage() {
  const [params, setParams] = useState({});
  const [activeSideTab, setActiveSideTab] = useState('compute');
  const [logs, setLogs] = useState('_\n');

  useEffect(() => {
    window.electron.logComputeResults((_event, newLogs: string) =>
      setLogs((prevLogs) => `${prevLogs}\n${newLogs}`)
    )
  }, []);

  const tpList = useSelector(selectTiePointList);
  const gcpList = useSelector(selectGroundControlPointList);
  const cameraParams = useSelector(selectAllCameraParams);
  const imagesMap = useSelector(selectImagesMap);
  const imagesCameraPosition = useSelector(selectAllCameras)

  const content = {
    compute: <OptionParams templateParams={templateComputationParams} params={params} setParams={setParams} />,
    camera: <CameraParams />,
  };

  function compute() {
    const inputData: ComputeResultsInputData = {
      gcp: gcpList,
      tp: tpList,
      cameraSettings: cameraParams,
      imgPosition: imagesCameraPosition,
      images: imagesMap
    }
    window.electron.computeResults(params.out, inputData, params)
      .catch(() => {});
  }

  return (
    <div className="compute-page">
      <div className="go-section">
        <h1>Start computation</h1>
        <div className="go-content">
          <div className="go-row-left">
            <div>
              Compute all data with the BundleBlockAdjustment algorithm and
              saves all inputs and results in the specified folder.
              <br />
              All output will be viewed here
            </div>
          </div>
          <div className="go-row-right">
            <button onClick={compute}>COMPUTE</button>
          </div>
        </div>
      </div>
      <div className="output-section">
        <h1>Output</h1>
        <div className="cmd-section-container">
          <div className="cmd-section">{logs}</div>
        </div>
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
