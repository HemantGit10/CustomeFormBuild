// src/utils/formValidationUtils.ts
import { FormField } from "../types/formTypes";

interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
}

/**
 * Validates form data against form configuration
 * @param formConfig - Configuration of form fields
 * @param formData - Data of the form to validate
 * @returns Object containing validation errors and form validity
 */
export const validateForm = (
  formConfig: { fields: FormField[] },
  formData: Record<string, any>
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  formConfig.fields.forEach((field) => {
    const value = formData[field.name];

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      isValid = false;
    } else if (field.type === "email" && value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      errors[field.name] = "Please enter a valid email address";
      isValid = false;
    } else if (field.type === "text" && value && !/^[A-Za-z\s]+$/.test(value)) {
      errors[field.name] = "Name must only contain alphabets";
      isValid = false;
    } else if (field.name === "password" && value) {
      if (value.length < 8) {
        errors[field.name] = "Password must be at least 8 characters long";
        isValid = false;
      } else if (!/[A-Z]/.test(value)) {
        errors[field.name] = "Password must contain at least one uppercase letter";
        isValid = false;
      } else if (!/[0-9]/.test(value)) {
        errors[field.name] = "Password must contain at least one number";
        isValid = false;
      } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
        errors[field.name] = "Password must contain at least one special character";
        isValid = false;
      }
    }
  });

  return { errors, isValid };
};
