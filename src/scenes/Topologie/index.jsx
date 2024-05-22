import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Graph from 'react-graph-vis';
import 'vis-network/styles/vis-network.css';

const Inventory = () => {
  const navigate = useNavigate();
  const [scannedEquipments, setScannedEquipments] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const technicianId = 'TECHNICIAN_ID'; // Remplacez par l'ID du technicien authentifié

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

  useEffect(() => {
    const interval = setInterval(fetchScannedEquipments, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchScannedEquipments = async () => {
    try {
      const response = await axios.get('https://nodeapp-0ome.onrender.com/scannedEquipments');
      setScannedEquipments(response.data);
      updateGraph(response.data);
    } catch (error) {
      console.error('Error fetching scanned equipments:', error);
    }
  };

  const handleRFIDScan = async () => {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener('reading', async event => {
        const rfid = event.serialNumber;
        const scannedEquipment = equipmentList.find(equip => equip.RFID === rfid);
        if (scannedEquipment) {
          const newScannedEquipments = [...scannedEquipments, scannedEquipment];
          setScannedEquipments(newScannedEquipments);
          updateGraph(newScannedEquipments);

          // Send the scanned equipment data to the backend
          await axios.post('https://nodeapp-0ome.onrender.com/equip/inventory/scan', { rfid });
        } else {
          console.error('Équipement non trouvé');
        }
      });
    } catch (error) {
      console.error('Erreur lors de la lecture du tag RFID:', error);
    }
  };

  const handleFinishInventory = async () => {
    try {
      const scannedEquipmentIds = scannedEquipments.map(equip => equip._id);
      await axios.post('https://nodeapp-0ome.onrender.com/finish', {
        scannedEquipments: scannedEquipmentIds,
        technician: technicianId,
      });
      alert('Inventaire terminé avec succès');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la terminaison de l\'inventaire:', error);
      alert('Erreur lors de la terminaison de l\'inventaire');
    }
  };

  const updateGraph = (equipments) => {
    const nodes = equipments.map(equip => ({
      id: equip._id,
      label: equip.Nom,
      shape: 'image',
      image: selectIconBasedOnType(equip.Type),
      title: `Type: ${equip.Type}\nAdresse IP: ${equip.AdresseIp}\nRFID: ${equip.RFID}\nEtat: ${equip.Etat}`,
      color: getColorByState(equip.Etat)
    }));

    const edges = equipments.slice(1).map((equip, index) => ({
      from: equipments[index]._id,
      to: equip._id,
      arrows: 'to'
    }));

    setGraph({ nodes, edges });
  };

  const selectIconBasedOnType = (type) => {
    switch (type) {
      case 'router':
        return `${process.env.PUBLIC_URL}/icons/router.png`;
      case 'switch':
        return `${process.env.PUBLIC_URL}/icons/switch.png`;
      case 'computer':
        return `${process.env.PUBLIC_URL}/icons/computer.png`;
      default:
        return `${process.env.PUBLIC_URL}/icons/default.png`;
    }
  };

  const getColorByState = (state) => {
    switch (state) {
      case 'dysfonctionnel':
        return 'red';
      case 'Problème de réseau':
        return 'orange';
      case 'En bon état':
        return 'green';
      default:
        return 'blue';
    }
  };

  const options = {
    layout: {
      hierarchical: false
    },
    nodes: {
      shape: 'image',
      size: 30,
      borderWidth: 2,
      shapeProperties: {
        useImageSize: false,
        useBorderWithImage: true
      }
    },
    edges: {
      color: "#000000",
      arrows: {
        to: { enabled: true, scaleFactor: 1 }
      }
    },
    height: "500px"
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
          <Graph
            key={Date.now()}
            graph={graph}
            options={options}
            style={{ height: "500px" }}
          />
          <Button variant="contained" color="primary" onClick={handleFinishInventory} style={{ marginTop: '20px' }}>
            Terminer l'inventaire
          </Button>
        </Box>
      )}
      
    </Box>
  );
};

export default Inventory;
