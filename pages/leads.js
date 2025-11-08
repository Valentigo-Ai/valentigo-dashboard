import Layout from '../components/Layout';

export default function Leads(){
  return (
    <Layout>
      <div className="card p-6">
        <h2 className="text-xl font-semibold" style={{color:"var(--accent)"}}>Leads</h2>
        <p className="hint mt-2">All leads captured from forms and chat appear here.</p>

        <table className="w-full mt-4 text-sm">
          <thead className="text-[#9aa6ad]/80">
            <tr><th className="text-left pb-2">Name</th><th className="text-left pb-2">Contact</th><th className="text-left pb-2">Source</th><th className="text-left pb-2">Status</th></tr>
          </thead>
          <tbody>
            <tr className="border-t"><td className="py-3">Jane Smith</td><td>jane@agency.co.uk</td><td>Founding Partner Form</td><td>Contacted</td></tr>
            <tr className="border-t"><td className="py-3">Acme Estates</td><td>info@acme.co.uk</td><td>Demo Signup</td><td>Pending</td></tr>
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
