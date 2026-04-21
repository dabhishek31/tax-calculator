import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy — India Income Tax Calculator"
        description="Privacy policy for the India Income Tax Calculator. We do not collect, store, or transmit any personal or financial data. All calculations are performed locally in your browser."
        path="/privacy-policy"
        breadcrumbs={[{ name: 'Privacy Policy', path: '/privacy-policy' }]}
      />

      <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-2xl">🇮🇳</span> India Tax Calculator
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main">
        <Breadcrumbs items={[{ label: 'Privacy Policy', path: '/privacy-policy' }]} />

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: April 2026</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Summary</h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800 mb-4">
              <strong>We do not collect, store, or transmit any personal or financial data.</strong> All tax calculations are performed entirely in your web browser. Your salary, deductions, and other inputs never leave your device.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Data Collection</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The India Income Tax Calculator is a client-side application. This means:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• <strong>No personal data</strong> is collected or stored</li>
              <li>• <strong>No financial information</strong> (salary, investments, deductions) is sent to any server</li>
              <li>• <strong>No cookies</strong> are used for tracking purposes</li>
              <li>• <strong>No user accounts</strong> are required to use the calculator</li>
              <li>• <strong>No analytics or tracking scripts</strong> are loaded</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">How Your Data is Processed</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              When you enter your income, deductions, and other details into the calculator, all processing happens within your web browser using JavaScript. The results are computed in real-time on your device. If you close the browser tab, all entered data is immediately lost — nothing is persisted to local storage or any cloud service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">PDF & Markdown Downloads</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The "Download Report" feature generates PDF and Markdown files entirely within your browser using the jsPDF library. The generated file is created on your device and downloaded directly — it is never uploaded to any server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Third-Party Services</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This website may use a Content Delivery Network (CDN) to serve static assets (HTML, CSS, JavaScript files). The CDN provider may collect standard access logs (IP address, browser type, page URL) as part of their service. We do not have access to or use this data for any purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Open Source</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This calculator is open-source software. You can review the entire source code at{' '}
              <a href="https://github.com/dabhishek31/tax-calculator" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">
                github.com/dabhishek31/tax-calculator
              </a>{' '}
              to verify that no data collection or tracking is implemented.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Contact</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              If you have any questions about this privacy policy, please reach out via{' '}
              <a href="https://github.com/dabhishek31/tax-calculator/issues" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">
                GitHub Issues
              </a>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
