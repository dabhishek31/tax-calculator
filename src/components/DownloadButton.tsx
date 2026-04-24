import { useState, useRef, useEffect } from 'react';
import type { ReportData } from '../utils/reportGenerator';

interface Props {
  data: ReportData;
}

export default function DownloadButton({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<'pdf' | 'md' | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handle(type: 'pdf' | 'md') {
    setOpen(false);
    setLoading(type);
    try {
      const { downloadPDF, downloadMarkdown } = await import('../utils/reportGenerator');
      if (type === 'pdf') await downloadPDF(data);
      else downloadMarkdown(data);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading !== null}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        {loading ? (
          <span className="animate-spin text-sm">⟳</span>
        ) : (
          <span>⬇</span>
        )}
        {loading === 'pdf' ? 'Generating PDF…' : loading === 'md' ? 'Preparing…' : 'Download Report'}
        {!loading && <span className="text-indigo-300">▾</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10 overflow-hidden">
          <button
            onClick={() => handle('pdf')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            <span>📄</span>
            <div className="text-left">
              <p className="font-semibold">PDF Report</p>
              <p className="text-slate-400">Formatted · printable</p>
            </div>
          </button>
          <div className="border-t border-slate-100" />
          <button
            onClick={() => handle('md')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            <span>📝</span>
            <div className="text-left">
              <p className="font-semibold">Markdown</p>
              <p className="text-slate-400">Plain text · shareable</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
