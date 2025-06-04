import React from 'react';
import MissionDashboard from '../components/missions/MissionDashboard';
import MissionList from '../components/missions/MissionList';

export default function MissionsPage() {
  return (
    <div>
      <MissionDashboard />
      <MissionList />
    </div>
  );
}
