// delete this component in production xxxxxxxxxxxxxxxxxxxxxxxxxx

import { useState } from 'react';
import {
  Box, Button, Typography, 
  Paper, Grid, 
} from '@mui/material';
import ReactQuill from '../../ReactQuillWrapper';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '../../../../context/themeContext';


const CreateProduct: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [product, setProduct] = useState({
    description: '',
    category: '',
    stock: '',
    image: null as File | null,
  });



 

  const handleDescriptionChange = (value: string) => {
    setProduct({ ...product, description: value });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product Submitted:', product);
    // TODO: Submit to backend
  };





  return (
    <>
      <Paper
        sx={{
          mx: 'auto',
          p: 4,
          bgcolor: isDark ? '#121212' : '#fff',
          color: isDark ? '#fff' : '#000',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" mb={2}>Add New Product</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>


            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={product.description}
                onChange={handleDescriptionChange}
                style={{
                  backgroundColor: isDark ? '#1e1e1e' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  border: isDark ? '1px solid #444' : '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </Grid>


            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default CreateProduct;
