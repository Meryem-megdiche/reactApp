import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { Autocomplete } from '@mui/material';
const Intervention = () => {
  const theme = useTheme();
  const [equipments, setEquipments] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [search, setSearch] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const scannedEquipmentName = location.state ? location.state.equipmentName : '';

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const { data } = await axios.get('https://nodeapp-0ome.onrender.com/equip');
        setEquipments(data);
      } catch (error) {
        console.error('Erreur lors du chargement des équipements:', error);
      }
    };
    fetchEquipments();
  }, []);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const { data } = await axios.get(`https://nodeapp-0ome.onrender.com/api/interventions/search?search=${search}`);
        setInterventions(data);
      } catch (error) {
        console.error('Erreur lors du chargement des interventions:', error);
      }
    };
    if (search.length > 2) {
      fetchInterventions();
    }
  }, [search]);

  // Find the equipment ID based on the scanned equipment name
  const scannedEquipment = equipments.find(equip => equip.Nom === scannedEquipmentName);
  const scannedEquipmentId = scannedEquipment ? scannedEquipment._id : '';

  const initialValues = {
    equipmentName: scannedEquipmentName,
    equipment: scannedEquipmentId,  // Ajout de l'ID de l'équipement ici
    type: "",
    date: "",
    description: "",
    parentIntervention: "",
    adresseMail:""
  };

  const validationSchema = yup.object().shape({
    equipmentName: yup.string().required("Le champ équipement est requis"),
    type: yup.string().required("Le champ type est requis"),
    date: yup.date().required("Le champ date est requis"),
    description: yup.string().required("Le champ description est requis"),
    parentIntervention: yup.string().nullable(),
    adresseMail:yup.string().email("Veuillez entrer une adresse e-mail valide").required()
  });

  const handleAddIntervention = async (values) => {
    const equipmentId = equipments.find(equip => equip.Nom === values.equipmentName)?._id;
    if (!equipmentId) {
      setErrorMessage("Équipement non trouvé.");
      return;
    }
    const dataToSubmit = { ...values, equipment: equipmentId };

    console.log("Soumission du formulaire avec les valeurs :", dataToSubmit); // Ajout du log pour les valeurs du formulaire

    try {
      const response = await axios.post('https://nodeapp-0ome.onrender.com/api/interventions', dataToSubmit);
      console.log("Réponse du serveur :", response.data);
      if (response.data.success) {
        setSuccessMessage("Intervention ajoutée avec succès");
        setErrorMessage(null);
        setTimeout(() => navigate('/liste'), 800);
      } else {
        setSuccessMessage(response.data.message || "Ajout réussi");
        setErrorMessage(null);
        setTimeout(() => navigate('/liste'), 1600);
      }
    
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'intervention :', error);
      setErrorMessage("Erreur côté client : " + error.message);
      setSuccessMessage(null);
    }
  };
  const navigateToinvList = () => {
    navigate('/liste');
  };

  return (
    <Box m="20px">
      <Header title="Ajouter une intervention" subtitle="Voir la liste des interventions" onSubtitleClick={navigateToinvList} />
      {successMessage && <Box bgcolor="success.main" color="success.contrastText" p={2} mb={2} borderRadius={4}>{successMessage}</Box>}
      {errorMessage && <Box bgcolor="error.main" color="error.contrastText" p={2} mb={2} borderRadius={4}>{errorMessage}</Box>}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleAddIntervention}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom de l'équipement"
                name="equipmentName"
                value={values.equipmentName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.equipmentName && Boolean(errors.equipmentName)}
                helperText={touched.equipmentName && errors.equipmentName}
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Type"
                name="type"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.type && Boolean(errors.type)}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Date"
                name="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="adresseMail"
                label="adresseMail"
                name="adresseMail"
                value={values.adresseMail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.adresseMail && Boolean(errors.adresseMail)}
                helperText={touched.adresseMail && errors.adresseMail}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
               <Autocomplete
  freeSolo
  disableClearable
  options={interventions}
  getOptionLabel={(option) => option.description || ''}
  onChange={(event, newValue) => {
    handleChange('parentIntervention')(newValue ? newValue._id : '');
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Rechercher l'intervention précedente par description"
      variant="outlined"
      fullWidth
      onChange={(event) => setSearch(event.target.value)}
      onBlur={handleBlur}
      error={touched.parentIntervention && Boolean(errors.parentIntervention)}
      helperText={touched.parentIntervention && errors.parentIntervention}
    />
  )}
/>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Ajouter
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Intervention;
