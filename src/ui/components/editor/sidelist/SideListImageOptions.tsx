import './SideListImageOptions.scss';
import { InputField } from '../../common/InputField';
import { FieldsContainer } from '../../common/FieldsContainer';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectCameraById,
  setCameraKappa,
  setCameraOmega,
  setCameraPhi,
  setCameraXc, setCameraYc, setCameraZc
} from "../../../../core/model/slices/resultSlice";
import { selectImageById, setImageNameById } from '../../../../core/model/slices/imageListSlice';
import { store } from '../../../../core/model/store';

export function SideListImageOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedImageId = parseInt(searchParams.get('imgId') as string, 10);

  const selectedImage = useSelector(selectImageById(selectedImageId));
  const selectedCameraPosition = useSelector(selectCameraById(selectedImageId));

  return (
    <div className="image-options">
      <FieldsContainer title="Image information">
        <div className="fields-row">
          <div className="field-1">
            <InputField
              type="string"
              label="Name"
              value={selectedImage.name}
              setValue={(value: string) => store.dispatch(setImageNameById(selectedImageId, value))}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-1 readonly">
            <InputField
              type="number"
              label="Width"
              value={selectedImage.width}
              setValue={() => {}}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-1 readonly">
            <InputField
              type="number"
              label="Height"
              value={selectedImage.height}
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
              value={selectedCameraPosition.xc}
              setValue={(val) => store.dispatch(setCameraXc(selectedImageId, parseFloat(val)))}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-2">
            <InputField
              type="number"
              label="Yc"
              value={selectedCameraPosition.yc}
              setValue={(val) => store.dispatch(setCameraYc(selectedImageId, parseFloat(val)))}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-2">
            <InputField
              type="number"
              label="Zc"
              value={selectedCameraPosition.zc}
              setValue={(val) => store.dispatch(setCameraZc(selectedImageId, parseFloat(val)))}
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
              value={selectedCameraPosition.omega}
              setValue={(val) => store.dispatch(setCameraOmega(selectedImageId, parseFloat(val)))}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-3">
            <InputField
              type="number"
              label="φ (phi)"
              value={selectedCameraPosition.phi}
              setValue={(val) => store.dispatch(setCameraPhi(selectedImageId, parseFloat(val)))}
            />
          </div>
        </div>
        <div className="fields-row">
          <div className="field-3">
            <InputField
              type="number"
              label="κ (kappa)"
              value={selectedCameraPosition.kappa}
              setValue={(val) => store.dispatch(setCameraKappa(selectedImageId, parseFloat(val)))}
            />
          </div>
        </div>
      </FieldsContainer>
    </div>
  );
}
