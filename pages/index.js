import Layout from '../components/Layout'
import ProtectedRoute from '../lib/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="card p-6">
            <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>Active Listings</h3>
            <p className="hint mt-2">You currently have <strong>12</strong> active listings.</p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>Recent Inquiries</h3>
            <ul className="mt-3 hint">
              <li>— 3 new buyer messages today</li>
              <li>— 1 seller follow-up overdue</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>AI Credits</h3>
            <p className="hint mt-2">You have <strong>500</strong> free credits remaining.</p>
          </div>

        </section>

      </Layout>
    </ProtectedRoute>
  )
}
