import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../main';
import { Box, Button, FormControlLabel, Radio, RadioGroup, Checkbox, TextField, Typography } from '@mui/material';
import { FormField } from '../types/formTypes'; // Make sure to import your types

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();
  const formConfig = useSelector((state: RootState) => state.form.config);
  const [formData, setFormData] = useState<Record<string, any>>({}); // Local state for form data

  useEffect(() => {
    dispatch({ type: 'form/loadFormConfig' });
  }, [dispatch]);

  if (!formConfig) return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    localStorage.setItem('formData', JSON.stringify(formData)); // Store form data in local storage
    console.log('Form Data:', formData); // Log form data to console
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            name={field.name}
            fullWidth
            onChange={handleInputChange} // Handle input change
          />
        );
      case 'radio':
        return (
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
        );
      case 'checkbox':
        return (
          <Box>
            {field.options?.map((option) => (
              <FormControlLabel
                key={option}
                control={<Checkbox onChange={handleInputChange} name={option} />}
                label={option}
              />
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}> {/* Handle form submission */}
      <Box p={3} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4">{formConfig.title}</Typography>
        {formConfig.fields.map((field) => (
          <Box key={field.name}>{renderField(field)}</Box>
        ))}
        <Button variant="contained" color="primary" type="submit">Submit</Button>
      </Box>
    </form>
  );
};

export default DynamicForm;

