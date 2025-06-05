import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MissionRow({ mission }) {
  return (
    <tr>
      <td className="border px-2 py-1">
        <Link to={`/missions/${mission.id}`} className="text-blue-600 underline">
          {mission.title}
        </Link>
      </td>
      <td className="border px-2 py-1">
        {new Date(mission.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

export default function MissionList() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    fetch('/api/missions')
      .then((res) => res.json())
      .then((data) => setMissions(data));
  }, []);

  return (
    <div className="space-y-2">
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Title</th>
            <th className="border px-2 py-1 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((m) => (
            <MissionRow key={m.id} mission={m} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
