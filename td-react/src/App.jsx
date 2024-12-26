import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
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

import './index.css';
import { Styles } from './styles';

function Header() {
  return (
    <Box component="header" sx={{
      width: '100%',
      textAlign: 'center',
      padding: { xs: '1rem', sm: '2rem' },
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    }}>
      <img 
        src="src/assets/logo.png" 
        alt="Logo de la formation" 
        style={{ 
          height: 'auto', 
          width: { xs: '8rem', sm: '10rem' },
          maxWidth: '100%',
          objectFit: 'cover' 
        }} 
      />
      <Box>
        <Typography 
          variant="h1" 
          className="header-title"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Introduction à React
        </Typography>
        <Typography 
          variant="subtitle1" 
          className="header-subtitle"
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem' }
          }}
        >
          A la découverte des premières notions de React
        </Typography>
      </Box>
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
    <Box component="section" sx={{ 
      width: '100%',
      padding: { xs: '1rem', sm: '2rem' },
      textAlign: 'center'
    }}>
      <Typography sx={{ 
        color: '#ebe7ef',
        fontSize: { xs: '0.9rem', sm: '1rem' }
      }}>
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
  const [activeMenu, setActiveMenu] = useState('Tableau de Bord');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Tableau de Bord', icon: <Dashboard />, path: '/dashboard' },
    { name: 'Notes', icon: <NotesIcon />, path: '/notes' },
    { name: 'Étudiants', icon: <StudentsIcon />, path: '/students' },
    { name: 'Matières', icon: <SubjectsIcon />, path: '/subjects' },
    { name: 'À propos', icon: <AboutIcon />, path: '/about' }
  ];

  const handleMenuClick = (menuName, path) => {
    setActiveMenu(menuName);
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}> 
      <AppBar position="fixed" sx={{ ...Styles.appBar, width: '100%' }}>
        <Toolbar>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            edge="start"
            sx={{ mr: 2, color: '#ebe7ef' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              color: '#ebe7ef',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Gestion Académique
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          ...Styles.drawer,
          '& .MuiDrawer-paper': {
            width: { xs: '240px', sm: '250px' }
          }
        }}
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: '100%', mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.name}
              onClick={() => handleMenuClick(item.name, item.path)}
              selected={activeMenu === item.name}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.name} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontSize: { xs: '0.9rem', sm: '1rem' } 
                  } 
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          padding: { xs: '0.5rem', sm: '1rem' },
          marginTop: '64px',
          marginBottom: '60px',
          overflowX: 'hidden'
        }}
      >
        <Header />
        <MainContent />
        <Box 
          className="content-container" 
          sx={{ 
            width: '100%',
            padding: { xs: '0.5rem', sm: '1rem' },
            marginBottom: '1rem'
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;