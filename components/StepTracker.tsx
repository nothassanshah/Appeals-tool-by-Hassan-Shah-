import React from 'react';

interface StepTrackerProps {
  currentStep: number;
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const Step = ({
  step,
  label,
  currentStep,
}: {
  step: number;
  label: string;
  currentStep: number;
}) => {
  const isCompleted = currentStep > step;
  const isActive = currentStep === step;

  return (
    <div className="flex flex-col items-center w-24 text-center">
      <div
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
          isCompleted
            ? 'bg-teal-500'
            : isActive
            ? 'bg-white'
            : 'bg-gray-200'
        }`}
      >
        {isCompleted ? (
          <CheckIcon />
        ) : (
          <span
            className={`text-lg font-bold ${
              isActive ? 'text-teal-500' : 'text-gray-500'
            }`}
          >
            {step}
          </span>
        )}
        {isActive && (
          <div className="absolute -inset-1 rounded-full border-2 border-teal-500 ring-2 ring-teal-500 ring-opacity-50" />
        )}
      </div>
      <p
        className={`mt-2 text-xs font-medium ${
          isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'
        }`}
      >
        {label}
      </p>
    </div>
  );
};

export const StepTracker: React.FC<StepTrackerProps> = ({ currentStep }) => {
  const steps = [
    'Patient Info',
    'Provider Info',
    'Claim Info',
    'Denial Reason',
    'Clarification',
    'Documentation',
    'Your Details',
    'Generated Appeal',
  ];

  return (
    <div className="w-full mx-auto mb-12">
      <div className="flex items-start justify-between">
        {steps.map((label, index) => (
          <React.Fragment key={index}>
            <Step step={index + 1} label={label} currentStep={currentStep} />
            {index < steps.length - 1 && (
              <div
                className={`mt-5 h-1 flex-1 rounded-full ${
                  currentStep > index + 1 ? 'bg-teal-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};