import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from "react";
const Modifier = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");


  const { id } = useParams();
  const [equipmentData, setEquipmentData] = useState(null);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get(`/equip/:id`);
        setEquipmentData(response.data);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipmentData();
    }
  }, [id]);
  // Initialiser les valeurs du formulaire uniquement si les données de l'équipement sont chargées
  const initialValues = loading ? {} : {
    Nom: equipmentData ? equipmentData.Nom : "",
    Type: equipmentData ? equipmentData.Type : "",
    AdresseIp: equipmentData ? equipmentData.AdresseIp : "",
    Emplacement: equipmentData ? equipmentData.Emplacement : "",

  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // Envoyer les données modifiées au backend
  };
  return (
    <Box m="20px">
      <Header title=" Modifier un èquipement " subtitle="Voir la liste des équipements" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
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
                fullWidth
                variant="filled"
                type="text"
                label="Nom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Nom}
                name="Nom"
                error={!!touched.Nom && !!errors.Nom}
                helperText={touched.Nom && errors.Nom}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Type}
                name="Type"
                error={!!touched.Type && !!errors.Type}
                helperText={touched.Type && errors.Type}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="AdresseIp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AdresseIP}
                name="AdresseIp"
                error={!!touched.AdresseIP && !!errors.AdresseIp}
                helperText={touched.AdresseIp && errors.AdresseIp}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Emplacement"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Emplacement}
                name="Emplacement"
                error={!!touched.Emplacement && !!errors.Emplacement}
                helperText={touched.Emplacement && errors.Emplacement}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Etat"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
          
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
               Modifier
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};



const validationSchema = yup.object().shape({
    Nom: yup.string().required("Le nom de l'équipement est requis"),
    Type: yup.string().required("Le type de l'équipement est requis"),
    AdresseIp: yup.string().required("L'adresse IP de l'équipement est requise"),
    Emplacement: yup.string().required("L'emplacement de l'équipement est requis"),
    // Ajoutez d'autres validations pour les champs supplémentaires ici
  });
const initialValues = {
  Nom: "",
  Type: "",
  AdresseIp: "",
  Emplacement: "",


};

export default Modifier ;