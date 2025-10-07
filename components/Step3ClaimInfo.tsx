
import React from 'react';
import type { ClaimInfoState } from '../types';

interface Step3ClaimInfoProps {
  claimInfo: ClaimInfoState;
  setClaimInfo: React.Dispatch<React.SetStateAction<ClaimInfoState>>;
  onNext: () => void;
  onBack: () => void;
}

const InputField: React.FC<{
  label: string;
  name: keyof ClaimInfoState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}> = ({ label, name, value, onChange, type = 'text', className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
      required
    />
  </div>
);

export const Step3ClaimInfo: React.FC<Step3ClaimInfoProps> = ({ claimInfo, setClaimInfo, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClaimInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const isFormIncomplete = Object.values(claimInfo).some(value => value === '');

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Claim Information</h2>
      <p className="text-gray-600 mb-6">Please enter all details exactly as they appear on the claim form and denial letter.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Claim Number" name="claimNumber" value={claimInfo.claimNumber} onChange={handleChange} />
        <InputField label="Date of Service" name="dateOfService" value={claimInfo.dateOfService} onChange={handleChange} type="date" />
        <InputField label="Billed Amount ($)" name="billedAmount" value={claimInfo.billedAmount} onChange={handleChange} type="text" />
        <InputField label="Denial Date" name="denialDate" value={claimInfo.denialDate} onChange={handleChange} type="date" />
        <InputField label="CPT/HCPCS/Procedural Codes" name="cptCodes" value={claimInfo.cptCodes} onChange={handleChange} className="md:col-span-2" />
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
          disabled={isFormIncomplete}
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
