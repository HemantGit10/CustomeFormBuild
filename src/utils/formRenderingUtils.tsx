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
  isLoading: boolean;
}

export const renderField = ({
  field,
  formData,
  formErrors,
  handleInputChange,
  isLoading,
}: RenderFieldProps) => {
  if (isLoading) {
    // Show shimmer effect if loading
    return <Skeleton variant="rectangular" width="100%" height={56} />;
  }

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
          required
          value={formData[field.name] || ""}
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
                required
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
                required
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

