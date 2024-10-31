import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../main";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  TextField,
  Typography,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import { FormField } from "../types/formTypes";

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();
  const formConfig = useSelector((state: RootState) => state.form.config);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    dispatch({ type: "form/loadFormConfig" });
  }, [dispatch]);

  useEffect(() => {
    validateForm(); // Validate form whenever formConfig or formData changes
  }, [formConfig, formData]);

  const validateForm = () => {
    if (!formConfig || !formConfig.fields) {
      setIsFormValid(false); // Set form as invalid if config is not available
      return;
    }

    const errors: Record<string, string> = {};
    let valid = true; // Track overall form validity

    formConfig.fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`;
        valid = false; // Mark as invalid if required field is empty
      } else if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        errors[field.name] = "Please enter a valid email";
        valid = false; // Mark as invalid if email format is wrong
      } else if (field.name === "password" && value && value.length < 8) {
        errors[field.name] = "Password must be at least 8 characters";
        valid = false; // Mark as invalid if password is too short
      }
    });

    setFormErrors(errors);
    setIsFormValid(valid); // Update validity
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateForm(); // Validate the form on every input change
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      localStorage.setItem("formData", JSON.stringify(formData));
      setSnackbarSeverity("success");
    } else {
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const renderField = (field: FormField) => {
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
            onChange={handleInputChange}
            error={!!formErrors[field.name]}
            helperText={formErrors[field.name]}
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box p={3} display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4">{formConfig ? formConfig.title : "Loading..."}</Typography>
          {formConfig?.fields?.map((field) => (
            <Box key={field.name}>{renderField(field)}</Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isFormValid} // Disable if form is not valid
          >
            Submit
          </Button>
        </Box>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarSeverity === "success"
            ? "Form submitted successfully!"
            : "Please correct the errors in the form."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DynamicForm;
