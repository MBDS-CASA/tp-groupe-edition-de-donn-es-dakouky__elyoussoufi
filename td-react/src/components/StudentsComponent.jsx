import { useState, useEffect } from 'react';
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
  Grid,
  ButtonGroup,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

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

const StudentsManager = ({ data }) => {
  const [students, setStudents] = useState(data);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [dialogForm, setDialogForm] = useState({
    firstname: '',
    lastname: ''
  });
  const itemsPerPage = 10;

  useEffect(() => {
    setStudents(data);
  }, [data]);

  const sortStudents = (students) => {
    if (!filters.sortBy) return students;
    return [...students].sort((a, b) => {
      const valueA = a.student[filters.sortBy].toLowerCase();
      const valueB = b.student[filters.sortBy].toLowerCase();
      return valueA.localeCompare(valueB);
    });
  };

  const filteredStudents = sortStudents(
    students.filter((student) => {
      const matchesSearch = `${student.student.firstname} ${student.student.lastname}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      return matchesSearch;
    })
  );

  const paginatedStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === field ? null : field
    }));
  };

  const handleOpenDialog = (student = null) => {
    setEditingStudent(student);
    setDialogForm(student ? student.student : { firstname: '', lastname: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
    setDialogForm({ firstname: '', lastname: '' });
  };

  const handleSubmit = () => {
    if (editingStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.unique_id === editingStudent.unique_id
            ? { ...s, student: { ...dialogForm } }
            : s
        )
      );
    } else {
      setStudents((prev) => [
        ...prev,
        {
          unique_id: Math.random().toString(36).substr(2, 9),
          student: { ...dialogForm }
        }
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((student) => student.unique_id !== id));
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Prénom', 'Nom'],
      ...filteredStudents.map((student) => [
        student.student.firstname,
        student.student.lastname
      ])
    ]
      .map((row) => row.join(','))
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
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
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
            onClick={() => handleSort('firstname')}
            sx={{
              ...customStyles.outlinedButton,
              ...(filters.sortBy === 'firstname' && { backgroundColor: '#7925d3' }),
            }}
          >
            Trier par prénom
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={() => handleSort('lastname')}
            sx={{
              ...customStyles.outlinedButton,
              ...(filters.sortBy === 'lastname' && { backgroundColor: '#7925d3' }),
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
              <ListItem key={student.unique_id}>
                <ListItemText
                  primary={`${student.student.firstname} ${student.student.lastname}`}
                  secondary={`ID: ${student.unique_id}`}
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
                    onClick={() => handleDelete(student.unique_id)}
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
            value={dialogForm.firstname}
            onChange={(e) =>
              setDialogForm((prev) => ({
                ...prev,
                firstname: e.target.value
              }))
            }
            sx={customStyles.textField}
          />
          <TextField
            margin="dense"
            label="Nom"
            fullWidth
            variant="outlined"
            value={dialogForm.lastname}
            onChange={(e) =>
              setDialogForm((prev) => ({
                ...prev,
                lastname: e.target.value
              }))
            }
            sx={customStyles.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: '#a18aba' }}
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
    </Box>
  );
};

export default StudentsManager;