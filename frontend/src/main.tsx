import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import IndexPage from './pages/IndexPage.tsx';
import UserProfileView from './pages/userProfileView/userProfileView.tsx'
import GroupView from './pages/groupView/groupView.tsx'
import GroupSettingView from './pages/groupSettingView/groupSettingView.tsx'
import LibraryView from './pages/libraryView/libraryView.tsx'
import PlaylistView from './pages/playlistView/playlistView.tsx'
import App from './App.tsx'
import TestPage from './pages/TestPage.tsx'
import Callback from './pages/CallbackPage.tsx';
import OnboardingPage from './pages/onboardingPage/OnboardingPage.tsx';
import AddPlaylistPage from './pages/addPlaylistPage/AddPlaylistPage.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/callback" element={<Callback />} />

      <Route path="/add-playlist" element={<AddPlaylistPage />} />
      
      <Route path="/profile" element={<UserProfileView />} />
      <Route path="/library" element={<LibraryView />} />
      <Route path="/playlist/:playlistId" element={<PlaylistView />} />
      <Route path="/groups/:groupId" element={<GroupView />} />
      <Route path="/groups/:groupId/settings" element={<GroupSettingView />} />
      
      {/** test endpoints */}
      <Route path="/app" element={<App />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  </BrowserRouter>,
)
