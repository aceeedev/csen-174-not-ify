import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Home from './pages/landing/home.tsx'
import Login from './pages/loginPage/login.tsx'
import App from './App.tsx'
import TestPage from './pages/TestPage.tsx'
import TestAuthPage from './pages/TestAuthPage.tsx'
import Callback from './pages/CallbackPage.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<App />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/auth" element={<TestAuthPage />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  </BrowserRouter>,
)
