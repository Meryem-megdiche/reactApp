import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import { tokens } from "../../theme";
import { useNavigate } from 'react-router-dom';
const Ping = () => {
  const navigate = useNavigate(); 
  const { equipmentId } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pingResults, setPingResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!equipmentId) {
          console.error('Equipment ID is undefined');
          return;
        }
        
        const response = await axios.get(`https://nodeapp-ectt.onrender.com/api/pingResults/equip/${equipmentId}`);
        if (response.status === 200) {
          const data = response.data;
          console.log('Ping Results:', data);
          setPingResults(data);
        } else {
          console.error('Error fetching data. HTTP Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [equipmentId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const columns = [
    {
      field: "status",
      headerName: "Statut",
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      width: 30,
      renderCell: (params) => (
        <div style={{ color: params.row.success ? "green" : "red" }}>
          {params.row.success ? "Success" : "Failed"}
        </div>
      ),
    },
    {
      field: "size",
      headerName: "Size",
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      cellClassName: "name-column--cell"
     
    },
    {
      field: "TTL",
      headerName: "TTL",
      type: "[number]",
      headerAlign: "left",
      align: "left",
    
      flex: 1.6,
      renderCell: (params) => (
        params.row.success ? params.value.join(", ") : "[]"
      )
    },
    {
      field: "latency",
      headerName: "latency",
      type: "[number]",
      headerAlign: "left",
      align: "left",
     
      flex: 1.5,
      renderCell: (params) => (
        params.row.success ? params.value.join(", ") : "[]"
      )
    },
    {
      field: "packetsSent",
      headerName: "Packets Sent",
      type: 'number',
      cellClassName: "name-column--cell",
      align: 'left',
      headerAlign: 'left',
      flex: 2,
    },
    {
      field: "packetsReceived",
      headerName: "Packets Received",
      type: 'number',
      cellClassName: "name-column--cell",
      align: 'left',
      headerAlign: 'left',
      flex: 2,
    },
    {
      field: "packetsLost",
      headerName: "Packets Lost",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      flex: 2, // Adjust the width as needed
    },
    {
      field: "minimumTime",
      headerName: "Minimum Time",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      flex: 2, // Adjust the width as needed
      renderCell: (params) => (
        params.value === 0 ? "-" : params.value
      )
    },
    {
      field: "maximumTime",
      headerName: "Maximum Time",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      flex: 2, // Adjust the width as needed
      renderCell: (params) => (
        params.value === 0 ? "-" : params.value
      )
    },
    {
      field: "averageTime",
      headerName: "Average Time",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      align: 'left',
      headerAlign: 'left',
      flex: 2, // Adjust the width as needed
      renderCell: (params) => (
        params.value === 0 ? "-" : params.value
      )
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      align: 'left',
      headerAlign: 'left',
      flex: 1,
   flex:2,
      renderCell: (params) => formatDate(params.value),
    },
  ];
  const navigateToConfigList = () => {
    navigate('/team'); // Remplacez par le chemin correct
  };
  return (
    <Box m="20px">
        <Header title="Historique de ping" subtitle="Voir la liste des équipements" 
      onSubtitleClick={navigateToConfigList}/>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={pingResults}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default Ping;
