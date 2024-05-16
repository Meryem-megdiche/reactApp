import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Graph from 'react-graph-vis';
import 'vis-network/styles/vis-network.css';

const Inventory = () => {
  const navigate = useNavigate();
  const [scannedEquipments, setScannedEquipments] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [alertMessage, setAlertMessage] = useState('');

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

  const handleResetScannedEquipments = () => {
    setScannedEquipments([]);
    setGraph({ nodes: [], edges: [] });
    setAlertMessage('Scanned equipment list reset.');
  };

  const handleRFIDScan = async () => {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener('reading', async event => {
        const rfid = event.serialNumber;
        const scannedEquipment = equipmentList.find(equip => equip.RFID === rfid);
        if (scannedEquipment) {
          let newScannedEquipments = [...scannedEquipments];

          if (scannedEquipments.length > 0) {
            const lastScannedEquipment = scannedEquipments[scannedEquipments.length - 1];
            lastScannedEquipment.ConnecteA.push(scannedEquipment._id);
            try {
              await axios.put(`https://nodeapp-0ome.onrender.com/equip/${lastScannedEquipment._id}`, lastScannedEquipment);
              setAlertMessage(`Connected ${lastScannedEquipment.Nom} to ${scannedEquipment.Nom}`);
            } catch (updateError) {
              console.error('Error updating equipment:', updateError);
              setAlertMessage('Error updating equipment connection.');
            }
          }

          newScannedEquipments = [...newScannedEquipments, scannedEquipment];
          setScannedEquipments(newScannedEquipments);
          updateGraph(newScannedEquipments);
          await axios.post('https://nodeapp-0ome.onrender.com/scannedEquipments', newScannedEquipments);
        } else {
          console.error('Équipement non trouvé');
          setAlertMessage('Équipement non trouvé');
        }
      });
    } catch (error) {
      console.error('Erreur lors de la lecture du tag RFID:', error);
      setAlertMessage('Erreur lors de la lecture du tag RFID');
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

    const edges = [];
    equipments.forEach(equip => {
      equip.ConnecteA.forEach(connectedId => {
        edges.push({
          from: equip._id,
          to: connectedId,
          arrows: 'to'
        });
      });
    });

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
      <Button variant="contained" color="secondary" onClick={handleResetScannedEquipments} ml="10px">
        Réinitialiser la liste des équipements scannés
      </Button>
      {alertMessage && (
        <Box mt="20px">
          <Alert severity="info">{alertMessage}</Alert>
        </Box>
      )}
      {scannedEquipments.length > 0 && (
        <Box mt="20px">
          <Typography variant="h5">Équipements scannés :</Typography>
          <Graph
            key={Date.now()}
            graph={graph}
            options={options}
            style={{ height: "500px" }}
          />
        </Box>
      )}
      <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')} mt="20px">
        Retour au Dashboard
      </Button>
    </Box>
  );
};

export default Inventory;
