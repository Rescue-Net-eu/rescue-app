import React from 'react';
import { useParams } from 'react-router-dom';
import MissionDetail from '../components/missions/MissionDetail';

export default function MissionDetailPage() {
  const { missionId } = useParams();
  return <MissionDetail missionId={missionId} />;
}
