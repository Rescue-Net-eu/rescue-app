import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 bg-volunteer-blue text-off-white rounded hover:bg-volunteer-blue/90"
      {...props}
    >
      {children}
    </button>
  );
}
