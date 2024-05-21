import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
const Config = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [configs, setConfigs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://nodeapp-0ome.onrender.com/config");
        console.log(response.data);
        setConfigs(response.data);
  
        const equipconfigs = await Promise.all(response.data.map(async (config) => {
          try {
            const equipResponse = await axios.get(`https://nodeapp-0ome.onrender.com/config/equip/${config.equipment} `);
           
            if (equipResponse.data && equipResponse.data.Nom) {
              
              config.equipmentName = equipResponse.data.Nom;
            } else { // En cas de réponse incorrecte, définissez le nom de l'équipement sur "Unavailable"
              config.equipmentName = 'Unavailable';
            }
            return config;
          } catch (error) {
            console.error('Failed to fetch equipment details:', error);
            // En cas d'erreur, définissez le nom de l'équipement sur "Unavailable"
            config.equipmentName = 'Unavailable';
            return config;
          }
        }));
        setConfigs(equipconfigs);
    } catch (error) {
      console.error("Error fetching configs:", error);
    }
  };

  fetchData();
}, []);

  const handleEditClick = (id) => {
    const configToEdit = configs.find((config) => config.id === id);
    // Naviguer vers la page de modification avec les valeurs de la configuration à modifier
    navigate(`/Modify-config${id}`, { state: { config: configToEdit } });
  };



  const deleteConfig = async (id) => {
    try {
      await axios.delete(`https://nodeapp-0ome.onrender.com/config/configs/${id}`);
      setConfigs(configs.filter((config) => config.id !== id));
      console.log("Configuration deleted successfully");
    } catch (error) {
      console.error("Error deleting configuration:", error);
    }
  };
  
  
  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this configuration?");
    if (confirmDelete) {
      deleteConfig(id);
    }
  };
  
  const handleWatchClick = (id) => {
    console.log("Surveiller l'élément avec l'ID :", id);
  };

  const columns = [
   
    {
      field: "equipmentName",
      headerName: "equipment",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Type",
      headerName: "donnée",
      flex: 0.5,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "seuil",
      headerName: "seuil",
      flex: 0.5,
    },
   
    {
      field: "adresseMail",
      headerName: "addresseMail",
      flex: 1,
    },
    {
      field: "activité",
      headerName: "activité",
      sortable: false,
      flex: 1.1,
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <Link to={`/modify-config/${params.row.id}`} state={{ initialValues: params.row }}>
  <Button
   startIcon={<EditIcon />}
  
  variant="contained" color="secondary">Modifier</Button>
</Link>
            <Button 
            startIcon={<DeleteIcon />}
            
            variant="contained" onClick={() => handleDeleteClick(params.row.id)} color="error">Supprimer</Button>
            <Button 
            startIcon={<VisibilityIcon /> }variant="contained" onClick={() => handleWatchClick(params.row.id)} color="secondary"  
              component={Link}
              to={`/alert/${params.row.equipment}`}>
              Surveiller
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Liste des configurations"
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={configs}
      
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Config;