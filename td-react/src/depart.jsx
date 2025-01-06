import React from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import AppRoutes from './routes'; // Assurez-vous que ce fichier existe

function Depart() {
    return (
        <>
         <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
  
        </>  );
       
}

export default Depart;
