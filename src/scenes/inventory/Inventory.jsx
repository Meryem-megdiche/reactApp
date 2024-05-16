import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const navigate = useNavigate();
  const [scannedEquipments, setScannedEquipments] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axios.get('https://nodeapp-0ome.onrender.com/equip');
        setEquipmentList(response.data);
      } catch (error) {
        console.error('Error fetching equipments:', error);
      }
    };
    fetchEquipments();
  }, []);

  const handleRFIDScan = async () => {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener('reading', async event => {
        const rfid = event.serialNumber;
        const scannedEquipment = equipmentList.find(equip => equip.RFID === rfid);
        if (scannedEquipment) {
          if (scannedEquipments.length > 0) {
            const lastScannedEquipment = scannedEquipments[scannedEquipments.length - 1];
            lastScannedEquipment.ConnecteA.push(scannedEquipment._id);
            await axios.put(`https://nodeapp-0ome.onrender.com/equip/${lastScannedEquipment._id}`, lastScannedEquipment);
          }
          setScannedEquipments([...scannedEquipments, scannedEquipment]);
        } else {
          console.error('Équipement non trouvé');
        }
      });
    } catch (error) {
      console.error('Erreur lors de la lecture du tag RFID:', error);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h3" mb="20px">Inventaire</Typography>
      <Button variant="contained" color="primary" onClick={handleRFIDScan}>
        Scanner RFID
      </Button>
      {scannedEquipments.length > 0 && (
        <Box mt="20px">
          <Typography variant="h5">Équipements scannés :</Typography>
          {scannedEquipments.map((equip, index) => (
            <Box key={equip._id} mt="10px">
              <Typography>Nom : {equip.Nom}</Typography>
              <Typography>Type : {equip.Type}</Typography>
              <Typography>Adresse IP : {equip.AdresseIp}</Typography>
              <Typography>RFID : {equip.RFID}</Typography>
              {index > 0 && (
                <Typography>Connecté à : {scannedEquipments[index - 1].Nom}</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
      <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')} mt="20px">
        Retour au Dashboard
      </Button>
    </Box>
  );
};

export default Inventory;
