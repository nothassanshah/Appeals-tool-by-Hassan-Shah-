
export interface PatientInfoState {
  patientName: string;
  dateOfBirth: string;
  memberId: string;
}

export interface ProviderInfoState {
  providerName: string;
  npiNumber: string;
  taxId: string;
  providerState: string;
}

export interface ClaimInfoState {
  claimNumber: string;
  dateOfService: string;
  billedAmount: string;
  cptCodes: string;
  denialDate: string;
}

export type FormDataState = PatientInfoState & ProviderInfoState & ClaimInfoState;

export interface UserDetailsState {
  attentionTo: string;
  userName: string;
  userDesignation: string;
  userEmail: string;
  userPhone: string;
  userFax: string;
}

// FIX: Add missing DenialReason interface to resolve type errors.
export interface DenialReason {
  id: string;
  title: string;
  description: string;
  guidance: string[];
}
