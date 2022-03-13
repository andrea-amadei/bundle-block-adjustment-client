import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
} from 'react-router-dom';
import './App.css';

const Hello = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <h1>TITOLO</h1>
      <div>
        <Outlet />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Link to="/pag1">pag1</Link>
        <Link to="/pag2">pag2</Link>
        <Link to="/">reset</Link>
      </div>
    </div>
  );
};

const Pag1 = () => {
  return (
    <div>
      <h2>PAG1</h2>
    </div>
  );
};

const Pag2 = () => {
  return (
    <div>
      <div>PAG2</div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />}>
          <Route index element={<Pag1 />} />
          <Route path="pag1" element={<Pag1 />} />
          <Route path="pag2" element={<Pag2 />} />
        </Route>
      </Routes>
    </Router>
  );
}
