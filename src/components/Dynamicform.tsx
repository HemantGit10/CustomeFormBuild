import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../main";
import { Box, Button, Typography, Skeleton } from "@mui/material";
import { validateForm } from "../utils/formValidationUtils";
import { renderField } from "../utils/formRenderingUtils";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique ID generation
import "./Payment.css";
import SuccessModal from "../components/SucessModal";

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();
  const formConfig = useSelector((state: RootState) => state.form.config);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uniqueID, setUniqueID] = useState<string | null>(null); // State to hold the UUID

  //loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "form/loadFormConfig" });
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Validate form data whenever it or formConfig changes
  useEffect(() => {
    if (formConfig) {
      const { errors, isValid } = validateForm(formConfig, formData);
      setFormErrors(errors);
      setIsFormValid(isValid);
    }
  }, [formConfig, formData]);

  // Auto-save to localStorage on data change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

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
      const id = uuidv4(); // Generate a unique ID
      setUniqueID(id); // Set the unique ID in state
      setFormData({}); // Clear form data
      setShowSuccessModal(true); // Show success modal
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <Box p={3} display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4">
            {!isLoading && formConfig ? (
              formConfig.title
            ) : (
              <Skeleton width="60%" />
            )}
          </Typography>

          {isLoading || !formConfig
            ? Array.from(new Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={56}
                  sx={{ mb: 2 }}
                />
              ))
            : formConfig.fields.map((field) => (
                <Box key={field.name}>
                  {renderField({
                    field,
                    formData,
                    formErrors,
                    handleInputChange,
                    isLoading,
                  })}
                </Box>
              ))}

          {isLoading ? (
            <Skeleton variant="rectangular" height={36} width="100%" />
          ) : (
            <Button
              variant="contained"
              className="submit-button"
              color="primary"
              type="submit"
              disabled={!isFormValid}
            >
              Submit
            </Button>
          )}
        </Box>
      </form>

      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        uniqueID={uniqueID} // Pass the unique ID to the modal
      />
    </>
  );
};

export default DynamicForm;
