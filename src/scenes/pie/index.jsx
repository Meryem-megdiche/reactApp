import React from 'react';
import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importer l'icône de retour

const Pie = () => {
  const navigate = useNavigate();
  
  const navigateToConfigList = () => {
    navigate('/alert'); // Remplacez par le chemin correct
  };
  
  return (
    <Box m="20px">
      <Header
        title="Pie Chart"
        subtitle="Retour"
        onSubtitleClick={navigateToConfigList}
        // Ajouter un bouton d'icône de retour à la page précédente
        startComponent={(
          <IconButton onClick={() => window.history.back()} edge="start" color="inherit" aria-label="retour">
            <ArrowBackIcon />
          </IconButton>
        )}
      />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
