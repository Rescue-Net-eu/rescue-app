import React from 'react';
import { HeroSection, StatsBar, ModuleGrid, LiveAlertTicker } from '../components/home';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <ModuleGrid />
      <LiveAlertTicker />
    </div>
  );
}
