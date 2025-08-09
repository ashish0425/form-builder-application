import React from 'react';
import { 
  Container, Typography, Card, CardContent, CardActions, 
  Button, Alert, Grid
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { loadForm } from '../../store/slices/formSlice';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedForms = useSelector((state: RootState) => state.form.savedForms);

  const handlePreview = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const handleEdit = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  if (savedForms.length === 0) {
    return (
      <Container maxWidth="lg" className="page-container" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>My Forms</Typography>
        <Alert severity="info">
          No forms saved yet. <Button onClick={() => navigate('/create')}>Create your first form</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Forms</Typography>
      
      <Grid container spacing={3}>
        {savedForms.map((form) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
            <Card className="my-forms-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {form.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handlePreview(form.id)}>
                  Preview
                </Button>
                <Button size="small" onClick={() => handleEdit(form.id)}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyForms;

