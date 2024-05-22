import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const ScannedCount = () => {
  const [date, setDate] = useState('');
  const [count, setCount] = useState(null);
  const [error, setError] = useState('');

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleGetCount = async () => {
    try {
      const response = await axios.get(`/equip/scannedCount/${date}`);
      setCount(response.data.count);
      setError('');
    } catch (error) {
      console.error('Error fetching scanned count:', error);
      setError('Erreur lors de la récupération du compte des équipements scannés.');
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h3" mb="20px">Nombre d'interventions scannées</Typography>
      <TextField
        type="date"
        value={date}
        onChange={handleDateChange}
        label="Date"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" color="primary" onClick={handleGetCount} style={{ marginLeft: '10px' }}>
        Obtenir le nombre
      </Button>
      {count !== null && (
        <Typography variant="h5" mt="20px">Nombre d'équipements scannés : {count}</Typography>
      )}
      {error && (
        <Typography variant="h6" color="error" mt="20px">{error}</Typography>
      )}
    </Box>
  );
};

export default ScannedCount;
