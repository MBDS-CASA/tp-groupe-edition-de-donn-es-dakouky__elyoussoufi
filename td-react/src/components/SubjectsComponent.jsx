/* import { useState } from 'react';
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
 */
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
  alpha,
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Styles } from '../styles';

const SubjectsComponent = ({ data: initialData }) => {
  // State for memory data management
  const [memoryData, setMemoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 5;

  // Initialize memory data from props
  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setMemoryData(initialData);
    }
  }, []);

  // Filter and search effect
  useEffect(() => {
    if (!memoryData || !Array.isArray(memoryData)) return;
    
    const subjects = Array.from(new Set(memoryData.map((item) => item.course)));
    const filtered = subjects.filter((subject) =>
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [memoryData, searchTerm]);

  if (!memoryData || !Array.isArray(memoryData)) {
    return <Box sx={{ color: '#ebe7ef' }}>Aucune donnée disponible</Box>;
  }

  const handleAddCourse = () => {
    if (currentCourse.trim()) {
      let updatedData;
      if (!editMode) {
        // Add new course
        updatedData = [...memoryData, { course: currentCourse.trim() }];
      } else {
        // Edit existing course
        updatedData = memoryData.map((item) =>
          item.course === editMode ? { ...item, course: currentCourse.trim() } : item
        );
      }
      setMemoryData(updatedData);
      setIsDialogOpen(false);
      setCurrentCourse('');
      setEditMode(null);
    }
  };

  const handleDeleteCourse = (course) => {
    const updatedData = memoryData.filter((item) => item.course !== course);
    setMemoryData(updatedData);
  };

  // Pagination
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      flex: 1,
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
    emptyMessage: {
      color: '#a18aba',
      textAlign: 'center',
      padding: '2rem',
    }
  };

  return (
    <Box sx={customStyles.container}>
      <Box sx={customStyles.searchBar}>
        <TextField
          fullWidth
          variant="outlined"
          label="Rechercher une matière"
          value={searchTerm}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#a18aba', mr: 1 }} />,
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={customStyles.textField}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMode(null);
            setCurrentCourse('');
            setIsDialogOpen(true);
          }}
          sx={customStyles.addButton}
        >
          Ajouter un cours
        </Button>
      </Box>

      <TableContainer component={Paper} sx={customStyles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du cours</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell>{subject}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditMode(subject);
                        setCurrentCourse(subject);
                        setIsDialogOpen(true);
                      }}
                      sx={customStyles.iconButton}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCourse(subject)}
                      sx={customStyles.iconButton}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={customStyles.emptyMessage}>
                  Aucun cours trouvé
                </TableCell>
              </TableRow>
            )}
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
          setCurrentCourse('');
          setEditMode(null);
        }}
        sx={customStyles.dialog}
      >
        <DialogTitle>
          {editMode ? 'Editer un cours' : 'Ajouter un cours'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Nom du cours"
            value={currentCourse}
            onChange={(e) => setCurrentCourse(e.target.value)}
            sx={{ ...customStyles.textField, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsDialogOpen(false);
              setCurrentCourse('');
              setEditMode(null);
            }}
            sx={{ color: '#a18aba' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAddCourse}
            sx={customStyles.addButton}
          >
            {editMode ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectsComponent;