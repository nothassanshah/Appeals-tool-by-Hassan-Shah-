
import React from 'react';
import type { FormDataState } from '../types';

interface Step1InfoProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  onNext: () => void;
}

const InputField: React.FC<{
  label: string;
  name: keyof FormDataState;
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

export const Step1Info: React.FC<Step1InfoProps> = ({ formData, setFormData, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const isFormIncomplete = Object.values(formData).some(value => value === '');

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Claim Information</h2>
      <p className="text-gray-600 mb-6">Please enter all details exactly as they appear on the claim form.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} />
        <InputField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
        <InputField label="Member ID" name="memberId" value={formData.memberId} onChange={handleChange} />
        <InputField label="Claim Number" name="claimNumber" value={formData.claimNumber} onChange={handleChange} />
        <InputField label="Date of Service" name="dateOfService" value={formData.dateOfService} onChange={handleChange} type="date" />
        <InputField label="Billed Amount ($)" name="billedAmount" value={formData.billedAmount} onChange={handleChange} type="text" />
        <InputField label="CPT/HCPCS/Procedural Codes" name="cptCodes" value={formData.cptCodes} onChange={handleChange} className="md:col-span-2" />
        <InputField label="Provider Name" name="providerName" value={formData.providerName} onChange={handleChange} />
        <InputField label="NPI Number" name="npiNumber" value={formData.npiNumber} onChange={handleChange} />
        <InputField label="Tax ID" name="taxId" value={formData.taxId} onChange={handleChange} />
        <InputField label="Rendering Provider State (e.g., CA)" name="providerState" value={formData.providerState} onChange={handleChange} />
      </div>

      <div className="mt-8 flex justify-end">
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
