import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StatsBar() {
  const { t } = useTranslation();
  return (
    <div className="bg-volunteer-blue text-off-white py-4">
      <div className="container mx-auto flex justify-around">
        <div className="text-center">
          <div className="text-2xl font-bold">0</div>
          <div>{t('home.stats.volunteers_online')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">0</div>
          <div>{t('home.stats.active_missions')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">0</div>
          <div>{t('home.stats.countries_covered')}</div>
        </div>
        {/* TODO: real data fetch */}
      </div>
    </div>
  );
}
