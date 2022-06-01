import React from "react";
import './InputField.scss';

interface PropType {
  type?: string;
  label?: string | null;
  value: string | number | undefined;
  setValue: (value: string | number | undefined) => void;
}

export const InputField: React.FC<PropType> = (
  {type, value, setValue, label}
) => {

  return (
    <div className="input-filed-container">
      {label && <div className="label">{label}</div>}
      <input
        value={value}
        type={type}
        className={`input ${type}`}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );

}

InputField.defaultProps = {
  type: 'text',
  label: null
}