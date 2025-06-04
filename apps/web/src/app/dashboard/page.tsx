'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

type Mission = {
  id: string;
  title: string;
  description?: string;
};

type Alert = {
  id: string;
  title: string;
  description?: string;
  status: string;
};

export default function DashboardPage() {
  const { t } = useTranslation('common');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const fetchMissions = async () => {
    setLoadingMissions(true);
    const res = await fetch('/api/missions', {
      headers: { Authorization: `Bearer ${document.cookie.replace('token=', '')}` },
    });
    const data = await res.json();
    setMissions(data);
    setLoadingMissions(false);
  };

  const subscribeToMission = async (missionId: string) => {
    await fetch(`/api/missions/${missionId}/assign/${localStorage.getItem('userId')}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${document.cookie.replace('token=', '')}` },
    });
    fetchMissions();
  };

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    const res = await fetch('/api/alerts?scope=local', {
      headers: { Authorization: `Bearer ${document.cookie.replace('token=', '')}` },
    });
    const data = await res.json();
    setAlerts(data);
    setLoadingAlerts(false);
  };

  const subscribeToAlert = async (alertId: string) => {
    await fetch(`/api/alerts/${alertId}/subscribe/${localStorage.getItem('userId')}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${document.cookie.replace('token=', '')}` },
    });
    fetchAlerts();
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl mb-4">{t('dashboard.welcome', { name: localStorage.getItem('userName') })}</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-2">{t('dashboard.view_missions')}</h2>
        {loadingMissions ? (
          <p>{t('common.loading')}</p>
        ) : (
          <ul className="space-y-2">
            {missions.map((mission) => (
              <li key={mission.id} className="flex justify-between items-center border p-2 rounded">
                <span>{mission.title}</span>
                <button
                  onClick={() => subscribeToMission(mission.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  {t('dashboard.subscribe_alert')}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={fetchMissions}
          className="mt-4 bg-blue-600 text-white p-2 rounded"
        >
          {t('dashboard.view_missions')}
        </button>
      </section>

      <section>
        <h2 className="text-xl mb-2">{t('dashboard.view_alerts')}</h2>
        {loadingAlerts ? (
          <p>{t('common.loading')}</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex justify-between items-center border p-2 rounded">
                <span>{alert.title} ({t(`alerts.${alert.status.toLowerCase()}_message`)})</span>
                <button
                  onClick={() => subscribeToAlert(alert.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  {t('dashboard.subscribe_alert')}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={fetchAlerts}
          className="mt-4 bg-blue-600 text-white p-2 rounded"
        >
          {t('dashboard.view_alerts')}
        </button>
      </section>
    </main>
  );
}
