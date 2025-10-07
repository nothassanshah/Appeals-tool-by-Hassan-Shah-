
import React from 'react';

interface Step4ReasonProps {
  denialReasonText: string;
  setDenialReasonText: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Reason: React.FC<Step4ReasonProps> = ({
  denialReasonText,
  setDenialReasonText,
  onNext,
  onBack,
}) => {
  
  const isNextDisabled = !denialReasonText.trim();

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Denial Reason</h2>
      <p className="text-gray-600 mb-6">
        Please copy and paste the denial reason and any relevant remarks directly from the Explanation of Benefits (EOB) or denial letter into the text box below. This is crucial for creating an effective appeal.
      </p>

      <div>
        <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-1">
          Denial Reason from Payer
        </label>
        <textarea
          id="customReason"
          rows={6}
          value={denialReasonText}
          onChange={(e) => setDenialReasonText(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
          placeholder="e.g., 'Claim denied as not medically necessary per policy guidelines...' or 'Code G0439 is not payable with diagnosis Z12.39...'"
          required
        />
      </div>

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
