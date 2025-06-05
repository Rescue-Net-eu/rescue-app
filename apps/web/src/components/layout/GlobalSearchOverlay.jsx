import React, { useState } from 'react';
import api from '../../utils/api';

export default function GlobalSearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    const res = await api(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-lg">
        <input
          className="border p-2 w-full mb-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <div className="flex justify-end mb-2">
          <button className="mr-2" onClick={onClose}>Close</button>
          <button onClick={handleSearch}>Search</button>
        </div>
        {results && (
          <div className="max-h-60 overflow-y-auto">
            <h4 className="font-bold">Alerts</h4>
            <ul>
              {results.alerts.map((a) => (
                <li key={a.id}>{a.title}</li>
              ))}
            </ul>
            <h4 className="font-bold mt-2">Missions</h4>
            <ul>
              {results.missions.map((m) => (
                <li key={m.id}>{m.title}</li>
              ))}
            </ul>
            <h4 className="font-bold mt-2">Volunteers</h4>
            <ul>
              {results.volunteers.map((v) => (
                <li key={v.id}>{v.firstName} {v.lastName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
