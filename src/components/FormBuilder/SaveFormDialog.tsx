import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { saveForm } from '../../store/slices/formSlice';
import { RootState } from '../../store';

interface SaveFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const SaveFormDialog: React.FC<SaveFormDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [formName, setFormName] = React.useState(currentForm?.name || '');

  React.useEffect(() => {
    if (currentForm) {
      setFormName(currentForm.name || '');
    }
  }, [currentForm]);

  const handleSave = () => {
    if (formName.trim()) {
      dispatch(saveForm(formName.trim()));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!formName.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFormDialog;