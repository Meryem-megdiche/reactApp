import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import { DialogContentText, DialogActions } from "@mui/material";
import { useParams } from 'react-router-dom';
import { Stack, Toolbar, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from "../../components/Header";
const Alert = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [threshold, setThreshold] = useState('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataDialogOpen, setDataDialogOpen] = useState(false);
  const [pingResultAttributes, setPingResultAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const { equipmentId } = useParams();
  const [config, setConfig] = useState(null);
  const [pingResults, setPingResults] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleShowAlerts = async () => {
    if (!startDate || !endDate || !equipmentId || !threshold) {
      alert("Please select both dates and enter a threshold.");
      return;
    }
    try {
      const response = await axios.get(`https://nodeapp-ectt.onrender.com/api/pingResults/alert/${equipmentId}`, {
        params: { startDate, endDate }
      });

      let isThresholdExceeded = false;
      const seuil = parseFloat(threshold);

      const transformedData = response.data.map((row) => {
        const attributesToCheck = ['TTL', 'latency', 'minimumTime', 'maximumTime', 'averageTime'];
        let alerts = {};

        for (let attr of attributesToCheck) {
          const value = Array.isArray(row[attr]) ? getAverage(row[attr]) : row[attr];
          const color = getCellColor(value, attr);
          alerts[`showAlert${attr}`] = color === 'red';
          if (color === 'red') {
            isThresholdExceeded = true;
          }
        }
        return {
          ...row,
          id: row._id,
          ...alerts
        };
      });

      setShowAlertModal(isThresholdExceeded);
      setPingResults(transformedData);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

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

  const getAverage = (numbers) => {
    const validNumbers = numbers.filter(value => !isNaN(value));
    if (validNumbers.length === 0) return NaN;
    return validNumbers.reduce((acc, cur) => acc + cur, 0) / validNumbers.length;
  };
  
  const getCellColor = (value, attribute) => {
    if (!selectedAttributes.includes(attribute)) return 'default';
  
    const seuil = parseFloat(threshold);
    const warningThreshold = seuil * 0.9;
  
    if (value > seuil) {
      return 'red';
    } else if (value > warningThreshold) {
      return 'orange';
    } else {
      return 'green';
    }
  };
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`https://nodeapp-ectt.onrender.com/api/config/equip/${equipmentId}`);
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, [equipmentId]);
  
  const handleViewChartClick = async () => {
    if (equipmentId && startDate && endDate && threshold && selectedAttributes.length > 0) {
      const statsResponse = await fetchStatsFromServer(threshold, selectedAttributes, selectedAttributes[0]);
      if (statsResponse) {
        navigate(`/pie/${equipmentId}`, {
          state: {
            stats: statsResponse,
            seuil: parseFloat(threshold),
          },
        });
      } else {
        alert("Unable to retrieve statistics.");
      }
    } else {
      alert("Please select the start and end dates, enter a threshold, and select at least one data attribute.");
    }
  };
  
  const fetchStatsFromServer = async (threshold, selectedAttributes, attr) => {
    try {
      const response = await axios.get(`https://nodeapp-ectt.onrender.com/api/pingResults/stats/${equipmentId}`, {
        params: { startDate, endDate, threshold, attr },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Échec de la récupération des statistiques');
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques:`, error);
      alert('Erreur lors de la récupération des statistiques');
    }
  };

  useEffect(() => {
    console.log(location.state);
  }, []);

  const columns = [
    {
      field: "status",
      headerName: "Statut",
      flex: 2,
      renderCell: (params) => (
        <div style={{ color: params.row.success ? "green" : "red" }}>
          {params.row.success ? "Success" : "Failed"}
        </div> ),
    },
    {
      field: "size",
      headerName: "Size",
      flex: 1.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "TTL",
      headerName: "TTL",
      type: "[number]",
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        const averageTTL = getAverage(params.row.TTL.filter(value => !isNaN(value)));
        return (
          <div style={{ backgroundColor: getCellColor(averageTTL, 'TTL') }}>
            {isNaN(averageTTL) ? "NaN" : averageTTL.toFixed(2)}
          </div>
        );
      },
      cellClassName: "name-column--cell",
      flex: 2,
    },
    {
      field: "latency",
      headerName: "latency",
      type: "[number]",
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        const averageLatency = getAverage(params.row.latency);
        return (
          <div style={{ backgroundColor: getCellColor(averageLatency, 'latency') }}>
            {averageLatency.toFixed(2)} 
          </div>
        );
      },
      cellClassName: "name-column--cell",
      flex: 2,
    },
    {
      field: "packetsSent",
      headerName: "Packets Sent",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      flex: 1.7,
      cellClassName: "name-column--cell",
    },
    {
      field: "packetsReceived",
      headerName: "Packets Received",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <div style={{ backgroundColor: getCellColor(params.value, 'packetsReceived') }}>
          {params.value}
        </div>
      ),
      flex: 1.7,
      cellClassName: "name-column--cell",
    },
    {
      field: "packetsLost",
      headerName: "Packets Lost",
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <div style={{ backgroundColor: getCellColor(params.value, 'packetsLost') }}>
          {params.value}
        </div>
      ),
      flex: 1.7,
    },
    {
      field: "minimumTime",
      headerName: "Minimum Time",
      type: 'number',
      align: 'left',
      renderCell: (params) => (
        <div style={{ backgroundColor: getCellColor(params.value, 'minimumTime') }}>
          {params.value === 0 ? "-" : params.value}
        </div>
      ),
      headerAlign: 'left',
      flex: 1.7, 
    },
    {
      field: "maximumTime",
      headerName: "Maximum Time",
      type: 'number',
      renderCell: (params) => (
        <div style={{ backgroundColor: getCellColor(params.value, 'maximumTime') }}>
          {params.value === 0 ? "-" : params.value}
        </div>
      ),
      align: 'left',
      headerAlign: 'left',
      flex: 1.7, 
    },
    {
      field: "averageTime",
      headerName: "Average Time",
      type: 'number',
      renderCell: (params) => (
        <div style={{ backgroundColor: getCellColor(params.value, 'averageTime') }}>
          {params.value === 0 ? "-" : params.value}
        </div>
      ),
      align: 'left',
      headerAlign: 'left',
      flex: 1.7,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => formatDate(params.value),
      flex: 2.2,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://nodeapp-ectt.onrender.com/api/pingResults');
      if (response.ok) {
        const data = await response.json();
        const attributes = Object.keys(data[0]);
        setPingResultAttributes(attributes);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataButtonClick = () => {
    setDataDialogOpen(true);
  };

  const handleCloseDataDialog = () => {
    setDataDialogOpen(false);
  };

  const handleCheckboxChange = (attribute) => (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedAttributes([...selectedAttributes, attribute]);
    } else {
      setSelectedAttributes(selectedAttributes.filter((item) => item !== attribute));
    }
  };
  const navigateToConfigList = () => {
    navigate('/config'); // Remplacez par le chemin correct
  };
  return (
    <Box m="20px">
       <Header  subtitle="Retour à la liste des configurations"
     onSubtitleClick={navigateToConfigList} />


      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            id="start-date"
            label="Start Date"
            type="date"
            color="secondary"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              marginRight: "10px",
              "& .MuiInputBase-root": {
                color: colors.grey[100],
                borderRadius: "4px",
              },
              "& .MuiInputLabel-root": {
                color: colors.grey[100],
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.grey[100],
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: '#B2B2B2',
              },
              "& .MuiSvgIcon-root": {
                color: colors.grey[100],
              }
            }}
          />
          <TextField
            id="end-date"
            label="End Date"
            type="date"
            color="secondary"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              marginRight: "10px",
              "& .MuiInputBase-root": {
                color: colors.grey[100],
                borderRadius: "4px",
              },
              "& .MuiInputLabel-root": {
                color: colors.grey[100],
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.grey[100],
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: '#B2B2B2',
              },
              "& .MuiSvgIcon-root": {
                color: colors.grey[100],
              }
            }}
          />
          <TextField
            label="Threshold"
            type="number"
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
            color="secondary"
            InputLabelProps={{ shrink: true }}
            sx={{
              marginRight: "10px",
              "& .MuiInputBase-root": {
                color: colors.grey[100],
                borderRadius: "4px",
              },
              "& .MuiInputLabel-root": {
                color: colors.grey[100],
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.grey[100],
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: '#B2B2B2',
              },
              "& .MuiSvgIcon-root": {
                color: colors.grey[100],
              }
            }}
          />
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
            }}
            variant="contained"
            onClick={handleDataButtonClick}
            color="secondary"
          >
            Data
          </Button>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              padding: "10px 20px",
            }}
            variant="contained"
            onClick={handleShowAlerts}
            color="secondary"
          >
            Show Alerts
          </Button>
          <Dialog open={dataDialogOpen} onClose={handleCloseDataDialog}>
            <DialogTitle>Attributs des données</DialogTitle>
            <DialogContent>
              {pingResultAttributes
                .filter((attribute) => ['TTL', 'latency', 'packetsReceived', 'packetsLost', 'minimumTime', 'averageTime', 'maximumTime'].includes(attribute))
                .map((attribute, index) => (
                  <Box key={index} marginBottom={2}> 
                    <FormControlLabel
                      control={<Checkbox checked={selectedAttributes.includes(attribute)} onChange={handleCheckboxChange(attribute)} />}
                      label={attribute}
                    />
                  </Box>
                ))}
            </DialogContent>
          </Dialog>
          <Dialog open={showAlertModal} onClose={() => setShowAlertModal(false)}>
            <DialogTitle>{"Alerte"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Certaines valeurs dépassent le seuil configuré!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAlertModal(false)} color="primary" autoFocus>
                Compris
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              padding: "10px 20px",
            }}
            onClick={() => handleViewChartClick(config.equipment)}
          >
            View Chart 
          </Button>
        </Stack>
      </Toolbar>
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
            rows={pingResults}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={5}
          />
        </div>
      </Box>
    </Box>
  );
};

export default Alert;
