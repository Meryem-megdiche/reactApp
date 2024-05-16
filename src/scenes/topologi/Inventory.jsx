import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Graph from 'react-graph-vis';
import 'vis-network/styles/vis-network.css';

const Inventory = () => {
  const navigate = useNavigate();
  const [scannedEquipments, setScannedEquipments] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [mode, setMode] = useState('node'); // Mode can be 'node' or 'edge'
  const [edgeStartNode, setEdgeStartNode] = useState(null);

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
          let newScannedEquipments = [...scannedEquipments];
          if (!newScannedEquipments.find(equip => equip._id === scannedEquipment._id)) {
            newScannedEquipments = [...newScannedEquipments, scannedEquipment];
            setScannedEquipments(newScannedEquipments);
            updateGraph(newScannedEquipments);
            await axios.post('https://nodeapp-0ome.onrender.com/scannedEquipments', newScannedEquipments);
          } else {
            setAlertMessage('Équipement déjà scanné');
          }
        } else {
          setAlertMessage('Équipement non trouvé');
        }
      });
    } catch (error) {
      console.error('Erreur lors de la lecture du tag RFID:', error);
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
    height: "500px",
    interaction: {
      selectable: true,
      selectConnectedEdges: false,
    },
    manipulation: {
      enabled: true,
      initiallyActive: true,
    },
  };

  const events = {
    selectNode: (event) => {
      const { nodes } = event;
      if (mode === 'node') {
        setSelectedEquipmentId(nodes[0]);
        setAlertMessage(`Équipement sélectionné: ${nodes[0]}`);
      } else if (mode === 'edge') {
        if (edgeStartNode) {
          createEdge(edgeStartNode, nodes[0]);
          setEdgeStartNode(null);
          setMode('node');
        } else {
          setEdgeStartNode(nodes[0]);
          setAlertMessage(`Sélectionnez l'équipement de destination pour créer une liaison.`);
        }
      }
    }
  };

  const createEdge = async (from, to) => {
    try {
      const sourceEquipment = scannedEquipments.find(equip => equip._id === from);
      if (sourceEquipment && !sourceEquipment.ConnecteA.includes(to)) {
        sourceEquipment.ConnecteA.push(to);
        await axios.put(`https://nodeapp-0ome.onrender.com/equip/equip/${sourceEquipment._id}`, sourceEquipment);
        setAlertMessage(`Connexion créée entre ${sourceEquipment.Nom} et l'équipement cible.`);
        fetchScannedEquipments();
      }
    } catch (error) {
      console.error('Error creating edge:', error);
    }
  };

  const fetchScannedEquipments = async () => {
    try {
      const response = await axios.get('https://nodeapp-0ome.onrender.com/scannedEquipments');
      setScannedEquipments(response.data);
      updateGraph(response.data);
    } catch (error) {
      console.error('Error fetching scanned equipments:', error);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h3" mb="20px">Inventaire</Typography>
      <Button variant="contained" color="primary" onClick={handleRFIDScan}>
        Scanner RFID
      </Button>
      <Button
        variant="contained"
        color={mode === 'node' ? 'secondary' : 'default'}
        onClick={() => setMode('node')}
        style={{ marginLeft: '10px' }}
      >
        Mode Ajout d'Équipement
      </Button>
      <Button
        variant="contained"
        color={mode === 'edge' ? 'secondary' : 'default'}
        onClick={() => setMode('edge')}
        style={{ marginLeft: '10px' }}
      >
        Mode Création de Liaison
      </Button>
      <Box mt="20px">
        <Typography variant="h5">Équipements scannés :</Typography>
        <Graph
          key={Date.now()}
          graph={graph}
          options={options}
          events={events}
          style={{ height: "500px" }}
        />
      </Box>
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage('')}
        message={alertMessage}
      />
      <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')} mt="20px">
        Retour au Dashboard
      </Button>
    </Box>
  );
};

export default Inventory;
