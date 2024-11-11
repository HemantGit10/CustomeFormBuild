// src/utils/formRenderingUtils.tsx
import React from "react";
import { Box, TextField, RadioGroup, FormControlLabel, Radio, Checkbox, FormHelperText } from "@mui/material";
import { FormField } from "../types/formTypes";

interface RenderFieldProps {
  field: FormField;
  formData: Record<string, any>;
  formErrors: Record<string, string>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Renders form fields based on configuration
 * @param props - Object containing field, formData, formErrors, and handleInputChange function
 * @returns JSX element representing the form field
 */
export const renderField = ({
  field,
  formData,
  formErrors,
  handleInputChange,
}: RenderFieldProps) => {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return (
        <TextField
          type={field.type}
          label={field.label}
          name={field.name}
          fullWidth
          required={field.required}
          onChange={handleInputChange}
          error={!!formErrors[field.name]}
          helperText={formErrors[field.name] || " "}
        />
      );

    case "radio":
      return (
        <Box>
          <RadioGroup row name={field.name} onChange={handleInputChange}>
            {field.options?.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          {formErrors[field.name] && (
            <FormHelperText error>{formErrors[field.name]}</FormHelperText>
          )}
        </Box>
      );

    case "checkbox":
      return (
        <Box>
          {field.options?.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  onChange={handleInputChange}
                  name={option}
                  checked={!!formData[option]}
                />
              }
              label={option}
            />
          ))}
          {formErrors[field.name] && (
            <FormHelperText error>{formErrors[field.name]}</FormHelperText>
          )}
        </Box>
      );

    default:
      return null;
  }
};
