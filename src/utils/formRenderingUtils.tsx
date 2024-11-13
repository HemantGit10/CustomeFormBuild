import React, { useState } from "react";
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormHelperText,
  Skeleton,
  Button,
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
          required={field.required}
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
                required={field.required}
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
                  onChange={(event) => handleInputChange(event)}
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

const DynamicForm = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fields: FormField[] = [
    {
      type: "text",
      name: "name",
      label: "Name",
      required: true,
    },
    {
      type: "checkbox",
      name: "terms",
      label: "Terms and Conditions",
      options: ["Accept Terms", "Agree to Privacy Policy"],
      required: true,
    },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required) {
        if (field.type === "checkbox") {
          const allChecked = field.options?.every((option) => formData[option]);
          if (!allChecked) {
            errors[field.name] = "Please select all required checkboxes.";
          }
        } else if (!formData[field.name]) {
          errors[field.name] = `${field.label} is required.`;
        }
      }
    });

    return errors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsLoading(true)

    alert("Form submitted successfully!");
    // Add form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <Box key={field.name} mb={2}>
          {renderField({
            field,
            formData,
            formErrors,
            handleInputChange,
            isLoading,
          })}
        </Box>
      ))}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
