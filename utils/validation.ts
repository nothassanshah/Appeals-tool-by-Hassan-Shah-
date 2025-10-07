
export const validateNPI = (npi: string): string | null => {
  if (!/^\d{10}$/.test(npi)) {
    return "NPI must be 10 digits.";
  }
  // Can add Luhn check algorithm for more robustness if needed
  return null;
};

export const validateTaxID = (taxId: string): string | null => {
  if (!/^\d{2}-?\d{7}$/.test(taxId)) {
    return "Tax ID must be in XX-XXXXXXX format.";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address.";
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  // Simple validation for US phone numbers
  if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
    return "Invalid phone number format.";
  }
  return null;
};
