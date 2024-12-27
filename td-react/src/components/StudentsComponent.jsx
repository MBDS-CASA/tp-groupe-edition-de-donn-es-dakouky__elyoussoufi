import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Paper,
  ButtonGroup,
  alpha,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';

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
  button: {
    backgroundColor: '#7925d3',
    color: '#ebe7ef',
    '&:hover': {
      backgroundColor: '#8935e3',
    },
  },
  outlinedButton: {
    color: '#ebe7ef',
    borderColor: alpha('#7925d3', 0.3),
    '&:hover': {
      backgroundColor: alpha('#7925d3', 0.2),
      borderColor: '#7925d3',
    },
    '&.active': {
      backgroundColor: '#7925d3',
      borderColor: '#7925d3',
    },
  },
  listContainer: {
    backgroundColor: alpha('#140524', 0.6),
    borderRadius: '8px',
    marginBottom: '1rem',
    '& .MuiListItem-root': {
      borderBottom: `1px solid ${alpha('#7925d3', 0.2)}`,
      '&:hover': {
        backgroundColor: alpha('#7925d3', 0.1),
      },
    },
    '& .MuiListItemText-primary': {
      color: '#ebe7ef',
    },
    '& .MuiListItemText-secondary': {
      color: '#a18aba',
    },
  },
  iconButton: {
    color: '#a18aba',
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

const StudentsManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [dialogForm, setDialogForm] = useState({
    firstName: '',
    lastName: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const itemsPerPage = 10;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8010/api/students');
      setStudents(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Erreur lors du chargement des étudiants');
      setStudents([]);
      showSnackbar('Erreur lors du chargement des étudiants', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const sortStudents = (studentsToSort) => {
    if (!filters.sortBy) return studentsToSort;
    return [...studentsToSort].sort((a, b) => {
      const valueA = a[filters.sortBy].toLowerCase();
      const valueB = b[filters.sortBy].toLowerCase();
      return valueA.localeCompare(valueB);
    });
  };

  const filteredStudents = sortStudents(
    students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(filters.search.toLowerCase());
    })
  );

  const paginatedStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: prev.sortBy === field ? null : field
    }));
  };

  const handleOpenDialog = (student = null) => {
    setEditingStudent(student);
    setDialogForm(student ? {
      firstName: student.firstName,
      lastName: student.lastName
    } : {
      firstName: '',
      lastName: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
    setDialogForm({ firstName: '', lastName: '' });
  };

  const handleSubmit = async () => {
    try {
      console.log('Dialog Form:', dialogForm); // Log pour vérifier le formulaire
      console.log('Editing Student ID:', editingStudent ? editingStudent._id : 'None'); // Log pour vérifier l'ID
      
      if (editingStudent) {
        await axios.put(`http://localhost:8010/api/students/${editingStudent._id}`, dialogForm);
        showSnackbar('Étudiant mis à jour avec succès');
      } else {
        await axios.post('http://localhost:8010/api/students', dialogForm);
        showSnackbar('Étudiant ajouté avec succès');
      }
      fetchStudents();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving student:', err);
      showSnackbar('Erreur lors de l\'opération', 'error');
    }
  };
  

  const handleDelete = async (id) => {
    try {
      console.log('Deleting student with ID:', id); // Log pour vérifier l'ID
      await axios.delete(`http://localhost:8010/api/students/${id}`);
      showSnackbar('Étudiant supprimé avec succès');
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };
  

  const exportToCSV = () => {
    const csvContent = [
      ['Prénom', 'Nom'],
      ...filteredStudents.map(student => [
        student.firstName,
        student.lastName
      ])
    ]
      .map(row => row.join(','))
      .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students_filtered.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{
        ...customStyles.container,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress sx={{ color: '#7925d3' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        ...customStyles.container,
        textAlign: 'center',
        color: '#ebe7ef'
      }}>
        <p>{error}</p>
        <Button
          variant="contained"
          onClick={fetchStudents}
          sx={customStyles.button}
        >
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={customStyles.container}>
      <Box sx={customStyles.searchBar}>
        <TextField
          fullWidth
          variant="outlined"
          label="Rechercher un étudiant (nom ou prénom)"
          value={filters.search}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#a18aba', mr: 1 }} />,
          }}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          sx={customStyles.textField}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={customStyles.button}
        >
          Ajouter un étudiant
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={exportToCSV}
          sx={customStyles.button}
        >
          Exporter CSV
        </Button>
        <ButtonGroup>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={() => handleSort('firstName')}
            sx={{
              ...customStyles.outlinedButton,
              ...(filters.sortBy === 'firstName' && { backgroundColor: '#7925d3' }),
            }}
          >
            Trier par prénom
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={() => handleSort('lastName')}
            sx={{
              ...customStyles.outlinedButton,
              ...(filters.sortBy === 'lastName' && { backgroundColor: '#7925d3' }),
            }}
          >
            Trier par nom
          </Button>
        </ButtonGroup>
      </Box>

      <Paper sx={customStyles.listContainer} elevation={3}>
        <List>
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <ListItem key={student._id}>
                <ListItemText
                  primary={`${student.firstName} ${student.lastName}`}
                  secondary={`ID: ${student._id}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenDialog(student)}
                    sx={customStyles.iconButton}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(student._id)}
                    sx={customStyles.iconButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="Aucun étudiant trouvé"
                sx={{ textAlign: 'center', color: '#a18aba' }}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredStudents.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={customStyles.pagination}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} sx={customStyles.dialog}>
  <DialogTitle>
    {editingStudent ? 'Modifier un étudiant' : 'Ajouter un étudiant'}
  </DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Prénom"
      fullWidth
      variant="outlined"
      value={dialogForm.firstName}
      onChange={(e) => setDialogForm(prev => ({ ...prev, firstName: e.target.value }))}
      sx={customStyles.textField}
    />
    <TextField
      margin="dense"
      label="Nom"
      fullWidth
      variant="outlined"
      value={dialogForm.lastName}
      onChange={(e) => setDialogForm(prev => ({ ...prev, lastName: e.target.value }))}
      sx={customStyles.textField}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary" sx={customStyles.button}>
      Annuler
    </Button>
    <Button onClick={handleSubmit} color="primary" sx={customStyles.button}>
      {editingStudent ? 'Mettre à jour' : 'Ajouter'}
    </Button>
  </DialogActions>
</Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentsManager;