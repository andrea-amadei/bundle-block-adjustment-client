import './SideListImageOptions.scss';
import { InputField } from '../../common/InputField';
import { FieldsContainer } from '../../common/FieldsContainer';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCameraById, setCameraXc } from '../../../../core/model/slices/resultSlice';
import { selectImageById, setImageNameById } from '../../../../core/model/slices/imageListSlice';
import { store } from '../../../../core/model/store';

export function SideListImageOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedImageId = parseInt(searchParams.get('imgId') as string, 10);

  const selectedCameraPosition = useSelector(selectCameraById(selectedImageId));

  return (
    <div className="image-options">
      <FieldsContainer title="Image information">
        <div className="fields-row">
          <div className="field-1">
            <InputField
              type="string"
              label="Name"
              value={useSelector(selectImageById(selectedImageId)).name}
              setValue={(value: string) => store.dispatch(setImageNameById(selectedImageId, value))}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-1 readonly">
            <InputField
              type="number"
              label="Width"
              value={useSelector(selectImageById(selectedImageId)).width}
              setValue={() => {}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-1 readonly">
            <InputField
              type="number"
              label="Height"
              value={useSelector(selectImageById(selectedImageId)).height}
              setValue={() => {}}
            />
          </div>
        </div>
      </FieldsContainer>
      <hr/>
      <FieldsContainer title="Camera Position">
        <div className="fields-row">
          <div className="field-2">
            <InputField
              type="number"
              label="Xc"
              value={ /*TODO CORRECT SELECTOR*/ }
              setValue={() => {}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-2">
            <InputField
              type="number"
              label="Yc"
              value={ /*TODO CORRECT SELECTOR*/ }
              setValue={() => {}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-2">
            <InputField
              type="number"
              label="Zc"
              value={ /*TODO CORRECT SELECTOR*/ }
              setValue={() => {}}
            />
          </div>
        </div>
      </FieldsContainer>
      <FieldsContainer title="Camera Orientation">
        <div className="fields-row">
          <div className="field-3">
            <InputField
              type="number"
              label="ω (omega)"
              value={ /*TODO CORRECT SELECTOR*/ }
              setValue={() => {}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-3">
            <InputField
              type="number"
              label="φ (phi)"
              value={ /*TODO CORRECT SELECTOR*/ }
              setValue={() => {}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-3">
            <InputField
              type="number"
              label="κ (kappa)"
              value={ /*TODO CORRECT SELECTOR*/ }
              setValue={() => {}}
            />
          </div>
        </div>
      </FieldsContainer>
    </div>
  );
}
