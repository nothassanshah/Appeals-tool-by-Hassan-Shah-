import React from 'react';
import type { UserDetailsState } from '../types';

interface Step4UserDetailsProps {
  userDetails: UserDetailsState;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsState>>;
  onGenerateAppeal: () => void;
  onBack: () => void;
}

const InputField: React.FC<{
  label: string;
  name: keyof UserDetailsState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', className = '', placeholder = '' }) => (
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
      placeholder={placeholder}
    />
  </div>
);

export const Step4UserDetails: React.FC<Step4UserDetailsProps> = ({ userDetails, setUserDetails, onGenerateAppeal, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const isFormIncomplete = Object.values(userDetails).some(value => value === '');

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Details</h2>
      <p className="text-gray-600 mb-6">Provide your contact information and specify the recipient of the appeal.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Attention To" name="attentionTo" value={userDetails.attentionTo} onChange={handleChange} placeholder="e.g., Appeals Department" className="md:col-span-2"/>
         <InputField label="Your Name" name="userName" value={userDetails.userName} onChange={handleChange} placeholder="e.g., Jane Doe"/>
         <InputField label="Your Designation / Title" name="userDesignation" value={userDetails.userDesignation} onChange={handleChange} placeholder="e.g., Billing Manager"/>
         <InputField label="Your Email" name="userEmail" value={userDetails.userEmail} onChange={handleChange} type="email" placeholder="e.g., jane.doe@provider.com"/>
         <InputField label="Office Phone Number" name="userPhone" value={userDetails.userPhone} onChange={handleChange} placeholder="e.g., (555) 123-4567"/>
         <InputField label="Office Fax Number" name="userFax" value={userDetails.userFax} onChange={handleChange} placeholder="e.g., (555) 123-4568"/>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onGenerateAppeal}
          disabled={isFormIncomplete}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Generate Appeal
        </button>
      </div>
    </div>
  );
};