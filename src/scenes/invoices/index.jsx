import { Box, Button, TextField } from "@mui/material";
import { useParams } from 'react-router-dom';
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { MenuItem, Select } from "@mui/material";
const Invoices = () => {
  const navigate = useNavigate(); // Ajouter ceci
  const { equipmentId } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [initialFormValues, setInitialFormValues] = useState({
    Type: "",
    seuil: "",
    adresseMail: "",
    equipment: equipmentId || "",
  });

  const handleAddconfig = async (values) => {
    try {
      const response = await axios.post('https://nodeapp-0ome.onrender.com/config/configs', values);
      setSuccessMessage("Configuration ajoutée avec succès !");
      setErrorMessage(null);
        
      setTimeout(() => {
        navigate('/config'); // Remplacez ceci par le chemin réel de votre liste d'équipements
      }, 800);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la configuration :', error);
      setErrorMessage("Erreur lors de l'ajout de la configuration.");
      setSuccessMessage("");
    }
  };
  const handleAddOrUpdateConfig = async (values) => {
    const endpoint = equipmentId ? `https://nodeapp-0ome.onrender.com/config/configs/${equipmentId}` : 'https://nodeapp-0ome.onrender.com/config/configs';
    const method = equipmentId ? 'put' : 'post';

    try {
        const response = await axios({
            method: method,
            url: endpoint,
            data: values
        });
        setSuccessMessage('Configuration processed successfully!');
     
    } catch (error) {
        console.error('Error processing configuration:', error);
        setErrorMessage("Error processing configuration.");
        setSuccessMessage('');
    }
};

  const navigateToConfigList = () => {
    navigate('/config'); // Remplacez par le chemin correct
  };


  const validationSchema = yup.object().shape({
    Type: yup.string().required("Ce champ est obligatoire"),
    seuil: yup.string().required("Ce champ est obligatoire"),
    adresseMail: yup.string().email("Veuillez entrer une adresse e-mail valide").required("Ce champ est obligatoire"),
    equipment: yup.string().required("Ce champ est obligatoire"),
  });

  useEffect(() => {
    if (equipmentId) {
      axios.get(`https://nodeapp-0ome.onrender.com/config/configs/${equipmentId}`)
        .then(response => {
          const { Type, seuil, adresseMail, equipment } = response.data;
          setInitialFormValues({ Type, seuil, adresseMail, equipment });
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des détails:', error);

        });
    }
  }, [equipmentId]);














  return (
    <Box m="20px">
      <Header title="Configurer un équipement" subtitle="Voir la liste des configurations" 
      onSubtitleClick={navigateToConfigList}
      />
       

       <Formik
        initialValues={initialFormValues} // Assurez-vous que c'est bien initialFormValues ici
        enableReinitialize // Important pour recharger le formulaire avec les nouvelles valeurs
        onSubmit={handleAddconfig}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => {
          console.log("Form values:", values);
          return(
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
                
                <TextField
  select
  fullWidth
  variant="filled"
  label="Sélectionner le type de donnée"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.Type}
  name="Type"
  error={!!touched.Type && !!errors.Type}
  helperText={touched.Type && errors.Type}
  sx={{ gridColumn: "span 4" }}
>

  <MenuItem value="TTL">TTL</MenuItem>
  <MenuItem value="packetsReceived">packetsReceived</MenuItem>
  <MenuItem value="packetsLost">packetsLost</MenuItem>
  <MenuItem value="minimumTime">minimumTime</MenuItem>
  <MenuItem value="maximumTime">maximumTime</MenuItem>
  <MenuItem value="averageTime">averageTime</MenuItem>
</TextField>
             
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Entrer le seuil  "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.seuil}
                name="seuil"
                error={!!touched.seuil && !!errors.seuil}
                helperText={touched.seuil && errors.seuil}
                sx={{ gridColumn: "span 4" }}
              />
         
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Entrer l' adresse email du technicien "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.adresseMail}
                name="adresseMail"
                error={!!touched.adresseMail && !!errors.adresseMail}
                helperText={touched.adresseMail && errors.adresseMail}
                sx={{ gridColumn: "span 4" }}
              />
             
              
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Ajouter
              </Button>
            </Box>
            {successMessage && (
              <Box mt={2} color="green">
                {successMessage}
              </Box>
            )}
            {errorMessage && (
              <Box mt={2} color="red">
                {errorMessage}
              </Box>
            )}
          </form>
          )
        }}
      </Formik>
    </Box>
  );
};



/*const checkoutSchema = yup.object().shape({
  Type: yup.string().required("required"),
   seuil: yup.string().required("required"),
 
  adresseMail: yup
  .string()
  .email("Veuillez entrer une adresse e-mail valide")
  .required("required"),
  equipment: yup.string().required("required"),
});
const initialValues = {
  Type: "",
  seuil: "",

  adresseMail: "",
  equipment: equipmentId || "",
};*/

export default Invoices;