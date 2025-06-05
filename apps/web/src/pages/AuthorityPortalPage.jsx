import React, { useEffect, useState } from 'react';

export default function AuthorityPortalPage() {
  const [pending, setPending] = useState([]);
  const [file, setFile] = useState(null);

  const fetchPending = async () => {
    const res = await fetch('/api/alerts?scope=all');
    const data = await res.json();
    setPending(data.filter((a) => a.status === 'PENDING_APPROVAL'));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    await fetch(`/api/alerts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    fetchPending();
  };

  const importData = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/authority/import', { method: 'POST', body: formData });
    setFile(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Authority Portal</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-2">Pending Approvals</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Title</th>
              <th className="border px-2 py-1 text-left">Country</th>
              <th className="border px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.title}</td>
                <td className="border px-2 py-1">{p.country}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => approve(p.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl mb-2">Import Data</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <button
          onClick={importData}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Upload
        </button>
      </section>
    </div>
  );
}
