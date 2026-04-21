import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import IncomeTaxSlabsPage from './pages/IncomeTaxSlabsPage';
import NewVsOldRegimePage from './pages/NewVsOldRegimePage';
import HRACalculatorPage from './pages/HRACalculatorPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Skip to main content — accessibility + SEO */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-indigo-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-medium"
      >
        Skip to main content
      </a>

      <ScrollToTop />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/income-tax-slabs" element={<IncomeTaxSlabsPage />} />
          <Route path="/new-vs-old-regime" element={<NewVsOldRegimePage />} />
          <Route path="/hra-calculator" element={<HRACalculatorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
