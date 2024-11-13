// SuccessModal.tsx
import React, { useEffect } from "react";
import {  Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./Payment.css";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  uniqueID: string | null; 
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, uniqueID }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <button className="success-modal-close" onClick={onClose}>
          &times;
        </button>
        <CheckCircleIcon className="success-modal-icon" fontSize="large" />
        <Typography variant="h6" color="success" component="h2">
          Success!
        </Typography>
        <Typography variant="body2">Your form has been submitted successfully.</Typography>
        {uniqueID && (
          <Typography variant="body2" color="textSecondary">
            Submission ID: {uniqueID}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
