import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Pagination
} from '@mui/material';

import { Styles } from '../styles';

const SubjectsComponent = ({ data }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;

  if (!data || !Array.isArray(data)) {
    return <Box>Aucune donnée disponible</Box>;
  }

  const subjects = Array.from(new Set(data.map((item) => item.course)));
  
  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSubjects = filteredSubjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
     sx={{
        ...Styles.searchField, 
        backgroundColor: '#f5f5f5', 
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#f5f5f5',
          '& fieldset': {
            borderColor: '#ccc', 
          },
          '&:hover fieldset': {
            borderColor: '#aaa', 
          },
          '&.Mui-focused fieldset': {
            borderColor: '#000', 
          },
        },
      }}
        fullWidth
        variant="outlined"
        label="Rechercher une matière"
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Grid container spacing={2} sx={{ my: 2 }}>
        {paginatedSubjects.map((subject, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={Styles.card}>
              <CardContent>
                <Typography variant="h6" align="center">
                  {subject}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination sx={{
    ...Styles.pagination, // Conserve les styles existants définis dans Styles.pagination
    backgroundColor: '#f5f5f5', // Fond gris clair pour l'ensemble de la pagination
    '& .MuiPaginationItem-root': {
      backgroundColor: '#f5f5f5', // Fond des items de pagination
      borderColor: '#ccc', // Bordure des items
      '&:hover': {
        backgroundColor: '#e0e0e0', // Fond au survol
        borderColor: '#aaa', // Bordure au survol
      },
      '&.Mui-selected': {
        backgroundColor: '#d6d6d6', // Fond pour l'élément sélectionné
        borderColor: '#000', // Bordure pour l'élément sélectionné
      },
            },
        }}
          count={Math.ceil(filteredSubjects.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
};

export default SubjectsComponent;
