import React, { useRef, useState } from "react";
import './OptionsPanel.scss';
import { useOnClickOutsideRef } from "../../../utils/useOnClickOutside";

interface PropType {
  options: Array<{
    text: string;
    onClick: () => void;
  }>;
  arrow: 'left' | 'right' | 'center';
  showOptions: boolean;
  hideOptions: () => void;
}

export const OptionsPanel: React.FC<PropType> = (
  { options, arrow , showOptions, hideOptions}
) => {
  const optionsRef = useRef(null);
  useOnClickOutsideRef(optionsRef, hideOptions);
  const [optionClicked, setOptionClicked] = useState<null | number>(null);
  if(showOptions)
    return (
      <div ref={optionsRef} className={`options-panel-container ${arrow}`}>
        <div className="pointer" />
        <div className="pointer-bg" />
        {options.map((option, index) => (
          <div className={`option ${optionClicked === index ? "clicked" : ""}`} onClick={option.onClick} onMouseDown={() => setOptionClicked(index)} onMouseUp={() => setOptionClicked(null)}>
            {option.text}
          </div>
        ))}
      </div>
    );
  return <></>;
};
