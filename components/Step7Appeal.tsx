
import React, { useState, useEffect } from 'react';

interface Step7AppealProps {
  generatedLetter: string;
  onStartNew: () => void;
}

export const Step7Appeal: React.FC<Step7AppealProps> = ({ generatedLetter, onStartNew }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Generated Appeal Letter</h2>
      <p className="text-gray-600 mb-6">Review the letter below. You can copy it to your clipboard for use.</p>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[50vh] overflow-y-auto shadow-inner">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
          {generatedLetter}
        </pre>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onStartNew}
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors"
        >
          Start New Appeal
        </button>
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 transition-colors disabled:bg-green-500"
          disabled={isCopied}
        >
          {isCopied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
};
