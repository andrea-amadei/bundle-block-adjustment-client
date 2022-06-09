// import './App.css'; // TODO enable?
import 'ui/styles/Styles.scss';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { PagesContainer } from '../ui/pages/PagesContainer';
import { EditorPage } from '../ui/pages/EditorPage';
import { DataPage } from '../ui/pages/DataPage';
import {
  addNewMessage,
  Message,
} from '../core/model/slices/messages/messageQueueSlice';
import { NotificationBanner } from '../ui/components/common/NotificationBanner';
import { TestingPage } from '../ui/pages/TestingPage';
import { store } from '../core/model/store';

export default function App() {
  useEffect(() => {
    window.electron.logToRenderer((_event, text: string) => console.log(text));

    window.electron.addNotification((_event, message: Message) =>
      store.dispatch(addNewMessage(message))
    );
  });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PagesContainer />}>
            <Route index element={<EditorPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="data" element={<DataPage />} />
            <Route path="results" element={<h1>In development</h1>} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="*" element={<h2>Not defined</h2>} />
          </Route>
        </Routes>
      </Router>
      <NotificationBanner />
    </>
  );
}
