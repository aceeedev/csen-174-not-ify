import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import Home from './pages/landing/home.tsx'
import UserHomePage from './pages/userHomePage/userHomePage.tsx'
import UserProfileView from './pages/userProfileView/userProfileView.tsx'
import GroupView from './pages/groupView/groupView.tsx'
import GroupSettingView from './pages/groupSettingView/groupSettingView.tsx'
import LibraryView from './pages/libraryView/libraryView.tsx'
import PlaylistView from './pages/playlistView/playlistView.tsx'
import App from './App.tsx'
import TestPage from './pages/TestPage.tsx'
import Callback from './pages/CallbackPage.tsx';
import OnboardingPage from './pages/onboardingPage/OnboardingPage.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/home" element={<UserHomePage />} />
      <Route path="/userHomePage" element={<UserHomePage />} />
      <Route path="/profile" element={<UserProfileView />} />
      <Route path="/library" element={<LibraryView />} />
      <Route path="/playlist/:playlistId" element={<PlaylistView />} />
      <Route path="/groups/:groupId" element={<GroupView />} />
      <Route path="/groups/:groupId/settings" element={<GroupSettingView />} />
      <Route path="/app" element={<App />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  </BrowserRouter>,
)
