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
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';

const getThemeStyles = (isDarkMode) => ({
  container: {
    width: '100%',
    padding: '2rem',
    backgroundColor: isDarkMode ? '#140524' : '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    transition: 'background-color 0.3s ease',
  },
  searchBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDarkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
      color: isDarkMode ? '#ebe7ef' : '#000000',
      '& fieldset': {
        borderColor: isDarkMode ? alpha('#7925d3', 0.3) : alpha('#7925d3', 0.5),
      },
      '&:hover fieldset': {
        borderColor: '#7925d3',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#7925d3',
      },
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? '#a18aba' : '#666666',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7925d3',
    },
  },
  button: {
    backgroundColor: '#7925d3',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#8935e3',
    },
  },
  outlinedButton: {
    color: isDarkMode ? '#ebe7ef' : '#000000',
    borderColor: alpha('#7925d3', 0.3),
    '&:hover': {
      backgroundColor: alpha('#7925d3', 0.2),
      borderColor: '#7925d3',
    },
    '&.active': {
      backgroundColor: '#7925d3',
      borderColor: '#7925d3',
      color: '#ffffff',
    },
  },
  listContainer: {
    backgroundColor: isDarkMode ? alpha('#140524', 0.6) : '#ffffff',
    borderRadius: '8px',
    marginBottom: '1rem',
    transition: 'background-color 0.3s ease',
    '& .MuiListItem-root': {
      borderBottom: `1px solid ${isDarkMode ? alpha('#7925d3', 0.2) : alpha('#000000', 0.1)}`,
      '&:hover': {
        backgroundColor: isDarkMode ? alpha('#7925d3', 0.1) : alpha('#7925d3', 0.05),
      },
    },
    '& .MuiListItemText-primary': {
      color: isDarkMode ? '#ebe7ef' : '#000000',
    },
    '& .MuiListItemText-secondary': {
      color: isDarkMode ? '#a18aba' : '#666666',
    },
  },
  iconButton: {
    color: isDarkMode ? '#a18aba' : '#666666',
    '&:hover': {
      backgroundColor: alpha('#7925d3', 0.2),
      color: isDarkMode ? '#ebe7ef' : '#000000',
    },
  },
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: isDarkMode ? '#140524' : '#ffffff',
      color: isDarkMode ? '#ebe7ef' : '#000000',
      padding: '1rem',
    },
    '& .MuiDialogTitle-root': {
      color: isDarkMode ? '#ebe7ef' : '#000000',
    },
  },
  pagination: {
    '& .MuiPaginationItem-root': {
      color: isDarkMode ? '#ebe7ef' : '#000000',
      borderColor: alpha('#7925d3', 0.3),
      '&:hover': {
        backgroundColor: alpha('#7925d3', 0.2),
      },
      '&.Mui-selected': {
        backgroundColor: '#7925d3',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#8935e3',
        },
      },
    },
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    color: isDarkMode ? '#ebe7ef' : '#000000',
    '& .MuiSwitch-root': {
      '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#7925d3',
        '& + .MuiSwitch-track': {
          backgroundColor: alpha('#7925d3', 0.5),
        },
      },
      '& .MuiSwitch-track': {
        backgroundColor: isDarkMode ? '#a18aba' : '#666666',
      },
    },
  },
});

const StudentsManager = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const customStyles = getThemeStyles(isDarkMode);
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

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

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
        color: isDarkMode ? '#ebe7ef' : '#000000'
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
      <Box sx={customStyles.themeToggle}>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={handleThemeToggle}
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label={isDarkMode ? 'Mode sombre' : 'Mode clair'}
        />
      </Box>

      <Box sx={customStyles.searchBar}>
        <TextField
          fullWidth
          variant="outlined"
          label="Rechercher un étudiant (nom ou prénom)"
          value={filters.search}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: isDarkMode ? '#a18aba' : '#666666', mr: 1 }} />,
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
              sx={{ textAlign: 'center', color: isDarkMode ? '#a18aba' : '#666666' }}
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

    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialog} 
      sx={customStyles.dialog}
    >
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
        <Button 
          onClick={handleCloseDialog} 
          sx={{
            ...customStyles.button,
            backgroundColor: 'transparent',
            color: isDarkMode ? '#ebe7ef' : '#000000',
            '&:hover': {
              backgroundColor: alpha('#7925d3', 0.1),
            }
          }}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          sx={customStyles.button}
        >
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
      <Alert 
        onClose={handleCloseSnackbar} 
        severity={snackbar.severity} 
        sx={{ 
          width: '100%',
          backgroundColor: isDarkMode ? '#140524' : '#ffffff',
          color: isDarkMode ? '#ebe7ef' : '#000000',
          '& .MuiAlert-icon': {
            color: snackbar.severity === 'success' ? '#4caf50' : '#f44336'
          }
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
);
};

export default StudentsManager;