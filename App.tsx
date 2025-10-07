import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

import type { PatientInfoState, ProviderInfoState, ClaimInfoState, UserDetailsState } from './types';
import { generateAppealLetterPrompt, generateClarificationQuestionsPrompt, clarificationQuestionsSchema } from './services/geminiService';

import { StepTracker } from './components/StepTracker';
import { Step1PatientInfo } from './components/Step1PatientInfo';
import { Step2ProviderInfo } from './components/Step2ProviderInfo';
import { Step3ClaimInfo } from './components/Step3ClaimInfo';
import { Step4Reason } from './components/Step4Reason';
import { Step5Clarification } from './components/Step5Clarification';
import { Step6Docs } from './components/Step6Docs';
import { Step7UserDetails } from './components/Step7UserDetails';
import { Step8Appeal } from './components/Step8Appeal';
import { Spinner } from './components/Spinner';
import { Alert } from './components/Alert';

const initialPatientInfo: PatientInfoState = {
  patientName: '',
  dateOfBirth: '',
  memberId: '',
};

const initialProviderInfo: ProviderInfoState = {
  providerName: '',
  npiNumber: '',
  taxId: '',
  providerState: '',
};

const initialClaimInfo: ClaimInfoState = {
    claimNumber: '',
    dateOfService: '',
    billedAmount: '',
    cptCodes: '',
    denialDate: '',
};

const initialUserDetails: UserDetailsState = {
  attentionTo: '',
  userName: '',
  userDesignation: '',
  userEmail: '',
  userPhone: '',
  userFax: '',
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfoState>(initialPatientInfo);
  const [providerInfo, setProviderInfo] = useState<ProviderInfoState>(initialProviderInfo);
  const [claimInfo, setClaimInfo] = useState<ClaimInfoState>(initialClaimInfo);
  const [denialReasonText, setDenialReasonText] = useState('');
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [clarificationAnalysis, setClarificationAnalysis] = useState('');
  const [clarificationAnswers, setClarificationAnswers] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetailsState>(initialUserDetails);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resetState = () => {
    setCurrentStep(1);
    setPatientInfo(initialPatientInfo);
    setProviderInfo(initialProviderInfo);
    setClaimInfo(initialClaimInfo);
    setDenialReasonText('');
    setClarificationQuestions([]);
    setClarificationAnalysis('');
    setClarificationAnswers('');
    setUploadedFiles([]);
    setUserDetails(initialUserDetails);
    setGeneratedLetter('');
    setIsLoading(false);
    setError(null);
  }

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => {
      setError(null);
      setCurrentStep((prev) => prev - 1);
  }

  const handleGenerateClarificationQuestions = useCallback(async () => {
    if (!denialReasonText.trim()) {
      setError("A denial reason must be provided.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCurrentStep(5); // Move to the clarification step to show its loading state

    try {
      const prompt = generateClarificationQuestionsPrompt(denialReasonText);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: clarificationQuestionsSchema,
        },
      });

      const resultJson = JSON.parse(response.text);
      if (resultJson && resultJson.questions && resultJson.analysis) {
        setClarificationQuestions(resultJson.questions);
        setClarificationAnalysis(resultJson.analysis);
      } else {
        throw new Error("AI did not return the expected question format.");
      }
    } catch (e) {
      console.error("Error generating clarification questions:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while analyzing the denial. Please go back and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [denialReasonText]);


  const fileToGenerativePart = (file: File): Promise<{ inlineData: { mimeType: string; data: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (!base64Data) {
                reject(new Error("Failed to read file data."));
                return;
            }
            resolve({
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                },
            });
        };
        reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerateAppeal = useCallback(async () => {
    if (!denialReasonText.trim()) {
      setError("A denial reason must be provided.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const fullFormData = { ...patientInfo, ...providerInfo, ...claimInfo };
      const promptText = generateAppealLetterPrompt(fullFormData, denialReasonText, clarificationAnswers, userDetails, uploadedFiles.length > 0);
      
      const fileParts = await Promise.all(
        uploadedFiles.map(file => fileToGenerativePart(file))
      );
      
      const promptParts = [
        { text: promptText },
        ...fileParts,
      ];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: promptParts }],
      });

      const letterText = response.text;
      if (!letterText) {
        throw new Error("The AI returned an empty response. Please try again.");
      }

      setGeneratedLetter(letterText);
      setCurrentStep(8);

    } catch (e) {
      console.error("Error generating appeal:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [patientInfo, providerInfo, claimInfo, denialReasonText, clarificationAnswers, uploadedFiles, userDetails]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PatientInfo patientInfo={patientInfo} setPatientInfo={setPatientInfo} onNext={handleNextStep} />;
      case 2:
        return <Step2ProviderInfo providerInfo={providerInfo} setProviderInfo={setProviderInfo} onNext={handleNextStep} onBack={handlePrevStep} />;
      case 3:
        return <Step3ClaimInfo claimInfo={claimInfo} setClaimInfo={setClaimInfo} onNext={handleNextStep} onBack={handlePrevStep} />;
      case 4:
        return (
          <Step4Reason
            denialReasonText={denialReasonText}
            setDenialReasonText={setDenialReasonText}
            onNext={handleGenerateClarificationQuestions}
            onBack={handlePrevStep}
          />
        );
       case 5:
        return (
          <Step5Clarification
            isLoading={isLoading}
            analysis={clarificationAnalysis}
            questions={clarificationQuestions}
            answers={clarificationAnswers}
            setAnswers={setClarificationAnswers}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            error={error}
          />
        );
      case 6:
        return (
          <Step6Docs
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 7:
          return (
            <Step7UserDetails
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              onGenerateAppeal={handleGenerateAppeal}
              onBack={handlePrevStep}
            />
          );
      case 8:
        return <Step8Appeal generatedLetter={generatedLetter} onStartNew={resetState} />;
      default:
        return <Step1PatientInfo patientInfo={patientInfo} setPatientInfo={setPatientInfo} onNext={handleNextStep} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8 flex items-center justify-center">
      <main className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Appeals Tool</h1>
          <p className="text-gray-500 mt-1">by Hassan Shah</p>
        </header>

        {currentStep < 8 && <StepTracker currentStep={currentStep} />}
        
        {error && currentStep !== 5 && <Alert message={error} onClose={() => setError(null)} />}

        <div className="relative">
          {isLoading && currentStep !== 5 && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
              <Spinner />
              <p className="mt-4 text-gray-600 font-semibold">Generating your appeal... This may take a moment.</p>
            </div>
          )}
          <div className={`${(isLoading && currentStep !== 5) ? 'opacity-20' : ''}`}>
            {renderCurrentStep()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;