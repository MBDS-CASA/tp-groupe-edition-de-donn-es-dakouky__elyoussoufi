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

const StudentsComponent = ({ data }) => {
/**
 * Component to display the list of students
 * @param {{data: Array<import("../types").Student>}} props
 * @returns {JSX.Element}
 */
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  /**
   * Search term to filter students
   */
  const itemsPerPage = 6;
  /**
   * Number of items per page
   */

  if (!data || !Array.isArray(data)) {
    return <Box>Aucune donnée disponible</Box>;
  }

  const students = Array.from(
  /**
   * Unique list of students
   */
    new Set(data.map((item) => JSON.stringify(item.student)))
  ).map((student) => JSON.parse(student));

  const filteredStudents = students.filter(student =>
  /**
   * Filtered list of students based on the search term
   */
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
  /**
   * Paginated list of students
   */
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
  label="Rechercher un étudiant"
  margin="normal"
  onChange={(e) => setSearchTerm(e.target.value)}
/>


      <Grid container spacing={2} sx={{ my: 2 }}>
        {paginatedStudents.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card sx={Styles.card}>
              <CardContent>
                <Typography variant="h6">
                  {student.firstname} {student.lastname}
                </Typography>
                <Typography color="textSecondary">
                  ID: {student.id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Pagination 
  sx={{
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
        count={Math.ceil(filteredStudents.length / itemsPerPage)} // Calcul du nombre de pages
        page={page} // Page actuelle
        onChange={(e, value) => setPage(value)} // Gestion du changement de page
        />

      </Box>
    </Box>
  );
};


export default StudentsComponent;