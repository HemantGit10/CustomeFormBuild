export type FieldType = 'text' | 'radio' | 'checkbox';

export interface FormField {
  label: string;
  name: string;
  type: FieldType;
  options?: string[]; // Only for radio and checkbox types
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}
