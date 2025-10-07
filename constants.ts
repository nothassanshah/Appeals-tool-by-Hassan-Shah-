
// FIX: Import DenialReason type to be used in the DENIAL_REASONS constant.
import type { DenialReason } from './types';

export const US_STATES: readonly string[] = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

// FIX: Add missing DENIAL_REASONS constant to resolve import error.
export const DENIAL_REASONS: readonly DenialReason[] = [
  {
    id: 'medical_necessity',
    title: 'Not Medically Necessary',
    description: 'The insurer has determined the service or procedure was not required for the patient\'s condition.',
    guidance: [
      'A detailed letter from the treating physician explaining the medical necessity.',
      'Copies of relevant medical records, such as progress notes, lab results, and imaging reports.',
      'Peer-reviewed medical literature or clinical practice guidelines that support the treatment.',
    ],
  },
  {
    id: 'timely_filing',
    title: 'Timely Filing Limit Exceeded',
    description: 'The claim was submitted after the deadline set by the insurance company.',
    guidance: [
      'Proof of the original, timely submission (e.g., electronic submission report, certified mail receipt).',
      'A letter explaining any extenuating circumstances that caused the delay.',
      'Any correspondence from the payer that shows they received the claim on time but mishandled it.',
    ],
  },
  {
    id: 'coding_error',
    title: 'Coding Error or Mismatch',
    description: 'The CPT, HCPCS, or diagnosis codes on the claim are considered incorrect or inconsistent.',
    guidance: [
      'A corrected claim form with the accurate codes.',
      'A copy of the physician\'s notes or operative report to justify the codes used.',
      'References to official coding guidelines (e.g., AMA CPT Assistant, AHA Coding Clinic).',
    ],
  },
  {
    id: 'not_covered',
    title: 'Service Not a Covered Benefit',
    description: 'The service is explicitly excluded from the patient\'s insurance plan.',
    guidance: [
      'A copy of the patient\'s Summary of Benefits and Coverage (SBC) if you believe the service is covered.',
      'A letter arguing for an exception based on medical necessity or lack of alternative treatments.',
      'Documentation of any prior authorization that was obtained for the service.',
    ],
  },
    {
    id: 'info_missing',
    title: 'Missing or Invalid Information',
    description: 'The claim was rejected due to incomplete or incorrect patient, provider, or insurance details.',
    guidance: [
      'A corrected claim form with all fields accurately completed.',
      'A copy of the front and back of the patient\'s insurance card.',
      'Verify NPI, Tax ID, and address details for the provider.',
    ],
  },
  {
    id: 'other',
    title: 'Other Reason',
    description: 'If the denial reason is not listed above, please specify it.',
    guidance: [
      'Provide the exact denial reason from the EOB/denial letter.',
      'Upload a copy of the denial letter itself.',
      'Include any documentation that you believe refutes the specific reason for denial.',
    ],
  },
];
