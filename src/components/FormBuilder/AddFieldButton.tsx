import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addField } from '../../store/slices/formSlice';
import { FieldType, FormField } from '../../types/form';

const fieldTypes: { type: FieldType; label: string }[] = [
  { type: 'text', label: 'Text Input' },
  { type: 'number', label: 'Number Input' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'select', label: 'Select Dropdown' },
  { type: 'radio', label: 'Radio Buttons' },
  { type: 'checkbox', label: 'Checkboxes' },
  { type: 'date', label: 'Date Picker' },
];

const AddFieldButton: React.FC = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      defaultValue: type === 'checkbox' ? [] : '',
      validations: [],
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };

    dispatch(addField(newField));
    handleClose();
  };

  return (
    <>
      <Button variant="outlined"   sx={{color:'#fff'}}startIcon={<Add />} onClick={handleClick}>
        Add Field
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {fieldTypes.map((fieldType) => (
          <MenuItem key={fieldType.type} onClick={() => handleAddField(fieldType.type)}>
            {fieldType.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AddFieldButton;