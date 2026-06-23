import Layout from '../components/Layout';
import Link from 'next/link';
import ProtectedRoute from '../lib/ProtectedRoute';

export default function AITools() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="card p-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--accent)' }}>AI Tools</h2>
          <p className="hint mt-2">AI-powered tools to help you work faster and win more instructions.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Tool
              title="Property Description Generator"
              desc="Generate professional Rightmove/Zoopla-ready listings in seconds."
              href="/generator"
            />
            <Tool
              title="Seller Lead Nurture"
              desc="Automated follow-ups and nurture sequences."
              href="#"
              soon
            />
            <Tool
              title="Tenant / Buyer Assistant"
              desc="Instant Q&A and booking assistant."
              href="#"
              soon
            />
            <Tool
              title="Batch Export"
              desc="Generate descriptions for multiple listings at once."
              href="#"
              soon
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function Tool({ title, desc, href, soon }) {
  return (
    <div className="card p-4">
      <h3 className="font-semibold" style={{ color: 'var(--accent)' }}>{title}</h3>
      <p className="hint mt-2">{desc}</p>
      <div className="mt-4">
        {soon ? (
          <span className="inline-block text-sm px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400">
            Coming soon
          </span>
        ) : (
          <Link href={href} className="btn">
            Open
          </Link>
        )}
      </div>
    </div>
  );
}
