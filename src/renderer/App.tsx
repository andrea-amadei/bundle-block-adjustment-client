// import './App.css'; // TODO enable?
import 'ui/styles/Styles.scss';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
} from 'react-router-dom';
import { PagesContainer } from "../ui/pages/PagesContainer";
import { EditorPage } from "../ui/pages/EditorPage";
import { DataPage } from "../ui/pages/DataPage";
import { RedirectToFirstImageInEditor } from "../utils/RedirectToFirstImageInEditor";
import { SideListTP } from "../ui/components/SideListTP";
import { SideListGCP } from "../ui/components/SideListGCP";




export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PagesContainer />}>
          <Route index element={<RedirectToFirstImageInEditor/>} />
          <Route path="editor/:selectedImageId" element={<EditorPage/>}>
            <Route path="TP" element={<SideListTP/>}>
              <Route path=":pointId"/>
            </Route>
            <Route path="GCP" element={<SideListGCP/>}/>
            <Route index element={<Navigate to="TP"/>}/>
          </Route>
          <Route path="data" element={<DataPage/>} />
          <Route path="*" element={<h2>Not defined</h2>}/>
        </Route>
      </Routes>
    </Router>
  );
}
