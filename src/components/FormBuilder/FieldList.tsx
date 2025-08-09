import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { RootState } from '../../store';
import FieldEditor from './FieldEditor';

const FieldList: React.FC = () => {
  const currentForm = useSelector((state: RootState) => state.form.currentForm);

  if (!currentForm?.fields.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="textSecondary">
          No fields added yet. Click "Add Field" to start building your form.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {currentForm.fields.map((field, index) => (
        <FieldEditor key={field.id} field={field} index={index} />
      ))}
    </Box>
  );
};

export default FieldList;