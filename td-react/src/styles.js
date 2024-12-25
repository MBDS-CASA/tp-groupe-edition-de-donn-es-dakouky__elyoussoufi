// styles.js
import { alpha } from '@mui/material/styles';

export const Styles = {

    
  appBar: {
    background: 'rgba(20, 5, 36, 0.8)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
    width: '100%',
    '& .MuiToolbar-root': {
      color: '#ebe7ef'
    }
  },
  drawer: {
    '& .MuiDrawer-paper': {
      background: 'linear-gradient(160deg, #280a48 0%, #20043d 100%)',
      color: '#ebe7ef',
      padding: '1rem',
      '& .MuiListItem-root': {
        borderRadius: '8px',
        margin: '0.5rem 0',
        transition: 'all 0.3s ease',
        color: '#a18aba',
        '&:hover': {
          background: alpha('#7925d3', 0.2),
          transform: 'translateX(4px)',
          color: '#ebe7ef'
        },
        '&.Mui-selected': {
          background: '#7925d3',
          color: '#ebe7ef',
          '&:hover': {
            background: '#8935e3',
          },
        },
      },
      '& .MuiListItemIcon-root': {
        color: 'inherit'
      },
    },
  },
  mainContent: {
    background: 'radial-gradient(#280a48, #20043d)',
    minHeight: '100vh',
    width: '100%',
    padding: '64px 0 0 0', // Add top padding to account for AppBar
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .content-container': {
      width: '90%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#140524',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      marginBottom: '80px' // Add margin bottom for footer
    }
  },
  header: {
    textAlign: 'center',
    margin: '3rem 0',
    width: '100%',
    '& .header-title': {
      margin: 0,
      fontFamily: '"Roboto Condensed", sans-serif',
      fontSize: '5rem',
      background: 'linear-gradient(40deg, #ea00ff, #ea00ff, #03d5ff, #03d5ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))'
    },
    '& .header-subtitle': {
      margin: 0,
      fontSize: '1.25rem',
      color: '#8964b0',
      fontFamily: '"Roboto Condensed", sans-serif'
    }
  },
  footer: {
    backgroundColor: '#140524',
    color: '#ebe7ef',
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.4)',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    padding: '1rem',
    textAlign: 'center',
    zIndex: 1000
  }

  
};

export default Styles;