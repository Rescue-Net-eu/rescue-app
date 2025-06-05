import React, { useEffect, useState } from 'react';
import { VolunteerCard } from './VolunteerCard';

function buildQuery(page, country, search) {
  const params = new URLSearchParams();
  params.append('role', 'VOLUNTEER');
  if (page) params.append('page', String(page));
  if (country) params.append('country', country);
  if (search) params.append('search', search);
  return params.toString();
}

export default function VolunteerDirectory() {
  const [volunteers, setVolunteers] = useState([]);
  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    const query = buildQuery(page, country, search);
    const res = await fetch(`/api/users?${query}`);
    const data = await res.json();
    setVolunteers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, [page]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex space-x-2">
        <input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchVolunteers();
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Apply
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {volunteers.map((v) => (
            <li key={v.id}>
              <VolunteerCard
                avatar={v.avatarUrl}
                name={`${v.firstName} ${v.lastName}`}
                countryFlag={v.countryFlagUrl}
                skills={v.skills}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
