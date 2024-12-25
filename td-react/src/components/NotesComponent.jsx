/* import { useState } from 'react';
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

export default NotesComponent; */
import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const NotesComponent = ({ data: initialData, students = [], courses = [] }) => {
  // State management
  const [memoryData, setMemoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 5;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    course: '',
    date: '',
    grade: ''
  });

  // Current note being edited
  const [currentNote, setCurrentNote] = useState({
    student_id: '',
    course: '',
    date: '',
    grade: '',
    unique_id: null
  });

  // Initialize memory data from props
  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setMemoryData(initialData);
    }
  }, [initialData]);

  // Filter data effect
  useEffect(() => {
    if (!memoryData || !Array.isArray(memoryData)) return;
    
    const filtered = memoryData.filter((row) => {
      const fullName = `${row.student.firstname} ${row.student.lastname}`.toLowerCase();
      const course = row.course.toLowerCase();
      const date = row.date.toLowerCase();
      const grade = row.grade.toString().toLowerCase();

      return (
        fullName.includes(filters.name.toLowerCase()) &&
        course.includes(filters.course.toLowerCase()) &&
        date.includes(filters.date.toLowerCase()) &&
        grade.includes(filters.grade.toLowerCase())
      );
    });
    
    setFilteredData(filtered);
  }, [memoryData, filters]);

  const customStyles = {
    container: {
      width: '100%',
      padding: '2rem',
      backgroundColor: '#140524',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    },
    searchBar: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      alignItems: 'center',
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: alpha('#ffffff', 0.05),
        color: '#ebe7ef',
        '& fieldset': {
          borderColor: alpha('#7925d3', 0.3),
        },
        '&:hover fieldset': {
          borderColor: '#7925d3',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#7925d3',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#a18aba',
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#7925d3',
      },
    },
    formControl: {
      '& .MuiSelect-select': {
        backgroundColor: alpha('#ffffff', 0.05),
        color: '#ebe7ef',
      },
    },
    tableContainer: {
      backgroundColor: alpha('#140524', 0.6),
      borderRadius: '8px',
      marginBottom: '1rem',
      '& .MuiTableCell-root': {
        color: '#ebe7ef',
        borderColor: alpha('#7925d3', 0.2),
      },
      '& .MuiTableHead-root .MuiTableCell-root': {
        backgroundColor: alpha('#7925d3', 0.2),
        fontWeight: 'bold',
      },
      '& .MuiTableRow-root:hover': {
        backgroundColor: alpha('#7925d3', 0.1),
      },
    },
    addButton: {
      backgroundColor: '#7925d3',
      color: '#ebe7ef',
      '&:hover': {
        backgroundColor: '#8935e3',
      },
    },
    iconButton: {
      color: '#a18aba',
      margin: '0 4px',
      '&:hover': {
        backgroundColor: alpha('#7925d3', 0.2),
        color: '#ebe7ef',
      },
    },
    dialog: {
      '& .MuiDialog-paper': {
        backgroundColor: '#140524',
        color: '#ebe7ef',
        padding: '1rem',
      },
      '& .MuiDialogTitle-root': {
        color: '#ebe7ef',
      },
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1rem',
      '& .MuiPaginationItem-root': {
        color: '#ebe7ef',
        borderColor: alpha('#7925d3', 0.3),
        '&:hover': {
          backgroundColor: alpha('#7925d3', 0.2),
        },
        '&.Mui-selected': {
          backgroundColor: '#7925d3',
          '&:hover': {
            backgroundColor: '#8935e3',
          },
        },
      },
    },
  };

  const handleSaveNote = () => {
    if (!currentNote.student_id || !currentNote.course || !currentNote.date || !currentNote.grade) {
      return;
    }

    const newNote = {
      student: students.find((s) => s.id === currentNote.student_id),
      course: currentNote.course,
      date: currentNote.date,
      grade: currentNote.grade,
      unique_id: currentNote.unique_id || Date.now()
    };

    if (currentNote.unique_id) {
      setMemoryData(memoryData.map((note) => 
        note.unique_id === currentNote.unique_id ? newNote : note
      ));
    } else {
      setMemoryData([...memoryData, newNote]);
    }

    setIsDialogOpen(false);
    setCurrentNote({
      student_id: '',
      course: '',
      date: '',
      grade: '',
      unique_id: null
    });
  };

  const handleDeleteNote = (unique_id) => {
    setMemoryData(memoryData.filter((note) => note.unique_id !== unique_id));
  };

  // Pagination
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={customStyles.container}>
      <Box sx={customStyles.searchBar}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={customStyles.addButton}
        >
          Ajouter une note
        </Button>
      </Box>

      <TableContainer component={Paper} sx={customStyles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Nom"
                  size="small"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  sx={customStyles.textField}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Cours"
                  size="small"
                  value={filters.course}
                  onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                  sx={customStyles.textField}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Date"
                  size="small"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  sx={customStyles.textField}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Note"
                  size="small"
                  value={filters.grade}
                  onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                  sx={customStyles.textField}
                />
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.unique_id}>
                <TableCell>{`${row.student.firstname} ${row.student.lastname}`}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.grade}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setCurrentNote({
                        student_id: row.student.id,
                        course: row.course,
                        date: row.date,
                        grade: row.grade,
                        unique_id: row.unique_id
                      });
                      setIsDialogOpen(true);
                    }}
                    sx={customStyles.iconButton}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteNote(row.unique_id)}
                    sx={customStyles.iconButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={customStyles.pagination}
        />
      )}

      <Dialog 
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setCurrentNote({
            student_id: '',
            course: '',
            date: '',
            grade: '',
            unique_id: null
          });
        }}
        sx={customStyles.dialog}
      >
        <DialogTitle>
          {currentNote.unique_id ? 'Modifier la note' : 'Ajouter une note'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ ...customStyles.formControl, mb: 2, mt: 2 }}>
            <InputLabel>Élève</InputLabel>
            <Select
              value={currentNote.student_id}
              onChange={(e) => setCurrentNote({ ...currentNote, student_id: e.target.value })}
              label="Élève"
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstname} {student.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ ...customStyles.formControl, mb: 2 }}>
            <InputLabel>Cours</InputLabel>
            <Select
              value={currentNote.course}
              onChange={(e) => setCurrentNote({ ...currentNote, course: e.target.value })}
              label="Cours"
            >
              {courses.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="outlined"
            label="Date"
            type="date"
            value={currentNote.date}
            onChange={(e) => setCurrentNote({ ...currentNote, date: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ ...customStyles.textField, mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Note"
            type="number"
            value={currentNote.grade}
            onChange={(e) => setCurrentNote({ ...currentNote, grade: e.target.value })}
            sx={customStyles.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsDialogOpen(false);
              setCurrentNote({
                student_id: '',
                course: '',
                date: '',
                grade: '',
                unique_id: null
              });
            }}
            sx={{ color: '#a18aba' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveNote}
            sx={customStyles.addButton}
          >
            {currentNote.unique_id ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotesComponent;