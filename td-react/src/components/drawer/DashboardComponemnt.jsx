import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Divider, alpha, useTheme, Autocomplete, TextField } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DashboardComponent = () => {
  const theme = useTheme();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, studentsRes, coursesRes] = await Promise.all([
          fetch('http://localhost:8010/api/grades'),
          fetch('http://localhost:8010/api/students'),
          fetch('http://localhost:8010/api/courses')
        ]);

        const gradesData = await gradesRes.json();
        const studentsData = await studentsRes.json();
        const coursesData = await coursesRes.json();

        setGrades(gradesData);
        setStudents(studentsData);
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered data based on selected student
  const filteredGrades = useMemo(() => {
    if (!selectedStudent) return grades;
    return grades.filter(grade => grade.student._id === selectedStudent._id);
  }, [grades, selectedStudent]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = selectedStudent ? 1 : new Set(grades.map(g => g.student._id)).size;
    const totalCourses = new Set(grades.map(g => g.course._id)).size;
    const averageGrade = Math.round(
      filteredGrades.reduce((acc, curr) => acc + curr.grade, 0) / filteredGrades.length
    );

    return {
      totalStudents,
      totalCourses,
      totalGrades: filteredGrades.length,
      averageGrade: isNaN(averageGrade) ? 0 : averageGrade
    };
  }, [filteredGrades, grades, selectedStudent]);

  // Calculate course averages
  const courseAverages = useMemo(() => {
    const averages = {};
    filteredGrades.forEach(grade => {
      if (!averages[grade.course.name]) {
        averages[grade.course.name] = { total: grade.grade, count: 1 };
      } else {
        averages[grade.course.name].total += grade.grade;
        averages[grade.course.name].count += 1;
      }
    });

    return Object.entries(averages).map(([course, data]) => ({
      course,
      average: Math.round(data.total / data.count)
    }));
  }, [filteredGrades]);

  // Calculate grade distribution
  const gradeDistribution = useMemo(() => {
    const ranges = {
      'Excellent (90-100)': 0,
      'Très Bien (80-89)': 0,
      'Bien (70-79)': 0,
      'Passable (60-69)': 0,
      'Insuffisant (<60)': 0
    };

    filteredGrades.forEach(item => {
      if (item.grade >= 90) ranges['Excellent (90-100)']++;
      else if (item.grade >= 80) ranges['Très Bien (80-89)']++;
      else if (item.grade >= 70) ranges['Bien (70-79)']++;
      else if (item.grade >= 60) ranges['Passable (60-69)']++;
      else ranges['Insuffisant (<60)']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
      percentage: filteredGrades.length > 0 ? Math.round((count / filteredGrades.length) * 100) : 0
    }));
  }, [filteredGrades]);

  const CHART_COLORS = ['#7925d3', '#8935e3', '#9945f3', '#a855ff', '#b865ff'];

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      padding: '2rem',
      backgroundColor: '#140524',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      color: '#ebe7ef'
    }}>
      {/* Student Filter */}
      <Paper sx={{ 
        backgroundColor: alpha('#140524', 0.6),
        color: '#ebe7ef',
        p: 2, 
        mb: 3,
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <Autocomplete
          value={selectedStudent}
          onChange={(event, newValue) => setSelectedStudent(newValue)}
          options={students}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrer par étudiant"
              variant="outlined"
              placeholder="Sélectionnez un étudiant"
              sx={{
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
                }
              }}
            />
          )}
          sx={{ width: '100%', maxWidth: 500 }}
        />
      </Paper>

      {/* Dashboard Title */}
      <Typography variant="h5" sx={{ mb: 3, color: '#ebe7ef' }}>
        {selectedStudent 
          ? `Tableau de bord de ${selectedStudent.firstName} ${selectedStudent.lastName}`
          : 'Tableau de bord général'
        }
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            backgroundColor: alpha('#140524', 0.6),
            color: '#ebe7ef',
            padding: '1.5rem',
            borderRadius: '8px',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: alpha('#7925d3', 0.1)
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#7925d3', mr: 2 }} />
              <div>
                <Typography variant="h4">{stats.totalStudents}</Typography>
                <Typography variant="subtitle2" sx={{ color: '#a18aba' }}>
                  {selectedStudent ? 'Étudiant' : 'Étudiants'}
                </Typography>
              </div>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            backgroundColor: alpha('#140524', 0.6),
            color: '#ebe7ef',
            padding: '1.5rem',
            borderRadius: '8px',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: alpha('#7925d3', 0.1)
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: '#7925d3', mr: 2 }} />
              <div>
                <Typography variant="h4">{stats.totalCourses}</Typography>
                <Typography variant="subtitle2" sx={{ color: '#a18aba' }}>Matières</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            backgroundColor: alpha('#140524', 0.6),
            color: '#ebe7ef',
            padding: '1.5rem',
            borderRadius: '8px',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: alpha('#7925d3', 0.1)
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: '#7925d3', mr: 2 }} />
              <div>
                <Typography variant="h4">{stats.totalGrades}</Typography>
                <Typography variant="subtitle2" sx={{ color: '#a18aba' }}>Notes Totales</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            backgroundColor: alpha('#140524', 0.6),
            color: '#ebe7ef',
            padding: '1.5rem',
            borderRadius: '8px',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: alpha('#7925d3', 0.1)
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: '#7925d3', mr: 2 }} />
              <div>
                <Typography variant="h4">{stats.averageGrade}%</Typography>
                <Typography variant="subtitle2" sx={{ color: '#a18aba' }}>Moyenne Générale</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{
            padding: '1.5rem',
            backgroundColor: alpha('#140524', 0.6),
            borderRadius: '8px',
            '& .recharts-text': {
              fill: '#ebe7ef'
            }
          }}>
            <Typography variant="h6" gutterBottom>
              Moyenne par Matière
            </Typography>
            <Divider sx={{ mb: 2, borderColor: alpha('#7925d3', 0.3) }} />
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={courseAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#7925d3', 0.2)} />
                  <XAxis dataKey="course" stroke="#ebe7ef" />
                  <YAxis domain={[0, 100]} stroke="#ebe7ef" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#140524',
                      border: `1px solid ${alpha('#7925d3', 0.3)}`,
                      color: '#ebe7ef'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="average" fill="#7925d3" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{
            padding: '1.5rem',
            backgroundColor: alpha('#140524', 0.6),
            borderRadius: '8px',
            '& .recharts-text': {
              fill: '#ebe7ef'
            }
          }}>
            <Typography variant="h6" gutterBottom>
              Distribution des Notes
            </Typography>
            <Divider sx={{ mb: 2, borderColor: alpha('#7925d3', 0.3) }} />
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: '#ebe7ef' }}
                    label={({ range, percentage }) => `${range} (${percentage}%)`}
                    outerRadius={130}
                    fill="#7925d3"
                    dataKey="count"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#140524',
                      border: `1px solid ${alpha('#7925d3', 0.3)}`,
                      color: '#ebe7ef'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{
            padding: '1.5rem',
            backgroundColor: alpha('#140524', 0.6),
            borderRadius: '8px',
            '& .recharts-text': {
              fill: '#ebe7ef'
            }
          }}>
            <Typography variant="h6" gutterBottom>
              Évolution des Notes dans le Temps
            </Typography>
            <Divider sx={{ mb: 2, borderColor: alpha('#7925d3', 0.3) }} />
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={filteredGrades}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#7925d3', 0.2)} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ebe7ef"
                    tick={{ angle: -45 }}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis domain={[0, 100]} stroke="#ebe7ef" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#140524',
                      border: `1px solid ${alpha('#7925d3', 0.3)}`,
                      color: '#ebe7ef'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="grade" 
                    stroke="#7925d3"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#7925d3' }}
                    activeDot={{ r: 8, fill: '#8935e3' }}
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