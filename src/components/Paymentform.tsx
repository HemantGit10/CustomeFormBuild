import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import './Payment.css' 
// Helper function for simple regex validation (for credit card and expiry date)
const isValidCardNumber = (cardNumber: string) => /^\d{16}$/.test(cardNumber);
const isValidExpiryDate = (expiry: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
const isValidCVV = (cvv: string) => /^\d{3}$/.test(cvv);

const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors: any = {}; // Declare 'errors' as 'any'
    let valid = true;

    // Validate full name
    if (!formData.fullName) {
      errors.fullName = 'Full Name is required';
      valid = false;
    }

    // Validate email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Validate address
    if (!formData.streetAddress || !formData.city || !formData.state || !formData.zipCode) {
      errors.streetAddress = 'Please enter your billing address';
      valid = false;
    }

    // Validate card number
    if (!formData.cardNumber || !isValidCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid credit card number (16 digits)';
      valid = false;
    }

    // Validate expiry date
    if (!formData.expiryDate || !isValidExpiryDate(formData.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      valid = false;
    }

    // Validate CVV
    if (!formData.cvv || !isValidCVV(formData.cvv)) {
      errors.cvv = 'Please enter a valid CVV (3 digits)';
      valid = false;
    }

    setFormErrors(errors); 
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted with data:', formData);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } else {
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2} className ="form-container">
      <Typography variant="h4">Checkout Form</Typography>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <TextField
          label="Full Name"
          name="fullName"
          fullWidth
          required
          value={formData.fullName}
          onChange={handleInputChange}
          error={!!formErrors.fullName}
          helperText={formErrors.fullName || ' '}
          className={formErrors.fullName ? "error" : ""} 
          margin="normal"
        />

        {/* Email */}
        <TextField
          label="Email Address"
          name="email"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleInputChange}
          className={formErrors.email ? "error" : ""} 
          error={!!formErrors.email}
          helperText={formErrors.email || ' '}
          margin="normal"
        />

        {/* Address */}
        <TextField
          label="Street Address"
          name="streetAddress"
          fullWidth
          required
          value={formData.streetAddress}
          onChange={handleInputChange}
          error={!!formErrors.streetAddress}
          helperText={formErrors.streetAddress || ' '}
          margin="normal"
        />
        <TextField
          label="City"
          name="city"
          fullWidth
          required
          value={formData.city}
          onChange={handleInputChange}
          error={!!formErrors.city}
          helperText={formErrors.city || ' '}
          margin="normal"
        />
        <TextField
          label="State"
          name="state"
          fullWidth
          required
          value={formData.state}
          onChange={handleInputChange}
          error={!!formErrors.state}
          helperText={formErrors.state || ' '}
          margin="normal"
        />
        <TextField
          label="Zip Code"
          name="zipCode"
          fullWidth
          required
          value={formData.zipCode}
          onChange={handleInputChange}
          error={!!formErrors.zipCode}
          helperText={formErrors.zipCode || ' '}
          margin="normal"
        />

        {/* Credit Card Number */}
        <TextField
          label="Credit Card Number"
          name="cardNumber"
          type="text"
          fullWidth
          required
          value={formData.cardNumber}
          onChange={handleInputChange}
          error={!!formErrors.cardNumber}
          helperText={formErrors.cardNumber || ' '}
          margin="normal"
        />

        {/* Expiry Date */}
        <TextField
          label="Expiry Date (MM/YY)"
          name="expiryDate"
          type="text"
          fullWidth
          required
          value={formData.expiryDate}
          onChange={handleInputChange}
          error={!!formErrors.expiryDate}
          helperText={formErrors.expiryDate || ' '}
          margin="normal"
        />

        {/* CVV */}
        <TextField
          label="CVV"
          name="cvv"
          type="text"
          fullWidth
          required
          value={formData.cvv}
          onChange={handleInputChange}
          error={!!formErrors.cvv}
          helperText={formErrors.cvv || ' '}
          margin="normal"
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="submit-button" 
          fullWidth
          disabled={Object.values(formErrors).some((error) => error)}
          sx={{ marginTop: 2 }}
        >
          Pay Now
        </Button>
      </form>

      {/* Snackbar for validation feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarSeverity === 'success'
            ? 'Payment information submitted successfully!'
            : 'Please correct the errors in the form.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutForm;
