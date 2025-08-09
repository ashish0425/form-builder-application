import React from 'react';
import { 
  TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, 
  Radio, Checkbox, Select, MenuItem, Box, FormHelperText, FormGroup 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormField } from '../../types/form';

interface DynamicFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  allData: Record<string, any>;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ 
  field, value, onChange, error, allData 
}) => {
  // Enhanced derived field calculation with multiple formulas
  React.useEffect(() => {
  if (field.isDerived && field.parentFields && field.formula) {
    try {
      switch (field.formula) {
        case 'age_from_dob':
          if (field.parentFields[0]) {
            const dob = allData[field.parentFields[0]];
            if (dob) {
              const age = dayjs().diff(dayjs(dob), 'year');
              onChange(age.toString());
            }
          }
          break;
          
        case 'full_name':
          if (field.parentFields.length >= 2) {
            const firstName = allData[field.parentFields[0]] || '';
            const lastName = allData[field.parentFields[1]] || '';
            const fullName = `${firstName} ${lastName}`.trim();
            onChange(fullName);
          }
          break;
          
        case 'sum':
          if (field.parentFields.length >= 2) {
            const sum = field.parentFields.reduce((total, parentId) => {
              const parentValue = parseFloat(allData[parentId]) || 0;
              return total + parentValue;
            }, 0);
            onChange(sum.toString());
          }
          break;
          
        case 'multiply':
          if (field.parentFields.length >= 2) {
            const value1 = parseFloat(allData[field.parentFields[0]]) || 0;
            const value2 = parseFloat(allData[field.parentFields[1]]) || 0;
            const result = value1 * value2;
            onChange(result.toString());
          }
          break;
          
        default:
          // Handle custom formulas or any other formula types
          if (field.parentFields.length > 0) {
            let processedFormula = field.formula;
            field.parentFields.forEach((parentId, index) => {
              const parentValue = allData[parentId] || '';
              const placeholder = `$${index + 1}`;
              processedFormula = processedFormula.split(placeholder).join(String(parentValue));
            });
            onChange(processedFormula);
          }
          break;
      }
    } catch (error) {
      console.error('Error calculating derived field:', error);
    }
  }
}, [field, allData, onChange]);

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextField
            className="modern-textfield"
            fullWidth
            label={field.label}
            type={field.type}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
            sx={{ mb: 2 }}
            placeholder={field.isDerived ? 'Auto-calculated' : undefined}
          />
        );

      case 'textarea':
        return (
          <TextField
            className="modern-textfield"
            fullWidth
            label={field.label}
            multiline
            rows={4}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
            sx={{ mb: 2 }}
            placeholder={field.isDerived ? 'Auto-calculated' : undefined}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
            <FormLabel>{field.label}</FormLabel>
            <Select
              value={value || field.defaultValue || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              disabled={field.isDerived}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl error={!!error} sx={{ mb: 2 }}>
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              value={value || field.defaultValue || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio disabled={field.isDerived} />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : (field.defaultValue as string[] || []);
        return (
          <FormControl error={!!error} sx={{ mb: 2 }}>
            <FormLabel>{field.label}</FormLabel>
            <FormGroup>
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={checkboxValues.includes(option)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...checkboxValues, option]
                          : checkboxValues.filter(v => v !== option);
                        onChange(newValues);
                      }}
                      disabled={field.isDerived}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
              <DatePicker
                label={field.label}
                value={value ? dayjs(value) : null}
                onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : '')}
                disabled={field.isDerived}
                slotProps={{
                  textField: {
                    required: field.required,
                    error: !!error,
                    helperText: error || (field.isDerived ? 'Auto-calculated' : undefined),
                    fullWidth: true,
                  },
                }}
              />
            </FormControl>
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {field.isDerived && (
  <Box 
    className="derived-field-badge"
    sx={{ 
      position: 'absolute', 
      top: -8, 
      right: 8, 
      zIndex: 1
    }}
  >
    Derived
  </Box>
)}
      {renderField()}
    </Box>
  );
};

export default DynamicField;


