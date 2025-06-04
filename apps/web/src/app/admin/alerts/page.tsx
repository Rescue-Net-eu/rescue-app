'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

type Alert = {
  id: string;
  title: string;
  description?: string;
  country: string;
  region?: string;
  localities: string[];
  status: string;
};

export default function AdminAlertsPage() {
  const { t } = useTranslation('common');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [localities, setLocalities] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    const res = await fetch('/api/alerts?scope=all', {
      headers: { Authorization: `Bearer ${document.cookie.replace('token=', '')}` },
    });
    const data = await res.json();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const createAlert = async () => {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${document.cookie.replace('token=', '')}`,
      },
      body: JSON.stringify({
        title,
        description,
        sourceOrgId: localStorage.getItem('orgId'),
        country,
        region,
        localities: localities.split(',').map((l) => l.trim()),
      }),
    });
    fetchAlerts();
  };

  const approveAlert = async (id: string) => {
    await fetch(`/api/alerts/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${document.cookie.replace('token=', '')}`,
      },
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    fetchAlerts();
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl mb-4">{t('admin.create_alert')}</h1>
      <div className="space-y-2 mb-6">
        <input
          placeholder={t('alerts.title_label') as string}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder={t('alerts.description_label') as string}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder={t('alerts.country_label') as string}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder={t('alerts.region_label') as string}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder={t('alerts.locality_label') as string}
          value={localities}
          onChange={(e) => setLocalities(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={createAlert}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {t('alerts.submit_button')}
        </button>
      </div>

      <section>
        <h2 className="text-xl mb-2">{t('admin.filter_label')}</h2>
        <button
          onClick={() => fetchAlerts()}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          {t('common.loading')}
        </button>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Existing Alerts</h2>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <span>
                    {alert.title} ({t(`alerts.${alert.status.toLowerCase()}_message`)})
                  </span>
                  {alert.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => approveAlert(alert.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      {t('admin.approve_alert')}
                    </button>
                  )}
                </div>
                <p>{alert.description}</p>
                <p>
                  {t('alerts.country_label')}: {alert.country}
                </p>
                {alert.region && (
                  <p>
                    {t('alerts.region_label')}: {alert.region}
                  </p>
                )}
                <p>
                  {t('alerts.locality_label')}: {alert.localities.join(', ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
