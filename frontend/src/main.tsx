import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import IndexPage from './pages/IndexPage.tsx';
import UserProfileView from './pages/userProfileView/userProfileView.tsx'
import GroupView from './pages/groupView/groupView.tsx'
import GroupSettingView from './pages/groupSettingView/groupSettingView.tsx'
import AddGroupView from './pages/addGroupView/addGroupView.tsx'
import LibraryView from './pages/libraryView/libraryView.tsx'
import Callback from './pages/CallbackPage.tsx';
import OnboardingPage from './pages/onboardingPage/OnboardingPage.tsx';
import AddPlaylistPage from './pages/addPlaylistPage/AddPlaylistPage.tsx';
import PlaylistPage from './pages/playlistPage/PlaylistPage.tsx';
import GroupOverview from './pages/groupOverview/groupOverview.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/callback" element={<Callback />} />

      <Route path="/add-playlist" element={<AddPlaylistPage />} />
      <Route path="/playlist" element={<PlaylistPage />} />
      
      <Route path="/profile" element={<UserProfileView />} />
      <Route path="/my-library" element={<LibraryView />} />

      <Route path="/group" element={<GroupView />} />
      <Route path="/group/settings" element={<GroupSettingView />} />
      <Route path="/new-group" element={<AddGroupView />} />
      <Route path="/my-groups" element={<GroupOverview />}/>
    </Routes>
  </BrowserRouter>,
)
