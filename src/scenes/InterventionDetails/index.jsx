import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, Button, CardContent } from '@mui/material';
import Header from '../../components/Header';

const InterventionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState(null);

  useEffect(() => {
    const fetchInterventionDetails = async () => {
      try {
        const response = await axios.get(`https://nodeapp-2h1p.onrender.com/api/interventions/${id}`);
        setIntervention(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'intervention :", error);
      }
    };
    
    fetchInterventionDetails();
  }, [id]);

  const navigateToinvList = () => {
    navigate('/liste'); // Replace with the correct path
  };

  return (
    <Box m={3}>
       <Header subtitle="Voir la liste des interventions" onSubtitleClick={navigateToinvList} />
      {intervention ? (
        <Card elevation={3} sx={{ borderRadius: '12px' }}>
          <CardContent>
            <Typography variant="h4" mb={3} color="text.secondary">
              Détails de l'intervention
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" mb={1} color="text.secondary">
                  ID:
                </Typography>
                <Typography variant="body1" fontWeight="bold" mb={2}>
                  {intervention._id}
                </Typography>

                <Typography variant="subtitle1" mb={1} color="text.secondary">
                  Équipement:
                </Typography>
                <Typography variant="body1" fontWeight="bold" mb={2}>
                  {intervention.equipment?.Nom || 'Chargement...'}
                </Typography>

                <Typography variant="subtitle1" mb={1} color="text.secondary">
                  Type:
                </Typography>
                <Typography variant="body1" fontWeight="bold" mb={2} color="info.main">
                  {intervention.type}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" mb={1} color="text.secondary">
                  Date:
                </Typography>
                <Typography variant="body1" fontWeight="bold" mb={2}>
                  {new Date(intervention.date).toLocaleString()}
                </Typography>

                <Typography variant="subtitle1" mb={1} color="text.secondary">
                  Description:
                </Typography>
                <Typography variant="body1" fontWeight="bold" mb={2}>
                  {intervention.description}
                </Typography>

                <Typography variant="subtitle1" mb={1} color="text.secondary">
                  Parent Intervention:
                </Typography>
                <Typography variant="body1" fontWeight="bold" mb={2}>
                  {intervention.parentIntervention || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography color="text.secondary">Chargement des détails de l'intervention...</Typography>
      )}
    </Box>
  );
};

export default InterventionDetails;
