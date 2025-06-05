import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-rescue-red text-off-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{t('home.hero.headline')}</h1>
        <p className="mb-6">{t('home.hero.subheading')}</p>
        {/* TODO: background image */}
        {/* TODO: CTA buttons */}
      </div>
    </section>
  );
}
