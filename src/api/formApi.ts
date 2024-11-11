import { FormConfig } from '../types/formTypes';

export const fetchFormConfig = async (): Promise<FormConfig> => {
  return {
    title: 'User Custom Form',
    fields: [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Email', name: 'email', type: 'text' },
      { label: 'Gender', name: 'gender', type: 'radio', options: ['Male', 'Female', 'Other'] },
      { label: 'Subscribe', name: 'subscribe', type: 'checkbox', options: ['Yes', 'No'] },
    ],
  };
};
