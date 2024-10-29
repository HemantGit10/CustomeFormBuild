import { FormConfig } from '../types/formTypes';

export const fetchFormConfig = async (): Promise<FormConfig> => {
  // Mock API response
  return {
    title: 'User Feedback Form',
    fields: [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Email', name: 'email', type: 'text' },
      { label: 'Gender', name: 'gender', type: 'radio', options: ['Male', 'Female', 'Other'] },
      { label: 'Subscribe', name: 'subscribe', type: 'checkbox', options: ['Yes', 'No'] },
    ],
  };
};
