import './PageMenu.scss';
import { NavLink } from 'react-router-dom';

export function PageMenu(props) {
  return (
    <div className="page-menu">
      <NavLink className="page-menu-nav-link" to="editor">
        Editor
      </NavLink>
      <NavLink className="page-menu-nav-link" to="data">
        Raw Data
      </NavLink>
      <NavLink className="page-menu-nav-link" to="results">
        Compute results
      </NavLink>
      <NavLink className="page-menu-nav-link rightSeparator" to="test">
        Test
      </NavLink>
    </div>
  );
}