import React, { useState, useMemo } from 'react';
import { 
  Paper,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DashboardComponent = ({ data }) => {
  const theme = useTheme();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Obtenir la liste unique des étudiants
  const students = useMemo(() => {
    const uniqueStudents = new Map();
    data.forEach(item => {
      const studentId = item.student.id;
      if (!uniqueStudents.has(studentId)) {
        uniqueStudents.set(studentId, {
          id: studentId,
          fullName: `${item.student.firstname} ${item.student.lastname}`,
          ...item.student
        });
      }
    });
    return Array.from(uniqueStudents.values());
  }, [data]);

  // Filtrer les données en fonction de l'étudiant sélectionné
  const filteredData = useMemo(() => {
    if (!selectedStudent) return data;
    return data.filter(item => item.student.id === selectedStudent.id);
  }, [data, selectedStudent]);

  // Statistiques générales
  const totalStudents = selectedStudent ? 1 : new Set(data.map(item => item.student.id)).size;
  const totalCourses = new Set(filteredData.map(item => item.course)).size;
  const averageGrade = Math.round(filteredData.reduce((acc, curr) => acc + curr.grade, 0) / filteredData.length);

  // Calculer la moyenne des notes par matière
  const courseAverages = filteredData.reduce((acc, curr) => {
    if (!acc[curr.course]) {
      acc[curr.course] = { total: curr.grade, count: 1 };
    } else {
      acc[curr.course].total += curr.grade;
      acc[curr.course].count += 1;
    }
    return acc;
  }, {});

  const averageData = Object.entries(courseAverages).map(([course, stats]) => ({
    course,
    average: Math.round(stats.total / stats.count)
  }));

  // Distribution des notes par tranches
  const gradeRanges = {
    'Excellent (90-100)': 0,
    'Très Bien (80-89)': 0,
    'Bien (70-79)': 0,
    'Passable (60-69)': 0,
    'Insuffisant (<60)': 0
  };

  filteredData.forEach(item => {
    if (item.grade >= 90) gradeRanges['Excellent (90-100)']++;
    else if (item.grade >= 80) gradeRanges['Très Bien (80-89)']++;
    else if (item.grade >= 70) gradeRanges['Bien (70-79)']++;
    else if (item.grade >= 60) gradeRanges['Passable (60-69)']++;
    else gradeRanges['Insuffisant (<60)']++;
  });

  const gradeDistribution = Object.entries(gradeRanges).map(([range, count]) => ({
    range,
    count,
    percentage: filteredData.length > 0 ? Math.round((count / filteredData.length) * 100) : 0
  }));

  // Styles des cartes de statistiques
  const statCardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 2,
    background: theme.palette.background.default,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[4]
    }
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.grey[100] }}>
      {/* Filtre Étudiant */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Autocomplete
          value={selectedStudent}
          onChange={(event, newValue) => setSelectedStudent(newValue)}
          options={students}
          getOptionLabel={(option) => option.fullName}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrer par étudiant"
              variant="outlined"
              placeholder="Sélectionnez un étudiant"
            />
          )}
          sx={{ width: '100%', maxWidth: 500 }}
        />
      </Paper>

      {/* Titre du dashboard */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        {selectedStudent 
          ? `Tableau de bord de ${selectedStudent.fullName}`
          : 'Tableau de bord général'
        }
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={statCardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <div>
                <Typography variant="h4">{totalStudents}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {selectedStudent ? 'Étudiant' : 'Étudiants'}
                </Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={statCardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
              <div>
                <Typography variant="h4">{totalCourses}</Typography>
                <Typography variant="subtitle2" color="textSecondary">Matières</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={statCardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ fontSize: 40, color: theme.palette.success.main, mr: 2 }} />
              <div>
                <Typography variant="h4">{filteredData.length}</Typography>
                <Typography variant="subtitle2" color="textSecondary">Notes Totales</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={statCardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 2 }} />
              <div>
                <Typography variant="h4">{averageGrade}%</Typography>
                <Typography variant="subtitle2" color="textSecondary">Moyenne Générale</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Moyenne par Matière
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={averageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Moyenne']}
                    contentStyle={{ backgroundColor: theme.palette.background.paper }}
                  />
                  <Legend />
                  <Bar dataKey="average" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Distribution des Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ range, percentage }) => `${range} (${percentage}%)`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} étudiants (${props.payload.percentage}%)`,
                      'Nombre d\'étudiants'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des Notes dans le Temps
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    type="category"
                    tick={{ angle: -45 }}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Note']}
                    contentStyle={{ backgroundColor: theme.palette.background.paper }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="grade" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardComponent;