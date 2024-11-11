
import { FormField } from "../types/formTypes";

interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
}

export const validateForm = (
  formConfig: { fields: FormField[] },
  formData: Record<string, any>
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  formConfig.fields.forEach(({ name, type, label, required }) => {
    const value = formData[name];

    // Check for required field
    if (required && !value) {
      errors[name] = `${label} is required`;
      isValid = false;
      return;
    }

    // Only apply the alphabets validation for name fields
    if (type === "text" && name !== "email" && value && !/^[A-Za-z\s]+$/.test(value)) {
      errors[name] = "Name must only contain alphabets";
      isValid = false;
    }

    // Password validation logic
    if (name === "password" && value) {
      if (value.length < 8) {
        errors[name] = "Password must be at least 8 characters long";
        isValid = false;
      } else if (!/[A-Z]/.test(value)) {
        errors[name] = "Password must contain at least one uppercase letter";
        isValid = false;
      } else if (!/[0-9]/.test(value)) {
        errors[name] = "Password must contain at least one number";
        isValid = false;
      } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
        errors[name] = "Password must contain at least one special character";
        isValid = false;
      }
    }
  });

  return { errors, isValid };
};
