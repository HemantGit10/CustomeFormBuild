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
import { v4 as uuidv4 } from "uuid"; 

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();
  const formConfig = useSelector((state: RootState) => state.form.config);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [uniqueID, setUniqueID] = useState<string | null>(null);

  useEffect(() => {
    dispatch({ type: "form/loadFormConfig" });
  }, [dispatch]);

  useEffect(() => {
    validateForm();
  }, [formConfig, formData]);

  const validateForm = () => {
    if (!formConfig || !formConfig.fields) {
      setIsFormValid(false);
      return;
    }

    const errors: Record<string, string> = {};
    let valid = true;

    formConfig.fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`;
        valid = false;
      } else if (
        field.type === "email" &&
        value &&
        !/\S+@\S+\.\S+/.test(value)
      ) {
        errors[field.name] = "Please enter a valid email";
        valid = false;
      } else if (field.name === "password" && value && value.length < 8) {
        errors[field.name] = "Password must be at least 8 characters";
        valid = false;
      }
    });

    setFormErrors(errors);
    setIsFormValid(valid);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateForm();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      const id = uuidv4();
      setUniqueID(id);
      const submissionData = { ...formData, id };

      localStorage.setItem("formData", JSON.stringify(submissionData));
      setSnackbarSeverity("success");
      console.log("Form submitted with ID:", id);
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
            required
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
                  required
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box p={3} display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4">
            {formConfig ? formConfig.title : "Loading..."}
          </Typography>
          {formConfig?.fields?.map((field) => (
            <Box key={field.name}>{renderField(field)}</Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </Box>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={7000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarSeverity === "success"
            ? `Form submitted successfully! Submission ID: ${uniqueID}`
            : "Please correct the errors in the form."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DynamicForm;
