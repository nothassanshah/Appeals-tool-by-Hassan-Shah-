
import React from 'react';
import type { PatientInfoState } from '../types';

interface Step1PatientInfoProps {
  patientInfo: PatientInfoState;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfoState>>;
  onNext: () => void;
}

const InputField: React.FC<{
  label: string;
  name: keyof PatientInfoState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}> = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
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

export const Step1PatientInfo: React.FC<Step1PatientInfoProps> = ({ patientInfo, setPatientInfo, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const isFormIncomplete = Object.values(patientInfo).some(value => value === '');

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Information</h2>
      <p className="text-gray-600 mb-6">Enter the patient's details as they appear on their insurance card.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Patient Name" name="patientName" value={patientInfo.patientName} onChange={handleChange} />
        <InputField label="Date of Birth" name="dateOfBirth" value={patientInfo.dateOfBirth} onChange={handleChange} type="date" />
        <InputField label="Member ID" name="memberId" value={patientInfo.memberId} onChange={handleChange} />
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
