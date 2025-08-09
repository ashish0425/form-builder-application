import React from 'react';
import { 
  Box, Typography, FormControlLabel, Checkbox, TextField, 
  Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { ValidationRule, FieldType } from '../../types/form';

interface ValidationEditorProps {
  validations: ValidationRule[];
  fieldType: FieldType;
  onChange: (validations: ValidationRule[]) => void;
}

const ValidationEditor: React.FC<ValidationEditorProps> = ({ validations, fieldType, onChange }) => {
  const updateValidation = (type: ValidationRule['type'], enabled: boolean, value?: number | string) => {
    let newValidations = validations.filter(v => v.type !== type);
    
    if (enabled) {
      const messages: Record<ValidationRule['type'], string> = {
        required: 'This field is required',
        minLength: `Minimum length is ${value}`,
        maxLength: `Maximum length is ${value}`,
        email: 'Please enter a valid email address',
        password: 'Password must be at least 8 characters and contain a number',
      };

      newValidations.push({
        type,
        value,
        message: messages[type],
      });
    }
    
    onChange(newValidations);
  };

  const isEnabled = (type: ValidationRule['type']) => validations.some(v => v.type === type);
  const getValue = (type: ValidationRule['type']) => validations.find(v => v.type === type)?.value;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Validation Rules ({validations.length})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isEnabled('required')}
                onChange={(e) => updateValidation('required', e.target.checked)}
              />
            }
            label="Required"
          />

          {['text', 'textarea'].includes(fieldType) && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isEnabled('minLength')}
                      onChange={(e) => updateValidation('minLength', e.target.checked, getValue('minLength') || 3)}
                    />
                  }
                  label="Minimum Length"
                />
                {isEnabled('minLength') && (
                  <TextField
                    size="small"
                    type="number"
                    value={getValue('minLength') || 3}
                    onChange={(e) => updateValidation('minLength', true, Number(e.target.value))}
                    sx={{ width: 80 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isEnabled('maxLength')}
                      onChange={(e) => updateValidation('maxLength', e.target.checked, getValue('maxLength') || 50)}
                    />
                  }
                  label="Maximum Length"
                />
                {isEnabled('maxLength') && (
                  <TextField
                    size="small"
                    type="number"
                    value={getValue('maxLength') || 50}
                    onChange={(e) => updateValidation('maxLength', true, Number(e.target.value))}
                    sx={{ width: 80 }}
                  />
                )}
              </Box>
            </>
          )}

          {fieldType === 'text' && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEnabled('email')}
                    onChange={(e) => updateValidation('email', e.target.checked)}
                  />
                }
                label="Email Format"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEnabled('password')}
                    onChange={(e) => updateValidation('password', e.target.checked)}
                  />
                }
                label="Password Rules (8+ chars, includes number)"
              />
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ValidationEditor;