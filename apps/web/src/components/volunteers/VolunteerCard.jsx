import React from 'react';

export function VolunteerCard({ avatar, name, countryFlag, skills }) {
  return (
    <div className="border rounded p-4 flex items-center space-x-3">
      {/* TODO: display info */}
      <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm">{skills && skills.join(', ')}</p>
      </div>
      {countryFlag && <img src={countryFlag} alt="flag" className="w-6 h-4" />}
    </div>
  );
}
