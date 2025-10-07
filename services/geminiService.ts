import { Type } from '@google/genai';
import type { FormDataState, UserDetailsState } from '../types';

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  // Input date is YYYY-MM-DD. We add 'T00:00:00' to avoid timezone issues.
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const clarificationQuestionsSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "A brief, one-sentence analysis of the denial reason.",
    },
    questions: {
      type: Type.ARRAY,
      description: "A list of targeted questions to ask the user to gather necessary information for the appeal.",
      items: { type: Type.STRING },
    },
  },
  required: ['analysis', 'questions'],
};


export const generateClarificationQuestionsPrompt = (denialReasonText: string): string => {
  return `You are an expert medical billing analyst. Your task is to analyze a given insurance claim denial reason and generate specific, targeted follow-up questions for the user. These questions should elicit the exact information needed to write a powerful and effective appeal letter.

Analyze the following denial reason:
"${denialReasonText}"

Based on your analysis, generate a list of questions.

**Examples:**
- If the denial is "No Authorization," ask things like: "Was prior authorization obtained? If yes, please provide the authorization number and date it was obtained. If no, was this an emergency service that would not require pre-authorization?"
- If the denial is "Timely Filing Limit Exceeded," ask things like: "What was the original submission date of the claim? Do you have proof of original submission (e.g., a clearinghouse report or payer confirmation number)? If the claim was rejected previously, what was the reason for the rejection and on what date was it rejected?"
- If the denial is "Not Medically Necessary," ask things like: "Can you provide a brief clinical summary explaining why this service was medically necessary for this patient at this time? Mention any specific symptoms, failed prior treatments, or relevant diagnoses."

Return your response in a structured JSON format. The JSON object must contain a brief 'analysis' of the denial and a 'questions' array.
`;
};


export const generateAppealLetterPrompt = (
  formData: FormDataState,
  denialReasonText: string,
  clarificationAnswers: string,
  userDetails: UserDetailsState,
  hasFiles: boolean
): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const fileAnalysisInstruction = hasFiles
    ? `
**File Analysis Instructions:**
To build the strongest case, you must carefully analyze ALL provided documents.
- If the documents appear to be **medical records** (e.g., physician's notes, lab results, imaging reports), you MUST use them to construct a highly detailed and compelling argument for medical necessity. Go beyond the generic template argument and quote specific findings, dates, and clinical justifications from the records.
- For other documents like EOBs or previous correspondence, extract key facts, dates, and reference numbers to make the appeal as evidence-based as possible.
`
    : ``;
  
  const legalContextInstruction = `
**Legal & State Context:**
The rendering provider is located in **${formData.providerState}**. If applicable, you should subtly reference any relevant state-specific regulations, such as prompt payment laws, timely filing statutes, or patient protection acts for that state, to strengthen the appeal.
`;

  const clarificationContext = `
**CRITICAL USER-PROVIDED CLARIFICATIONS:**
You previously asked the user follow-up questions based on the denial reason. Their response is below. This information is the MOST IMPORTANT part of the context and MUST be the foundation of your appeal argument.

USER'S ANSWERS:
"${clarificationAnswers}"
`;

  return `You are a legal expert specializing in healthcare insurance appeals. Your tone must be formal, authoritative, and structured. You are writing an official legal argument, not a simple letter. Your task is to analyze the user-provided denial reason and construct a logical, evidence-based appeal.

**CRITICAL INSTRUCTIONS:**
1.  **Output ONLY the official appeal text.** Do not include any conversational text, markdown, or headings like "Here is the appeal:".
2.  **Use MM/DD/YYYY format for all dates.**
3.  **Adhere strictly to the professional layout and content requirements outlined below.**

---
**APPEAL LAYOUT AND CONTENT:**

**1. Header Block (Top of page):**
   - On the top left, write "ATTENTION: ${userDetails.attentionTo}".
   - On the top right, write today's date: ${currentDate}.

**2. Demographics Block (Center this block below the header):**
   - Create a centered, clearly separated block of text for the patient and claim details. Include all of the following:
     - Patient Name: ${formData.patientName}
     - Date of Birth: ${formatDate(formData.dateOfBirth)}
     - Member ID: ${formData.memberId}
     - Claim Number: ${formData.claimNumber}
     - Date of Service: ${formatDate(formData.dateOfService)}
     - Denial Date: ${formatDate(formData.denialDate)}

**3. Appeal Body (Formal argument format):**
   - Begin with a formal salutation like "To Whom It May Concern:".
   - State the purpose of the correspondence: to formally appeal a denied claim on behalf of the patient.
   - **Core Argument Construction:**
     - The insurance company provided the following denial reason: "${denialReasonText}".
     - **YOUR PRIMARY TASK is to use the user's detailed answers (provided under "CRITICAL USER-PROVIDED CLARIFICATIONS") to construct a powerful and specific rebuttal.** Directly reference the facts and evidence the user provided in their answers. This is more important than any generic template.
     - Structure the appeal body with a clear introduction, a detailed argument section citing the user's clarifications and evidence from any provided documents, and a concluding statement.
   - Conclude by formally requesting a re-evaluation and subsequent reprocessing of the claim for payment.

**4. Signature Block (At the end):**
   - End with "Sincerely,".
   - Follow with the user's name, designation, provider's name, email, phone, and fax number.

---
**ADDITIONAL CONTEXT:**
${clarificationContext}
${fileAnalysisInstruction}
${legalContextInstruction}

**SIGNATURE DATA:**
- User Name: ${userDetails.userName}
- User Designation: ${userDetails.userDesignation}
- Provider Name: ${formData.providerName}
- User Email: ${userDetails.userEmail}
- User Phone: ${userDetails.userPhone}
- User Fax: ${userDetails.userFax}

---
Now, generate the complete official appeal based on all the above instructions and data.
`;
};