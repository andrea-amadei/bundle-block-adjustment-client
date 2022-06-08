import React, { useEffect, useState } from "react";
import "./MultiOptionsToggles.scss";

interface PropType {
  options: Array<{
    text: string;
    onSelected: () => void;
  }>;
  initiallySelectedOptionIndex?: number;
}

export const MultiOptionsToggles: React.FC<PropType> = ({initiallySelectedOptionIndex, options}) => {

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(initiallySelectedOptionIndex);

  useEffect(
    () => options[initiallySelectedOptionIndex as number].onSelected(),
    []
  );

  return (
    <div className="multi-options-toggle-container">
      {options.map( (opt, optIndex) => (
        <button
          className={`toggle ${selectedOptionIndex === optIndex ? "selected" : ""}` }
          key={optIndex}
          onClick={() => {
            setSelectedOptionIndex(optIndex);
            opt.onSelected();
          }}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

}

MultiOptionsToggles.defaultProps = {
  initiallySelectedOptionIndex: 0,
}
