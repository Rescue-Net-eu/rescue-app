import React from 'react';
import MissionChat from './MissionChat';

export default function MissionDetail({ missionId }) {
  return (
    <div className="container mx-auto py-8">
      {/* TODO: fetch /missions/:missionId, assignment panel, resource tracker */}
      <MissionChat missionId={missionId} />
    </div>
  );
}
