import React, { useEffect, useState } from 'react';

export default function MissionDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('/api/missions/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  return (
    <div className="mb-6">
      {summary ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Total Missions</div>
            <div className="text-2xl font-bold">{summary.totalMissions}</div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Total Assignments</div>
            <div className="text-2xl font-bold">{summary.totalAssignments}</div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-500">
        Timeline coming soon
      </div>
    </div>
  );
}
