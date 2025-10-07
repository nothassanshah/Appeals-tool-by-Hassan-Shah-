import React from 'react';
import { Spinner } from './Spinner';
import { Alert } from './Alert';

interface Step5ClarificationProps {
  isLoading: boolean;
  analysis: string;
  questions: string[];
  answers: string;
  setAnswers: (answers: string) => void;
  onNext: () => void;
  onBack: () => void;
  error: string | null;
}

export const Step5Clarification: React.FC<Step5ClarificationProps> = ({
  isLoading,
  analysis,
  questions,
  answers,
  setAnswers,
  onNext,
  onBack,
  error
}) => {
  const isNextDisabled = !answers.trim();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner />
        <p className="mt-4 text-gray-600 font-semibold">AI is analyzing the denial reason to ask for more details...</p>
      </div>
    );
  }
  
  if (error && questions.length === 0) {
      return (
         <div className="animate-fade-in text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Failed</h2>
            <p className="text-gray-600 mb-6">There was an issue generating clarification questions.</p>
            {error && <Alert message={error} onClose={() => {}} />}
             <button
              onClick={onBack}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors"
            >
              Go Back
            </button>
         </div>
      );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Clarification Needed</h2>
      <p className="text-gray-600 mb-6">To build the strongest appeal, please answer the following questions based on the AI's analysis of the denial.</p>

      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-6">
        <p className="mt-1 text-sm"><span className="font-bold">AI Analysis:</span> {analysis}</p>
        <p className="mt-3 font-bold">Please answer:</p>
        <ul className="list-disc list-inside mt-2 text-sm space-y-1">
          {questions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="clarificationAnswers" className="block text-sm font-medium text-gray-700 mb-1">
          Your Detailed Response
        </label>
        <textarea
          id="clarificationAnswers"
          rows={8}
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
          placeholder="Provide as much detail as possible to the questions above..."
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
