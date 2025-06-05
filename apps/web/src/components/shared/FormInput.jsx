import React from 'react';

export function FormInput({ label, name, type = 'text', value, onChange, error }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block mb-1">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
