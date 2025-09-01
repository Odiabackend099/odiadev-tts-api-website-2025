"use client";
import { useEffect, useState } from "react";

export default function AdminKeys() {
  const [token, setToken] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", domains: "", ratePerMin: 60, dailyQuota: 2000 });

  async function load() {
    const r = await fetch("/api/admin/keys/list", { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) setList(await r.json());
  }
  async function issue() {
    const body = {
      name: form.name || "Unnamed",
      domains: form.domains.split(",").map(s => s.trim()).filter(Boolean),
      ratePerMin: +form.ratePerMin,
      dailyQuota: +form.dailyQuota
    };
    const r = await fetch("/api/admin/keys/issue", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    alert("New key (copy now): " + j.apiKey);
    load();
  }
  async function revoke(prefix: string) {
    await fetch("/api/admin/keys/revoke", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prefix })
    });
    load();
  }

  useEffect(() => { if (token) load(); }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold">ODIADEV · API Keys</h1>

      <div className="p-4 border rounded-xl">
        <label className="block text-sm text-slate-600">Admin Token</label>
        <input value={token} onChange={e=>setToken(e.target.value)}
          className="mt-1 w-full border rounded-lg p-2" placeholder="Paste ADMIN_TOKEN" />
      </div>

      <div className="p-4 border rounded-xl space-y-3">
        <h2 className="text-xl font-semibold">Issue new key</h2>
        <input className="w-full border rounded-lg p-2" placeholder="Name (Project A)"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="w-full border rounded-lg p-2" placeholder="Allowed Domains (comma separated)"
          value={form.domains} onChange={e=>setForm({...form, domains:e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded-lg p-2" type="number" min={1}
            value={form.ratePerMin} onChange={e=>setForm({...form, ratePerMin:e.target.value as any})}/>
          <input className="border rounded-lg p-2" type="number" min={1}
            value={form.dailyQuota} onChange={e=>setForm({...form, dailyQuota:e.target.value as any})}/>
        </div>
        <button onClick={issue} className="px-4 py-2 rounded-lg bg-black text-white">Create Key</button>
      </div>

      <div className="p-4 border rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Active keys</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th>Name</th><th>Prefix</th><th>Domains</th><th>Rate</th><th>Daily</th><th></th></tr></thead>
          <tbody>
            {list.map(k=>(
              <tr key={k.id} className="border-t">
                <td>{k.name}</td>
                <td><code>{k.type}_live_{k.prefix}_…</code></td>
                <td>{(k.domainAllow||[]).join(", ")}</td>
                <td>{k.ratePerMin}/min</td>
                <td>{k.dailyQuota}/day</td>
                <td>
                  {!k.revokedAt ? (
                    <button onClick={()=>revoke(k.prefix)} className="text-red-600">Revoke</button>
                  ) : <span className="text-slate-500">revoked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}