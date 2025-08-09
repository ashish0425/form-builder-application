import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import DynamicForm from './DynamicForm';

const FormPreview: React.FC = () => {
  const currentForm = useSelector((state: RootState) => state.form.currentForm);

  if (!currentForm) {
    return (
      <Container maxWidth="md" className="page-container" sx={{ py: 4 }}>
        <Alert severity="info" >
          No form selected. Please create a form first or select one from My Forms.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="page-container" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Preview: {currentForm.name || 'Untitled Form'}
      </Typography>
      
      <Box className="form-preview-container" sx={{ mt: 3 }}>
        <DynamicForm form={currentForm} />
      </Box>
    </Container>
  );
};

export default FormPreview;