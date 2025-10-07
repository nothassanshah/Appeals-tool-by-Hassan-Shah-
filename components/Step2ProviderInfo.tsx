
import React, { useState, useMemo } from 'react';
import type { ProviderInfoState } from '../types';
import { US_STATES } from '../constants';
import { validateNPI, validateTaxID } from '../utils/validation';

interface Step2ProviderInfoProps {
  providerInfo: ProviderInfoState;
  setProviderInfo: React.Dispatch<React.SetStateAction<ProviderInfoState>>;
  onNext: () => void;
  onBack: () => void;
}

const InputField: React.FC<{
  label: string;
  name: keyof ProviderInfoState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}> = ({ label, name, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md shadow-sm sm:text-sm p-2 ${
        error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
      }`}
      required
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export const Step2ProviderInfo: React.FC<Step2ProviderInfoProps> = ({ providerInfo, setProviderInfo, onNext, onBack }) => {
  const [errors, setErrors] = useState({ npiNumber: null, taxId: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProviderInfo((prev) => ({ ...prev, [name]: value }));

    if (name === 'npiNumber') {
      setErrors(prev => ({ ...prev, npiNumber: validateNPI(value) }));
    }
    if (name === 'taxId') {
      setErrors(prev => ({ ...prev, taxId: validateTaxID(value) }));
    }
  };
  
  const isFormIncomplete = useMemo(() => {
    return Object.values(providerInfo).some(value => value === '') || Object.values(errors).some(err => err !== null);
  }, [providerInfo, errors]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Provider Information</h2>
      <p className="text-gray-600 mb-6">Enter the rendering provider's details.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
            <InputField label="Provider Name" name="providerName" value={providerInfo.providerName} onChange={handleChange} />
        </div>
        <InputField label="NPI Number" name="npiNumber" value={providerInfo.npiNumber} onChange={handleChange} error={errors.npiNumber} />
        <InputField label="Tax ID" name="taxId" value={providerInfo.taxId} onChange={handleChange} error={errors.taxId} />
        <div>
            <label htmlFor="providerState" className="block text-sm font-medium text-gray-700 mb-1">
                Rendering Provider State
            </label>
            <select
                id="providerState"
                name="providerState"
                value={providerInfo.providerState}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
            >
                <option value="" disabled>Select a state</option>
                {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
        </div>
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
