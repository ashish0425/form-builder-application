import React from 'react';
import { 
  Box, FormControlLabel, Switch, FormControl, InputLabel, 
  Select, MenuItem, Chip, Typography, Divider 
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FormField } from '../../types/form';

interface DerivedFieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

const formulaOptions = [
  { value: 'age_from_dob', label: 'Age from Date of Birth', requiredParents: 1 },
  { value: 'full_name', label: 'Full Name (First + Last)', requiredParents: 2 },
  { value: 'sum', label: 'Sum of Values', requiredParents: 2 },
  { value: 'multiply', label: 'Multiply Values', requiredParents: 2 },
  { value: 'custom', label: 'Custom Formula', requiredParents: 1 },
];

const DerivedFieldEditor: React.FC<DerivedFieldEditorProps> = ({ field, onUpdate }) => {
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  
  
  const availableParentFields = currentForm?.fields.filter(f => 
    f.id !== field.id && !f.isDerived
  ) || [];

  const handleDerivedToggle = (isDerived: boolean) => {
    if (isDerived) {
      onUpdate({ 
        isDerived: true, 
        parentFields: [], 
        formula: '',
        required: false 
      });
    } else {
      onUpdate({ 
        isDerived: false, 
        parentFields: undefined, 
        formula: undefined 
      });
    }
  };

  const handleParentFieldsChange = (parentIds: string[]) => {
    onUpdate({ parentFields: parentIds });
  };

  const handleFormulaChange = (formula: string) => {
    onUpdate({ formula });
    
    
    const selectedFormula = formulaOptions.find(f => f.value === formula);
    if (selectedFormula && availableParentFields.length >= selectedFormula.requiredParents) {
      const autoParents = availableParentFields
        .slice(0, selectedFormula.requiredParents)
        .map(f => f.id);
      handleParentFieldsChange(autoParents);
    }
  };

  if (!field.isDerived) {
    return (
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={false}
              onChange={(e) => handleDerivedToggle(e.target.checked)}
            />
          }
          label="Make this a Derived Field"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
      <FormControlLabel
        control={
          <Switch
            checked={true}
            onChange={(e) => handleDerivedToggle(e.target.checked)}
          />
        }
        label="Derived Field"
      />
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        Configuration
      </Typography>

      {/* Formula Selection */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Formula Type</InputLabel>
        <Select
          value={field.formula || ''}
          onChange={(e) => handleFormulaChange(e.target.value)}
          label="Formula Type"
        >
          {formulaOptions.map((formula) => (
            <MenuItem key={formula.value} value={formula.value}>
              {formula.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Parent Fields Selection */}
      {field.formula && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Parent Fields</InputLabel>
          <Select
            multiple
            value={field.parentFields || []}
            onChange={(e) => {
              const value = typeof e.target.value === 'string' 
                ? e.target.value.split(',') 
                : e.target.value;
              handleParentFieldsChange(value as string[]);
            }}
            label="Parent Fields"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((fieldId) => {
                  const parentField = availableParentFields.find(f => f.id === fieldId);
                  return (
                    <Chip 
                      key={fieldId} 
                      label={parentField?.label || fieldId} 
                      size="small" 
                    />
                  );
                })}
              </Box>
            )}
          >
            {availableParentFields.map((parentField) => (
              <MenuItem key={parentField.id} value={parentField.id}>
                {parentField.label} ({parentField.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Formula Description */}
      {field.formula && (
        <Box sx={{ p: 1, bgcolor: 'info.light', borderRadius: 1, mt: 1 }}>
          <Typography variant="caption" color="info.dark">
            {getFormulaDescription(field.formula)}
          </Typography>
        </Box>
      )}

      {/* Validation Warning */}
      {availableParentFields.length === 0 && (
        <Typography variant="caption" color="error">
          No parent fields available. Add some regular fields first.
        </Typography>
      )}
    </Box>
  );
};

const getFormulaDescription = (formula: string): string => {
  switch (formula) {
    case 'age_from_dob':
      return 'Calculates age in years from a date of birth field.';
    case 'full_name':
      return 'Concatenates first name and last name with a space.';
    case 'sum':
      return 'Adds the numeric values of selected parent fields.';
    case 'multiply':
      return 'Multiplies the numeric values of the first two parent fields.';
    case 'custom':
      return 'Uses a custom formula. Use $1, $2, etc. to reference parent field values.';
    default:
      return '';
  }
};

export default DerivedFieldEditor;