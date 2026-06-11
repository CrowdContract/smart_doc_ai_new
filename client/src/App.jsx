import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Analytics from "./pages/Analytics";
import FAQ from "./pages/FAQ";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(8,8,28,0.95)",
            color: "#f0f0f0",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            borderRadius: "0.875rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index           element={<Home />}      />
          <Route path="features" element={<Features />}  />
          <Route path="analytics"element={<Analytics />} />
          <Route path="faq"      element={<FAQ />}       />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
