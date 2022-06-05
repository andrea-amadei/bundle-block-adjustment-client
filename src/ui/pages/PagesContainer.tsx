import { Outlet } from 'react-router-dom';
import { PageMenu } from './PageMenu';

export function PagesContainer() {
  return (
    <div className="pages-container">
      <PageMenu />
      <Outlet />
    </div>
  );
}
