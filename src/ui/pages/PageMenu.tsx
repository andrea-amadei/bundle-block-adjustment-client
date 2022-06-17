import './PageMenu.scss';
import { NavLink } from 'react-router-dom';

export function PageMenu() {
  return (
    <div className="page-menu">
      <NavLink className="page-menu-nav-link" to="editor">
        Editor
      </NavLink>
      <NavLink className="page-menu-nav-link" to="results">
        Compute
      </NavLink>
      <NavLink className="page-menu-nav-link" to="data">
        Raw Data
      </NavLink>
      {/*{process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' ? (*/}
      {/*  <NavLink className="page-menu-nav-link" to="testing">*/}
      {/*    Testing*/}
      {/*  </NavLink>*/}
      {/*) : (*/}
      {/*  <></>*/}
      {/*)}*/}
    </div>
  );
}