import React from 'react';
import { Box, Button, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormSchema } from '../../types/form';
import { RootState } from '../../store';
import { updatePreviewData } from '../../store/slices/formSlice';
import DynamicField from './DynamicField';
import { validateField } from '../../utils/validation';

interface DynamicFormProps {
  form: FormSchema;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ form }) => {
  const dispatch = useDispatch();
  const previewData = useSelector((state: RootState) => state.form.previewData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updatePreviewData({ [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      const fieldValue = previewData[field.id];
      const error = validateField(field, fieldValue);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        Form submitted successfully! Data: {JSON.stringify(previewData, null, 2)}
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {form.fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={previewData[field.id]}
          onChange={(value) => handleFieldChange(field.id, value)}
          error={errors[field.id]}
          allData={previewData}
        />
      ))}
      
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 3 }}
        disabled={form.fields.length === 0}
      >
        Submit
      </Button>
    </Box>
  );
};

export default DynamicForm;