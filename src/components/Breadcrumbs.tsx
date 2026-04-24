import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: 'Home', path: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4">
      <ol className="flex items-center gap-1 flex-wrap">
        {allItems.map((item, index) => (
          <li key={item.path} className="flex items-center gap-1">
            {index > 0 && <span className="text-slate-300">›</span>}
            {index === allItems.length - 1 ? (
              <span className="text-slate-700 font-medium" aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-indigo-600 transition-colors">{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
