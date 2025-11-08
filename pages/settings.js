import Layout from '../components/Layout';

export default function Settings(){
  return (
    <Layout>
      <div className="card p-6 max-w-2xl">
        <h2 className="text-xl font-semibold" style={{color:"var(--accent)"}}>Settings</h2>
        <p className="hint mt-2">Account and team settings will appear here.</p>

        <div className="mt-6">
          <label className="block text-sm" style={{color:"#9aa6ad"}}>Company</label>
          <input className="mt-1 px-3 py-2 rounded-md border w-full bg-transparent" defaultValue="Valentigo" />
        </div>
      </div>
    </Layout>
  )
}
