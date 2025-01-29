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
  Pagination,
  Alert,
  Snackbar,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const API_URL = 'http://localhost:8010/api';

const NotesComponent = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const itemsPerPage = 5;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [filters, setFilters] = useState({
    name: '',
    course: '',
    date: '',
    grade: ''
  });

  const [currentNote, setCurrentNote] = useState({
    student: '',
    course: '',
    date: '',
    grade: '',
    _id: null
  });

  // Create theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    }
  });

  // Fetch all necessary data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [gradesRes, studentsRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/grades`),
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/courses`)
      ]);

      if (!gradesRes.ok || !studentsRes.ok || !coursesRes.ok) 
        throw new Error('Erreur lors de la récupération des données');

      const [gradesData, studentsData, coursesData] = await Promise.all([
        gradesRes.json(),
        studentsRes.json(),
        coursesRes.json()
      ]);

      const gradesArray = Array.isArray(gradesData) ? gradesData : gradesData.grades || [];
      setGrades(gradesArray);
      setStudents(studentsData);
      setCourses(coursesData);
      setFilteredData(gradesArray);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  const handleThemeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Filter data effect
  useEffect(() => {
    if (!grades.length) return;
    
    const filtered = grades.filter((row) => {
      const studentName = row.student ? 
        `${row.student.firstName || ''} ${row.student.lastName || ''}`.toLowerCase() : '';
      const courseName = row.course ? row.course.name.toLowerCase() : '';
      const date = row.date ? new Date(row.date).toLocaleDateString() : '';
      const grade = row.grade ? row.grade.toString() : '';

      return (
        studentName.includes(filters.name.toLowerCase()) &&
        courseName.includes(filters.course.toLowerCase()) &&
        date.includes(filters.date) &&
        grade.includes(filters.grade)
      );
    });
    
    setFilteredData(filtered);
  }, [grades, filters]);

  const handleSaveNote = async () => {
    if (!currentNote.student || !currentNote.course || !currentNote.date || !currentNote.grade) {
      showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    try {
      const method = currentNote._id ? 'PUT' : 'POST';
      const url = currentNote._id ? 
        `${API_URL}/grades/${currentNote._id}` : 
        `${API_URL}/grades`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: currentNote.student,
          course: currentNote.course,
          grade: Number(currentNote.grade),
          date: new Date(currentNote.date).toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }

      showNotification(
        `Note ${currentNote._id ? 'modifiée' : 'ajoutée'} avec succès`
      );
      await fetchData();
      setIsDialogOpen(false);
      resetCurrentNote();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/grades/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      showNotification('Note supprimée avec succès');
      await fetchData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const resetCurrentNote = () => {
    setCurrentNote({
      student: '',
      course: '',
      date: '',
      grade: '',
      _id: null
    });
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Alert severity="error">
          Erreur de chargement : {error}
        </Alert>
      </ThemeProvider>
    );
  }

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetCurrentNote();
              setIsDialogOpen(true);
            }}
          >
            Ajouter une note
          </Button>
          
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                icon={<Brightness7Icon />}
                checkedIcon={<Brightness4Icon />}
              />
            }
            label={darkMode ? "Mode sombre" : "Mode clair"}
          />
        </Box>

        <TableContainer component={Paper}>
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
                  />
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    {row.student ? 
                      `${row.student.firstName || ''} ${row.student.lastName || ''}` : 
                      'N/A'}
                  </TableCell>
                  <TableCell>
                    {row.course ? row.course.name : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>{row.grade || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setCurrentNote({
                          ...row,
                          student: row.student?._id || '',
                          course: row.course?._id || '',
                          date: row.date ? new Date(row.date).toISOString().split('T')[0] : ''
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteNote(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>

        <Dialog 
          open={isDialogOpen} 
          onClose={() => {
            setIsDialogOpen(false);
            resetCurrentNote();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {currentNote._id ? 'Modifier une note' : 'Ajouter une note'}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Élève</InputLabel>
              <Select
                value={currentNote.student}
                onChange={(e) => setCurrentNote({ ...currentNote, student: e.target.value })}
                label="Élève"
              >
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.firstName} {student.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Cours</InputLabel>
              <Select
                value={currentNote.course}
                onChange={(e) => setCurrentNote({ ...currentNote, course: e.target.value })}
                label="Cours"
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
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
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Note"
              type="number"
              value={currentNote.grade}
              onChange={(e) => setCurrentNote({ ...currentNote, grade: e.target.value })}
              inputProps={{ min: 0, max: 100 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsDialogOpen(false);
              resetCurrentNote();
            }}>
              Annuler
            </Button>
            <Button onClick={handleSaveNote} variant="contained">
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default NotesComponent;