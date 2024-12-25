import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const CreateNotes = ({ onAddNote }) => {
  const [newNote, setNewNote] = useState({
    firstname: '',
    lastname: '',
    course: '',
    date: '',
    grade: '',
  });

  const handleAddNote = () => {
    // Appelle la fonction parent pour ajouter une nouvelle note
    onAddNote({
      unique_id: Date.now().toString(), // Génère un ID unique
      student: {
        firstname: newNote.firstname,
        lastname: newNote.lastname,
      },
      course: newNote.course,
      date: newNote.date,
      grade: newNote.grade,
    });

    // Réinitialise le formulaire
    setNewNote({
      firstname: '',
      lastname: '',
      course: '',
      date: '',
      grade: '',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginBottom: 4,
        padding: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
      }}
    >
      <TextField
        label="Prénom"
        variant="outlined"
        value={newNote.firstname}
        onChange={(e) => setNewNote({ ...newNote, firstname: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey.100',
          },
        }}
      />
      <TextField
        label="Nom"
        variant="outlined"
        value={newNote.lastname}
        onChange={(e) => setNewNote({ ...newNote, lastname: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey.100',
          },
        }}
      />
      <TextField
        label="Cours"
        variant="outlined"
        value={newNote.course}
        onChange={(e) => setNewNote({ ...newNote, course: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey.100',
          },
        }}
      />
      <TextField
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        value={newNote.date}
        onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey.100',
          },
        }}
      />
      <TextField
        label="Note"
        type="number"
        variant="outlined"
        value={newNote.grade}
        onChange={(e) => setNewNote({ ...newNote, grade: e.target.value })}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey.100',
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNote}
        disabled={
          !newNote.firstname ||
          !newNote.lastname ||
          !newNote.course ||
          !newNote.date ||
          !newNote.grade
        }
      >
        Ajouter la note
      </Button>
    </Box>
  );
};

export default CreateNotes;
