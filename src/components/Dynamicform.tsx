import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../main";
import {
  Box,
  Button,
  Typography,
  Skeleton,
  Backdrop,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
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
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uniqueID, setUniqueID] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPDF, setUploadedPDF] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFormPreview, setShowFormPreview] = useState(false); // New state for form preview visibility

  // Load form config
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "form/loadFormConfig" });
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Validate form
  useEffect(() => {
    if (formConfig) {
      const { errors, isValid } = validateForm(formConfig, formData);
      setFormErrors(errors);
      setIsFormValid(isValid);
    }
  }, [formConfig, formData]);

  // Save form data to localStorage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload
  const handleFileUpload = async (file: File, type: "image" | "pdf") => {
    setUploadProgress(0);
    setError(null);

    if (type === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
    } else if (type === "pdf") {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      type === "image"
        ? setUploadedImage(reader.result as string)
        : setUploadedPDF(reader.result as string);
    };
    reader.readAsDataURL(file);

    const fakeUpload = () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              resolve("File uploaded successfully");
            }
            return prev + 10;
          });
        }, 200);
      });
    };

    await fakeUpload();
    setShowUploadSuccess(true);
    setTimeout(() => setUploadProgress(0), 500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      setIsBackdropOpen(true);
      const id = uuidv4();
      setTimeout(() => {
        setUniqueID(id);
        setFormData({});
        setShowSuccessModal(true);
        setIsBackdropOpen(false);
      }, 2000);
    }
  };

  const handlePrint = () => {
    window.print();
    setShowFormPreview(true); // Set form preview to visible after print button click
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

          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle1">Upload Image</Typography>
            <input type="file" onChange={(e) => handleFileChange(e, "image")} />
            {uploadProgress > 0 && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mt: 2 }}
              />
            )}
            {uploadedImage && (
              <Box className="uploaded-image-preview">
                <img src={uploadedImage} alt="Uploaded preview" />
              </Box>
            )}
          </Box>

          {/* PDF Upload */}
          <Box>
            <Typography variant="subtitle1">Upload PDF</Typography>
            <input type="file" onChange={(e) => handleFileChange(e, "pdf")} />
            {uploadedPDF && (
              <Box>
                <Typography>PDF Preview:</Typography>
                <iframe
                  src={uploadedPDF}
                  title="PDF Preview"
                  width="100%"
                  height="400px"
                />
              </Box>
            )}
          </Box>

          <Button onClick={handlePrint} variant="outlined" color="secondary">
            Print Form
          </Button>

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

      {/* Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={showUploadSuccess}
        autoHideDuration={3000}
        onClose={() => setShowUploadSuccess(false)}
      >
        <Alert onClose={() => setShowUploadSuccess(false)} severity="success">
          File uploaded successfully!
        </Alert>
      </Snackbar>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        uniqueID={uniqueID}
      />

      {/* Form Preview */}
      {showFormPreview && (
        <Box p={3} mt={3} border={1} borderColor="grey.300">
          <Typography variant="h6">Form Preview</Typography>
          <Typography>Name: {formData.name || "N/A"}</Typography>
          <Typography>Email: {formData.email || "N/A"}</Typography>
          <Typography>Gender: {formData.gender || "N/A"}</Typography>
          {uploadedImage && <img src={uploadedImage} alt="Uploaded preview" />}
        </Box>
      )}
    </>
  );
};

export default DynamicForm;
