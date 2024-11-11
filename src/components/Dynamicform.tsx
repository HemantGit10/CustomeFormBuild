import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../main";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import { validateForm } from "../utils/formValidationUtils";
import { renderField } from "../utils/formRenderingUtils";
import { v4 as uuidv4 } from "uuid";
import "./Payment.css";

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
    if (formConfig) {
      const { errors, isValid } = validateForm(formConfig, formData);
      setFormErrors(errors);
      setIsFormValid(isValid);
    }
  }, [formConfig, formData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      const id = uuidv4();
      setUniqueID(id);
      const submissionData = { ...formData, id };
      localStorage.setItem("formData", JSON.stringify(submissionData));
      setSnackbarSeverity("success");
      setFormData({}); // Reset form data after successful submission
    } else {
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <Box p={3} display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4">
            {formConfig ? formConfig.title : "Loading..."}
          </Typography>
          {formConfig?.fields?.map((field) => (
            <Box key={field.name}>
              {renderField({
                field,
                formData,
                formErrors,
                handleInputChange,
              })}
            </Box>
          ))}
          <Button
            variant="contained"
            className="submit-button"
            color="primary"
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </Box>
      </form>
      <Snackbar
        className="snackbar-alert"
        open={openSnackbar}
        autoHideDuration={7000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
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
