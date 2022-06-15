import React from "react";
import './InputField.scss';

interface PropType {
  type?: string;
  label?: string | null;
  value: string | number | boolean | undefined;
  setValue: (value: string | number | boolean | undefined) => void;
}

export const InputField: React.FC<PropType> = (
  {type, value, setValue, label}
) => {

  function renderInput() {
    switch (type) {
      case "checkbox":
        return (
          <input
            checked={value as boolean}
            type={type}
            className={`input ${type}`}
            onChange={(e) => setValue(!(value as boolean))}
          />
        );
      case "number":
      case "text":
      default:
        return (
          <input
            value={value}
            type={type}
            className={`input ${type}`}
            onChange={(e) => setValue(e.target.value)}
          />
        );
    }
  }

  return (
    <div className="input-filed-container">
      {label && <div className="label">{label}</div>}
      {renderInput()}
    </div>
  );

}

InputField.defaultProps = {
  type: 'text',
  label: null
}