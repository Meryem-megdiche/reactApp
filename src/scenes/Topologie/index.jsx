import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import Graph from 'react-graph-vis';
import 'vis-network/styles/vis-network.css';

const Topologie = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const fetchTopologie = async () => {
      try {
        const response = await axios.get('https://nodeapp-2h1p.onrender.com/api/topologie');
        const visData = transformDataToVisNetwork(response.data);
        setGraph(visData);
      } catch (error) {
        console.error('Erreur lors du chargement de la topologie réseau:', error);
      }
    };
    
    fetchTopologie();
  }, []);

  const transformDataToVisNetwork = (data) => {
    const nodes = [];
    const edges = [];
  
    data.forEach((equip) => {
        nodes.push({
            id: equip.id,
            label: `${equip.nom} (${equip.ip})`,
            title: `Type: ${equip.Type}  \nEmplacement: ${equip.emplacement} \n Etat: ${equip.etat}`,
          });
          

      // ConnecteA est un tableau des équipements auxquels cet équipement est connecté.
      equip.connecteA.forEach((connectedEquip) => {
        edges.push({
          from: equip.id,
          to: connectedEquip.id,
          label: equip.port, // Vous pouvez choisir de montrer ou non le port sur l'arête
        });
      });
    });
    return { nodes, edges };
};
  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "500px"
  };

  const events = {
    hoverNode: function(event) {
      var { nodes, edges } = event;
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" mb={3}>
        Topologie Réseau
      </Typography>
      <Graph
  key={Date.now()} // force re-render
  graph={graph}
  options={options}
  events={events}
  style={{ height: "calc(100vh - 100px)" }}
/>
    </Box>
  );
};

export default Topologie;