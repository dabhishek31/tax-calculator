import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="404 — Page Not Found | India Tax Calculator"
        description="The page you are looking for could not be found."
        path="/404"
      />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-4">🧮</div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-600 mb-4">Page Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Open Tax Calculator
            </Link>
            <Link
              to="/income-tax-slabs"
              className="bg-white text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              View Tax Slabs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
