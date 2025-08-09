import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Button, Box } from '@mui/material';
import { RootState } from '../../store';
import { createNewForm } from '../../store/slices/formSlice';
import FieldList from './FieldList';
import AddFieldButton from './AddFieldButton';
import SaveFormDialog from './SaveFormDialog';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

  useEffect(() => {
    if (!currentForm) {
      dispatch(createNewForm());
    }
  }, [dispatch, currentForm]);

  return (
    <Container maxWidth="lg" className="page-container" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Form Builder</Typography>
      
      <Box sx={{ mb: 3 }}>
        <AddFieldButton />
      </Box>

      <FieldList />

      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          className="modern-button"
          onClick={() => setSaveDialogOpen(true)}
          disabled={!currentForm?.fields.length}
        >
          Save Form
        </Button>
      </Box>

      <SaveFormDialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)} 
      />
    </Container>
  );
};

export default FormBuilder;