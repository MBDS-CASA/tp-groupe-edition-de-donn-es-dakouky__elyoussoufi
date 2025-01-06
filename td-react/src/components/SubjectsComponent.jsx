import { useState, useEffect } from "react";
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
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const SubjectsComponent = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState("");
  const [editCourseId, setEditCourseId] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Récupération des données
  useEffect(() => {
    fetch("http://localhost:8010/api/courses")
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        return response.json();
      })
      .then(setCourses)
      .catch((err) => setError(err.message));
  }, []);

  // Ajouter ou modifier un cours
  const handleAddOrEditCourse = () => {
    const method = editCourseId ? "PUT" : "POST";
    const url = editCourseId
      ? `http://localhost:8010/api/courses/${editCourseId}`
      : "http://localhost:8010/api/courses";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentCourse, code: "N/A" }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la sauvegarde du cours");
        return response.json();
      })
      .then(() => {
        fetch("http://localhost:8010/api/courses") // Recharger les données
          .then((response) => response.json())
          .then(setCourses);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setIsDialogOpen(false);
        setCurrentCourse("");
        setEditCourseId(null);
      });
  };

  // Supprimer un cours
  const handleDeleteCourse = (courseId) => {
    fetch(`http://localhost:8010/api/courses/${courseId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la suppression du cours");
        return response.json();
      })
      .then(() => {
        setCourses((prev) => prev.filter((course) => course._id !== courseId));
      })
      .catch((err) => setError(err.message));
  };

  // Activer le mode édition
  const handleEditCourse = (course) => {
    setEditCourseId(course._id);
    setCurrentCourse(course.name);
    setIsDialogOpen(true);
  };

  const paginatedData = courses
    .filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ padding: 2 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher un cours"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
          Ajouter un cours
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du cours</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.name}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditCourse(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteCourse(course._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(courses.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{editCourseId ? "Modifier un cours" : "Ajouter un cours"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={currentCourse}
            onChange={(e) => setCurrentCourse(e.target.value)}
            placeholder="Nom du cours"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddOrEditCourse} color="primary">
            {editCourseId ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectsComponent;
