import DerivedFieldEditor from './DerivedFieldEditor';

// import { FormGroup, MenuItem, Select, InputLabel } from '@mui/material';

import React from 'react';
import { 
  Card, CardContent, TextField, FormControlLabel, Switch, 
  IconButton, Box, Chip, 
} from '@mui/material';
import { Delete, ArrowUpward } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, deleteField, reorderFields } from '../../store/slices/formSlice';
import { FormField } from '../../types/form';
import { RootState } from '../../store';
import ValidationEditor from './ValidationEditor';
import OptionsEditor from './OptionsEditor';

interface FieldEditorProps {
  field: FormField;
  index: number;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, index }) => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const totalFields = currentForm?.fields.length || 0;

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    dispatch(updateField({ id: field.id, field: updates }));
  };

  const handleDelete = () => {
    dispatch(deleteField(field.id));
  };

  const handleMoveUp = () => {
    if (index > 0) {
      dispatch(reorderFields({ fromIndex: index, toIndex: index - 1 }));
    }
  };

  // const handleMoveDown = () => {
  //   if (index < totalFields - 1) {
  //     dispatch(reorderFields({ fromIndex: index, toIndex: index + 1 }));
  //   }
  // };

  return (
    <Card className="form-field-card" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Chip 
  label={field.type.toUpperCase()} 
  size="small" 
  className="field-type-chip"
  sx={{ mb: 1 }} 
/>
            <TextField
              fullWidth
              label="Field Label"
              value={field.label}
              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
          
          <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <IconButton 
  onClick={handleMoveUp} 
  disabled={index === 0} 
  size="small"
  className="action-button reorder-button"
>
  <ArrowUpward />
</IconButton>

<IconButton 
  onClick={handleDelete} 
  color="error" 
  size="small"
  className="action-button delete-button"
>
  <Delete />
</IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
              />
            }
            label="Required Field"
          />
        </Box>

        {['text', 'textarea', 'number'].includes(field.type) && (
          <TextField
            fullWidth
            label="Default Value"
            value={field.defaultValue}
            onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
            sx={{ mb: 2 }}
            type={field.type === 'number' ? 'number' : 'text'}
            multiline={field.type === 'textarea'}
            rows={field.type === 'textarea' ? 3 : 1}
          />
        )}

        {['select', 'radio', 'checkbox'].includes(field.type) && (
          <OptionsEditor 
            options={field.options || []} 
            onChange={(options) => handleFieldUpdate({ options })}
          />
        )}

        <ValidationEditor 
          validations={field.validations}
          fieldType={field.type}
          onChange={(validations) => handleFieldUpdate({ validations })}
        />
        <DerivedFieldEditor 
          field={field} 
          onUpdate={handleFieldUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default FieldEditor;