import { useState } from 'react';
import { 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as NotesIcon,
  People as StudentsIcon,
  Book as SubjectsIcon,
  Info as AboutIcon,
  
} from '@mui/icons-material';
import Dashboard from '@mui/icons-material/Dashboard';
import DashboardComponent from './components/DashboardComponemnt';
import AddIcon from '@mui/icons-material/Add';

import NotesComponent from './components/NotesComponent';
import StudentsComponent from './components/StudentsComponent';
import SubjectsComponent from './components/SubjectsComponent';
import AboutComponent from './components/AboutComponent';
import CreateNotes from './components/CreateNotes';
import data from './data.json';
import './index.css';
import { Styles } from './styles';


function Header() {
  return (
    <Box component="header" sx={Styles.header}>
      <img 
        src="src/assets/logo.png" 
        alt="Logo de la formation" 
        style={{ height: '10rem', width: '10rem', objectFit: 'cover' }} 
      />
      <Typography variant="h1" className="header-title">
        Introduction à React
      </Typography>
      <Typography variant="subtitle1" className="header-subtitle">
        A la découverte des premières notions de React
      </Typography>
    </Box>
  );
}

function MainContent() {
  const now = new Date();
  const day = now.toLocaleDateString('fr-FR', { weekday: 'long' });
  const month = now.toLocaleDateString('fr-FR', { month: 'long' });
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return (
    <Box component="section" sx={{ textAlign: 'center', margin: '20px' }}>
      <Typography sx={{ color: '#ebe7ef' }}>
        Bonjour, on est le {day}, {month}, {year} et il est {hours}:{minutes}:{seconds}
      </Typography>
    </Box>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const nom = "Dakouky";
  const prenom = "El Mestapha";
  
  return (
    <Box 
      component="footer" 
      className="app-footer"
      sx={{ 
        textAlign: 'center', 
        padding: '20px', 
        position: 'fixed', 
        bottom: 0, 
        width: '100%'
      }}
    >
      <Typography>© {year} - {prenom} {nom}, Tous droits réservés.</Typography>
    </Box>
  );
}

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Notes');

  const menuItems = [
    { name: 'Tableau de Bord', icon: <Dashboard />, component: <DashboardComponent data={data} /> },
    { name: 'Notes', icon: <NotesIcon />, component: <NotesComponent data={data} /> },
    { name: 'Étudiants', icon: <StudentsIcon />, component: <StudentsComponent data={data} /> },
    { name: 'Matières', icon: <SubjectsIcon />, component: <SubjectsComponent data={data} /> },
    { name: 'Ajouter Les Notes', icon: <AddIcon />, component: <CreateNotes /> },,
    { name: 'À propos', icon: <AboutIcon />, component: <AboutComponent /> }
  ];

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    setDrawerOpen(false);
  };

  const activeComponent = menuItems.find(item => item.name === activeMenu)?.component;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}> 
      <AppBar position="fixed" sx={Styles.appBar}>
        <Toolbar>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            edge="start"
            sx={{ mr: 2, color: '#ebe7ef' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#ebe7ef' }}>
            Gestion Académique
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
      sx={Styles.drawer}
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 250, mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              selected={activeMenu === item.name}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ ...Styles.mainContent, flexGrow: 1 }}
      >
        <Header />
        <MainContent />
        <Box className="content-container" sx={{ flex: 1, mb: 4 }}>
          {activeComponent}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;