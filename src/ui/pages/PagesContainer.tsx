import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PageMenu } from '../components/PageMenu';

export function PagesContainer() {
  const location = useLocation();

  useEffect(() => console.log('PATH', location.pathname), [location.pathname]);

  return (
    <div className="pages-container">
      <PageMenu />
      <Outlet />
    </div>
  );
}