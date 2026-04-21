import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const BASE_URL = 'https://taxcalculator.in';

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: 'Home', path: '/' }, ...items];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BASE_URL}${item.path}`,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
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
    </>
  );
}
