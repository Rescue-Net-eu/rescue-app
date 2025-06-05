import React from 'react';
import Button from '../shared/Button';
import { useTranslation } from 'react-i18next';

export default function ModuleGrid() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* TODO: dynamic modules */}
      <div className="border rounded p-4 flex flex-col items-start">
        <h3 className="font-semibold mb-2">{t('home.modules.alerts')}</h3>
        <Button>{t('home.modules.go_to')}</Button>
      </div>
      <div className="border rounded p-4 flex flex-col items-start">
        <h3 className="font-semibold mb-2">{t('home.modules.missions')}</h3>
        <Button>{t('home.modules.go_to')}</Button>
      </div>
      <div className="border rounded p-4 flex flex-col items-start">
        <h3 className="font-semibold mb-2">{t('home.modules.volunteers')}</h3>
        <Button>{t('home.modules.go_to')}</Button>
      </div>
      {/* TODO */}
    </div>
  );
}
