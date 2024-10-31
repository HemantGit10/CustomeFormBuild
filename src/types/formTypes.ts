// export type FieldType = 'text' | 'radio' | 'checkbox';

// In formTypes.ts or where FieldType is defined
export type FieldType = 'text' | 'radio' | 'checkbox' | 'email' | 'password'; // Add 'email' if missing


export interface FormField {
  label: string;
  name: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}
