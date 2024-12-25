import { useState } from 'react';
import { Styles } from '../styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Box
} from '@mui/material';

const NotesComponent = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // États pour les filtres par colonne
  const [nameFilter, setNameFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  if (!data || !Array.isArray(data)) {
    return <Box>Aucune donnée disponible</Box>;
  }

  // Filtrer les données en fonction des champs de recherche
  const filteredData = data.filter((row) => {
    const fullName = `${row.student.firstname} ${row.student.lastname}`.toLowerCase();
    const course = row.course.toLowerCase();
    const date = row.date.toLowerCase();
    const grade = row.grade.toString().toLowerCase();

    return (
      fullName.includes(nameFilter.toLowerCase()) &&
      course.includes(courseFilter.toLowerCase()) &&
      date.includes(dateFilter.toLowerCase()) &&
      grade.includes(gradeFilter.toLowerCase())
    );
  });

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={Styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Nom"
                  size="small"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Cours"
                  size="small"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Date"
                  size="small"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Note"
                  size="small"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Cours</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.unique_id}>
                  <TableCell>{`${row.student.firstname} ${row.student.lastname}`}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.grade}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default NotesComponent;
