import Layout from '../components/Layout';
import Link from 'next/link';

export default function AITools(){
  return (
    <Layout>
      <div className="card p-6">
        <h2 className="text-xl font-semibold" style={{color:"var(--accent)"}}>AI Tools</h2>
        <p className="hint mt-2">Property Description Generator, Seller Nurture, Tenant Assistant — ready to wire up.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Tool title="Property Description Generator" desc="Generate SEO-ready listings quickly." href="/ai-tools/property" />
          <Tool title="Seller Lead Nurture" desc="Automated follow-ups and nurture sequences." href="/ai-tools/seller" />
          <Tool title="Tenant / Buyer Assistant" desc="Instant Q&A and booking assistant." href="/ai-tools/tenant" />
          <Tool title="Batch Export" desc="Generate descriptions for multiple listings." href="/ai-tools/batch" />
        </div>
      </div>
    </Layout>
  )
}

function Tool({title,desc,href}){
  return (
    <div className="card p-4">
      <h3 className="font-semibold" style={{color:"var(--accent)"}}>{title}</h3>
      <p className="hint mt-2">{desc}</p>
      <div className="mt-4">
        <Link href={href}><a className="btn">Open</a></Link>
      </div>
    </div>
  )
}
