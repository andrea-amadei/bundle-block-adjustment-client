import './ImageThumbnailNavLink.scss';
import { NavLink } from 'react-router-dom';
import React from 'react';

interface PropsType {
  title?: string | null;
  imgSrc: string;
  link: string;
}


export const ImageThumbnailNavLink: React.FC<PropsType> = (props) => {
  const { title, imgSrc, link } = props;
  return (
    <NavLink className="img-thumbnail" to={link}>
      {title && <div className="img-title">
        {title}
      </div>}
      <img src={imgSrc} alt={imgSrc}/>
    </NavLink>
  );
}

ImageThumbnailNavLink.defaultProps = {
  title: null
};
