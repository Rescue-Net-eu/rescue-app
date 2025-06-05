import React from 'react';

export function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 max-w-lg w-full">
        {/* TODO: close button */}
        {children}
      </div>
    </div>
  );
}
