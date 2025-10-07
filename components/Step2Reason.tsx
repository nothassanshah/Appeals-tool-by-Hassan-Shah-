
import React, { useState } from 'react';
import { DENIAL_REASONS } from '../constants';
import type { DenialReason } from '../types';

interface Step2ReasonProps {
  selectedReason: DenialReason | null;
  setSelectedReason: (reason: DenialReason | null) => void;
  customReasonText: string;
  setCustomReasonText: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Reason: React.FC<Step2ReasonProps> = ({
  selectedReason,
  setSelectedReason,
  customReasonText,
  setCustomReasonText,
  onNext,
  onBack,
}) => {
  const handleSelectReason = (reason: DenialReason) => {
    setSelectedReason(reason);
  };
  
  const isNextDisabled = !selectedReason || (selectedReason.id === 'other' && !customReasonText.trim());

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Denial Reason</h2>
      <p className="text-gray-600 mb-6">Select the primary reason for the claim denial.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DENIAL_REASONS.map((reason) => (
          <div
            key={reason.id}
            onClick={() => handleSelectReason(reason)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedReason?.id === reason.id
                ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500'
                : 'bg-white hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <h3 className="font-bold text-lg text-gray-800">{reason.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
          </div>
        ))}
      </div>

      {selectedReason?.id === 'other' && (
        <div className="mt-6 animate-fade-in">
          <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-1">
            Please specify the custom denial reason
          </label>
          <textarea
            id="customReason"
            rows={4}
            value={customReasonText}
            onChange={(e) => setCustomReasonText(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
            placeholder="Enter the reason exactly as it appears on the denial letter..."
          />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
