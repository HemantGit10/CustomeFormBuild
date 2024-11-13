import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../main";
import { Box, Button, Typography, Skeleton, Backdrop, CircularProgress } from "@mui/material";
import { validateForm } from "../utils/formValidationUtils";
import { renderField } from "../utils/formRenderingUtils";
import { v4 as uuidv4 } from "uuid";
import "./Payment.css";
import SuccessModal from "../components/SucessModal";

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();
  const formConfig = useSelector((state: RootState) => state.form.config);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false); // Backdrop state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uniqueID, setUniqueID] = useState<string | null>(null);

  // Loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "form/loadFormConfig" });
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (formConfig) {
      const { errors, isValid } = validateForm(formConfig, formData);
      setFormErrors(errors);
      setIsFormValid(isValid);
    }
  }, [formConfig, formData]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      setIsBackdropOpen(true); // Show Backdrop
      const id = uuidv4();
      setTimeout(() => {
        setUniqueID(id);
        setFormData({});
        setShowSuccessModal(true);
        setIsBackdropOpen(false); 
      }, 2000);
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        uniqueID={uniqueID} // Pass the unique ID to the modal
      />
    </>
  );
};

export default DynamicForm;
