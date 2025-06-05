import React from 'react';

export function AlertCard({ flag, title, timestamp, urgency }) {
  return (
    <div className="border rounded p-3 flex items-center">
      {/* TODO: UI with Tailwind */}
      <img src={flag} alt="flag" className="w-6 h-4 mr-2" />
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
      <span className="ml-2 text-xs">{urgency}</span>
    </div>
  );
}
