import './CameraParams.scss';
import { InputField } from '../common/InputField';
import { FieldsContainer } from '../common/FieldsContainer';
import { useSelector } from 'react-redux';
import {
  selectA1, selectA2,
  selectC,
  selectEta0,
  selectK1, selectK2, selectK3, selectP1, selectP2,
  selectXi0, setA1, setA2,
  setC,
  setEta0, setK1, setK2, setK3, setP1, setP2,
  setXi0
} from '../../../core/model/slices/cameraSlice';
import { store } from '../../../core/model/store';

export function CameraParams() {
  return (
    <div className="camera-params">
      <FieldsContainer title="Internal orientation parameters">
        <div className="fields-row">
          <div className="field">
            <InputField
              type="number"
              label="ξ0 (xi0)"
              value={useSelector(selectXi0)}
              setValue={(value: number) => {store.dispatch(setXi0(value))}}
            />
          </div>
          <div className="field">
            <InputField
              type="number"
              label="η0 (eta0)"
              value={useSelector(selectEta0)}
              setValue={(value: number) => {store.dispatch(setEta0(value))}}
            />
          </div>
          <div className="field">
            <InputField
              type="number"
              label="c"
              value={useSelector(selectC)}
              setValue={(value: number) => {store.dispatch(setC(value))}}
            />
          </div>
        </div>
      </FieldsContainer>
      <FieldsContainer title="Distortion parameters">
        <div className="fields-row">
          <div className="field">
            <InputField
              type="number"
              label="k1"
              value={useSelector(selectK1)}
              setValue={(value: number) => {store.dispatch(setK1(value))}}
            />
          </div>
          <div className="field">
            <InputField
              type="number"
              label="k2"
              value={useSelector(selectK2)}
              setValue={(value: number) => {store.dispatch(setK2(value))}}
            />
          </div>
          <div className="field">
            <InputField
              type="number"
              label="k3"
              value={useSelector(selectK3)}
              setValue={(value: number) => {store.dispatch(setK3(value))}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field">
            <InputField
              type="number"
              label="p1"
              value={useSelector(selectP1)}
              setValue={(value: number) => {store.dispatch(setP1(value))}}
            />
          </div>
          <div className="field">
            <InputField
              type="number"
              label="p2"
              value={useSelector(selectP2)}
              setValue={(value: number) => {store.dispatch(setP2(value))}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field">
            <InputField
              type="number"
              label="a1"
              value={useSelector(selectA1)}
              setValue={(value: number) => {store.dispatch(setA1(value))}}
            />
          </div>
          <div className="field">
            <InputField
              type="number"
              label="a2"
              value={useSelector(selectA2)}
              setValue={(value: number) => {store.dispatch(setA2(value))}}
            />
          </div>
        </div>
      </FieldsContainer>
    </div>
  );
}
