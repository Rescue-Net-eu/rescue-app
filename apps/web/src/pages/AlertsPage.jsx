import React from 'react';
import AlertList from '../components/alerts/AlertList';
import AlertMap from '../components/alerts/AlertMap';

export default function AlertsPage() {
  return (
    <div>
      <AlertList />
      <AlertMap />
    </div>
  );
}
