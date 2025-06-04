import React from 'react';
import { useParams } from 'react-router-dom';
import AlertDetail from '../components/alerts/AlertDetail';

export default function AlertDetailPage() {
  const { alertId } = useParams();
  return <AlertDetail alertId={alertId} />;
}
