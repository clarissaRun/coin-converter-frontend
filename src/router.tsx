import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Conversor from "./pages/Conversor";
import SignUpPage from "./pages/auth/Sign-up";
import SignInPage from "./pages/auth/Sign-in";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Conversor />} />
        <Route path="/auth/sign-in" element={<SignInPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
