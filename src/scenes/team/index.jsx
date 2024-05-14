import React, { useState, useEffect } from "react";
import { Box, Button, useTheme, useMediaQuery, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../theme";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [equipData, setEquipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://nodeapp-0ome.onrender.com/equip");
        const transformedData = response.data.map(row => ({
          ...row,
          id: row._id,  
        }));
        setEquipData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleButtonClick = async (row) => {
    if (row.Etat.toLowerCase() === 'reparation' || row.Etat.toLowerCase() === 'dysfonctionnel') {
      alert(`L'équipement est en ${row.Etat}. La configuration n'est pas possible pour le moment.`);
      return;
    }
    try {
      const response = await axios.get(`https://nodeapp-0ome.onrender.com/api/config/isConfigured/${row.id}`);
      if (response.data.isConfigured) {
        alert("L'équipement est déjà configuré.");
      } else {
        navigate(`/invoices/${row.id}`);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la configuration:', error);
      alert('Impossible de vérifier si l’équipement est configuré.');
    }
  };

  const handleButton2Click = async (row) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this equipment?");
      if (!confirmDelete) {
        return;
      }
      await axios.delete(`https://nodeapp-0ome.onrender.com/equip/${row.id}`);
      setEquipData(equipData.filter((equip) => equip.id !== row.id));
    } catch (error) {
      console.error("Error deleting equipment:", error);
      try {
        const updatedData = await axios.get("https://nodeapp-0ome.onrender.com/equip");
        const transformedData = updatedData.data.map((row) => ({
          ...row,
          id: row._id,
        }));
        setEquipData(transformedData);
      } catch (fetchError) {
        console.error("Error fetching updated equipment data:", fetchError);
      }
    }
  };

  const handlePingButtonClick = async (row) => {
    const equipIp = row.AdresseIp;
    const equipId = row.id;

    try {
      const response = await axios.post(`http://localhost:3001/pingtest/manual`, { ip: equipIp, equipId });
      if (response.status === 200) {
        enqueueSnackbar(`Ping ${response.data.success ? 'successful' : 'failed'} for equipment with IP: ${equipIp}`, { variant: response.data.success ? 'success' : 'error' });
      } else {
        enqueueSnackbar(`Ping failed with status code: ${response.status}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar("Error occurred while pinging equipment.", { variant: 'error' });
      console.error("Error pinging equipment:", error);
    }
  };

  const renderActionCell = (params) => (
    <Box display="flex" justifyContent="center" alignItems="center" gap={isMobile ? 0.1 : 0.3}>
      <Tooltip title="Modifier">
        <Button
          startIcon={<EditIcon />}
          onClick={() => navigate(`/modify/${params.row.id}`)}
          color="secondary"
          variant="contained"
          size="small"
          sx={{ padding: isMobile ? '3px 3px' : '5px 5px', minWidth: '12px', fontSize: isMobile ? '0.5rem' : '0.6rem' }}
        >
          Modifier
        </Button>
      </Tooltip>

      <Tooltip title="Supprimer">
        <Button
          startIcon={<DeleteIcon />}
          onClick={() => handleButton2Click(params.row)}
          color="secondary"
          variant="contained"
          size="small"
          sx={{ padding: isMobile ? '3px 5px' : '5px 8px', minWidth: '15px', fontSize: isMobile ? '0.5rem' : '0.6rem' }}
        >
          Supprimer
        </Button>
      </Tooltip>

      <Tooltip title="Ping">
        <Button
          startIcon={<WifiTetheringIcon />}
          onClick={() => handlePingButtonClick(params.row)}
          color="secondary"
          variant="contained"
          size="small"
          sx={{ padding: isMobile ? '3px 5px' : '5px 8px', minWidth: '15px', fontSize: isMobile ? '0.5rem' : '0.6rem' }}
        >
          Ping
        </Button>
      </Tooltip>

      <Tooltip title="Historique des Pings">
        <Button
          startIcon={<HistoryIcon />}
          component={Link}
          to={`/ping/${params.row.id}`}
          color="secondary"
          variant="contained"
          size="small"
          sx={{ padding: isMobile ? '3px 5px' : '5px 8px', minWidth: '15px', fontSize: isMobile ? '0.5rem' : '0.6rem' }}
        >
          Ping History
        </Button>
      </Tooltip>

      <Tooltip title="Configurer">
        <Button
          startIcon={<SettingsIcon />}
          onClick={() => handleButtonClick(params.row)}
          color="secondary"
          variant="contained"
          size="small"
          sx={{ padding: isMobile ? '3px 5px' : '5px 8px', minWidth: '15px', fontSize: isMobile ? '0.5rem' : '0.6rem' }}
        >
          Configurer
        </Button>
      </Tooltip>
    </Box>
  );

  const columns = [
    {
      field: "Nom",
      headerName: "Nom",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Type",
      headerName: "Type",
      type: "String",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "AdresseIp",
      headerName: "Adresse IP",
      flex: 1.2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Emplacement",
      headerName: "Emplacement",
      type: "String",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "RFID",
      headerName: "RFID",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Etat",
      headerName: "Etat",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 4,
      headerAlign: "center",
      align: "center",
      renderCell: renderActionCell,
    },
  ];

  return (
    <Box m={isMobile ? 1 : 2}>
      <Header title="Liste d'équipement" />
      <Button 
        component={Link} 
        to="/contacts" 
        variant="contained" 
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: "bold",
          padding: isMobile ? "8px 16px" : "10px 20px",
        }}
      >
        Ajouter équipement
      </Button>

      <Box mt={isMobile ? 2 : 3} height={isMobile ? '60vh' : '75vh'}>
        <DataGrid
          rows={equipData}
          columns={columns}
          loading={loading}
          pageSize={isMobile ? 5 : 8}
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
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
        />
      </Box>
    </Box>
  );
};

export default Team;
