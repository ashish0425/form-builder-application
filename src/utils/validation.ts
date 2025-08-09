import { FormField} from '../types/form';

export const validateField = (field: FormField, value: any): string => {
  if (!field.validations || field.validations.length === 0) {
    return '';
  }

  // Handle empty values
  const isEmpty = value === undefined || value === null || value === '' || 
    (Array.isArray(value) && value.length === 0);

  for (const rule of field.validations) {
    switch (rule.type) {
      case 'required':
        if (isEmpty) {
          return rule.message || `${field.label} is required`;
        }
        break;

      case 'minLength':
        if (!isEmpty && typeof value === 'string' && typeof rule.value === 'number') {
          if (value.length < rule.value) {
            return rule.message || `${field.label} must be at least ${rule.value} characters long`;
          }
        }
        break;

      case 'maxLength':
        if (!isEmpty && typeof value === 'string' && typeof rule.value === 'number') {
          if (value.length > rule.value) {
            return rule.message || `${field.label} must be no more than ${rule.value} characters long`;
          }
        }
        break;

      case 'email':
        if (!isEmpty && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return rule.message || `${field.label} must be a valid email address`;
          }
        }
        break;

      case 'password':
        if (!isEmpty && typeof value === 'string') {
          // Default password rule: minimum 8 characters, must contain a number
          if (value.length < 8) {
            return rule.message || `${field.label} must be at least 8 characters long`;
          }
          if (!/\d/.test(value)) {
            return rule.message || `${field.label} must contain at least one number`;
          }
        }
        break;

      default:
        break;
    }
  }

  return '';
};

export const validateForm = (fields: FormField[], formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const error = validateField(field, formData[field.id]);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
};


