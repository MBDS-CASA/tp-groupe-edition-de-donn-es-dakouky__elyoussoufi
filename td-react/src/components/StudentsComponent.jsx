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
  styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SortIcon from '@mui/icons-material/Sort';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.2s ease',
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap'
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));

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
    <Box sx={{ width: '100%', p: 3 }}>
      <FiltersContainer>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Rechercher un étudiant (nom ou prénom)"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </Grid>
        </Grid>
      </FiltersContainer>

      <ActionsContainer>
        <ButtonGroup variant="contained">
          <Button onClick={() => handleOpenDialog()}>Ajouter un étudiant</Button>
          <Button startIcon={<FileDownloadIcon />} onClick={exportToCSV}>
            Exporter CSV
          </Button>
        </ButtonGroup>

        <ButtonGroup variant="outlined">
          <Button
            startIcon={<SortIcon />}
            onClick={() => handleSort('firstname')}
            color={filters.sortBy === 'firstname' ? 'primary' : 'inherit'}
          >
            Trier par prénom
          </Button>
          <Button
            startIcon={<SortIcon />}
            onClick={() => handleSort('lastname')}
            color={filters.sortBy === 'lastname' ? 'primary' : 'inherit'}
          >
            Trier par nom
          </Button>
        </ButtonGroup>
      </ActionsContainer>

      <Paper elevation={3} sx={{ width: '100%', mb: 3 }}>
        <List>
          {paginatedStudents.map((student) => (
            <StyledListItem key={student.unique_id} divider>
              <ListItemText
                primary={`${student.student.firstname} ${student.student.lastname}`}
                secondary={`ID: ${student.unique_id}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleOpenDialog(student)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDelete(student.unique_id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </StyledListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredStudents.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingStudent ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsManager;
