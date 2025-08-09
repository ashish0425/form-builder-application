import React from 'react';
import { Box, TextField, IconButton, Button, Typography } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

interface OptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
}

const OptionsEditor: React.FC<OptionsEditorProps> = ({ options, onChange }) => {
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  const addOption = () => {
    onChange([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Options:</Typography>
      {options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            value={option}
            onChange={(e) => updateOption(index, e.target.value)}
            fullWidth
          />
          <IconButton 
            onClick={() => removeOption(index)} 
            disabled={options.length <= 1}
            size="small"
          >
            <Delete />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<Add />} onClick={addOption}>
        Add Option
      </Button>
    </Box>
  );
};

export default OptionsEditor;