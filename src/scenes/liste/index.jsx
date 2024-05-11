import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {  Button } from "@mui/material";

const Listes = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [interventions, setInterventions] = useState([]);
  const [equipmentDetails, setEquipmentDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://nodeapp-0ome.onrender.com/api/interventions");
        console.log(response.data);
        setInterventions(response.data);
  
        const equippedInterventions = await Promise.all(response.data.map(async (intervention) => {
          try {
            const equipResponse = await axios.get(`https://nodeapp-0ome.onrender.com/api/interventions/equip/${intervention.equipment} `);
            // Assurez-vous que la structure de réponse est correcte et contient le champ "Nom"
            if (equipResponse.data && equipResponse.data.Nom) {
              // Mettre à jour l'intervention avec le nom de l'équipement
              intervention.equipmentName = equipResponse.data.Nom;
            } else {
              // En cas de réponse incorrecte, définissez le nom de l'équipement sur "Unavailable"
              intervention.equipmentName = 'Unavailable';
            }
            return intervention;
          } catch (error) {
            console.error('Failed to fetch equipment details:', error);
            // En cas d'erreur, définissez le nom de l'équipement sur "Unavailable"
            intervention.equipmentName = 'Unavailable';
            return intervention;
          }
        }));
      setInterventions(equippedInterventions);
    } catch (error) {
      console.error("Error fetching interventions:", error);
    }
  };

  fetchData();
}, []);
  
  const columns = [
    { field: "equipmentName", headerName: "Equipment", flex: 1 },  
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "statut",
      headerName: "statut",
      flex: 1,
    },

    {
      field: 'description',
      headerName: "Description",
      flex: 1,
    },
    {
      field: "parentIntervention",
      headerName: 'parentIntervention',
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="liste des interventions" 
      />
      <Link to="/intervention">
      <Button 
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "14px",
          fontWeight: "bold",
          padding: "10px 20px",
        }}  variant="contained">
          Ajouter intervention
        </Button>
      </Link>

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
        <div style={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={interventions}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
          </div>
      </Box>
    </Box>
  
  );
};

export default Listes;