// src/utils/formRenderingUtils.tsx
import React from "react";
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormHelperText,
  Skeleton,
} from "@mui/material";
import { FormField } from "../types/formTypes";

interface RenderFieldProps {
  field: FormField;
  formData: Record<string, any>;
  formErrors: Record<string, string>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean; // Added loading prop to control shimmer rendering
}

/**
 * Renders form fields based on configuration, including shimmer effect while loading
 */
export const renderField = ({
  field,
  formData,
  formErrors,
  handleInputChange,
  isLoading,
}: RenderFieldProps) => {
  if (isLoading) {
    // Show shimmer effect if loading
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return <Skeleton variant="rectangular" width="100%" height={56} />;

      case "radio":
        return (
          <Box display="flex" gap={1}>
            {field.options?.map((_, index) => (
              <Skeleton
                key={index}
                variant="circular" // Circular skeleton for radio button shape
                width={24}
                height={24}
              />
            ))}
          </Box>
        );

      case "checkbox":
        return (
          <Box display="flex" gap={1}>
            {field.options?.map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular" // Rectangular skeleton with rounded corners
                width={24}
                height={24}
                sx={{ borderRadius: "4px" }} // Rounded corners for checkbox shape
              />
            ))}
          </Box>
        );

      default:
        return null;
    }
  }

  // Render actual form fields when not loading
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
