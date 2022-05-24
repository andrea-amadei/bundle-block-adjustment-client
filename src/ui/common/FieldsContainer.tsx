import React from "react";
import './FieldsContainer.scss';

interface PropType {
  title: string;
}

export const FieldsContainer: React.FC<PropType> = (
  {title, children}
) => {

  return (
    <div className="fields-container">
      <div className="header">{title}</div>
      {children}
    </div>
  );
}
