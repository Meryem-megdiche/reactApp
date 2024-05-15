import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Snackbar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';



  const RfidScanner = ({ setFieldValue }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [nfcSupported, setNfcSupported] = useState(false);
  
    useEffect(() => {
      if ("NDEFReader" in window) {
        setNfcSupported(true);
        console.log("NFC supporté");
      } else {
        setNfcSupported(false);
        enqueueSnackbar("NFC n'est pas supporté sur cet appareil ou navigateur.", { variant: 'warning' });
        console.log("NFC non supporté");
      }
    }, [enqueueSnackbar]);
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const readNfcTag = async () => {
      if (nfcSupported) {
        try {
          const reader = new NDEFReader();
          await reader.scan();
          console.log("En attente de la lecture du tag NFC...");
          reader.onreading = event => {
            console.log("Tag NFC détecté !");
            const decoder = new TextDecoder();
            console.log("Décoder initialisé");
  
            event.message.records.forEach(record => {
              console.log("Type de données du record:", typeof record.data);
              console.log("Données du record:", record.data);
              console.log("Données du record1:", record);
  
              let scannedData = '';
              if (record.data instanceof ArrayBuffer) {
                console.log("Type de données: ArrayBuffer");
                scannedData = decoder.decode(record.data);
              } else if (record.data instanceof DataView) {
                console.log("Type de données: DataView");
                const buffer = new Uint8Array(record.data.buffer);
                scannedData = Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
              } else if (record.data && record.data.buffer instanceof ArrayBuffer) {
                console.log("Type de données: ArrayBufferView");
                scannedData = decoder.decode(record.data.buffer);
              } else {
                console.error("Type de données non pris en charge ou null:", record.data);
                enqueueSnackbar("Le tag NFC ne contient pas de données valides.", { variant: 'warning' });
                return;
              }
  
              if (scannedData) {
                console.log("Données scannées:", scannedData);
                // Supposons que le Serial No soit contenu dans scannedData en hexadécimal
                setFieldValue('RFID', scannedData);
                setMessage(`RFID scanné avec succès: ${scannedData}`);
                setOpen(true);
                enqueueSnackbar(`RFID scanné avec succès: ${scannedData}`, { variant: 'success' });
                if (navigator.vibrate) {
                  navigator.vibrate(200); // Vibration de 200 ms
                }
              } else {
                console.error("Aucune donnée scannée.");
                enqueueSnackbar("Aucune donnée scannée.", { variant: 'warning' });
              }
            });
          };
        } catch (error) {
          console.error(`Erreur de lecture du tag NFC: ${error.message}`);
          setMessage(`Erreur de lecture du tag NFC: ${error.message}`);
          setOpen(true);
          enqueueSnackbar(`Erreur de lecture du tag NFC: ${error.message}`, { variant: 'error' });
        }
      }
    };
  
    return (
      <>
        <Button onClick={readNfcTag} variant="contained" color="primary">
          Scanner RFID
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={message} />
      </>
    );
  };
  



const Contacts = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleAddEquipment = async (values) => {
    try {
      const connecteAIds = values.ConnecteA.split(',').map(id => id.trim());
      const newEquipment = {
        Nom: values.Nom,
        Type: values.Type,
        RFID: values.RFID,
        AdresseIp: values.AdresseIp,
        Emplacement: values.Emplacement,
        Etat: values.Etat,
        ConnecteA: connecteAIds,
        Pays: values.Pays,
      };

      const response = await axios.post('https://nodeapp-0ome.onrender.com/equip/add', newEquipment);

      if (response.data.success) {
        navigate('/team'); 
      } else {
        console.error(response.data.message || "Erreur inattendue lors de l'ajout de l'équipement");
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipement :', error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Ajouter un équipement" subtitle="Voir la liste des équipements" />
      <Formik
        onSubmit={handleAddEquipment}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} method="POST">
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
                label="Adresse IP"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.AdresseIp}
                name="AdresseIp"
                error={!!touched.AdresseIp && !!errors.AdresseIp}
                helperText={touched.AdresseIp && errors.AdresseIp}
                sx={{ gridColumn: "span 4" }}
              />
              <RfidScanner setFieldValue={setFieldValue} />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="RFID"
                value={values.RFID}
                name="RFID"
                error={!!errors.RFID}
                helperText={errors.RFID}
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
                label="État"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Etat}
                name="Etat"
                error={!!touched.Etat && !!errors.Etat}
                helperText={touched.Etat && errors.Etat}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ConnecteA"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ConnecteA}
                name="ConnecteA"
                error={!!touched.ConnecteA && !!errors.ConnecteA}
                helperText={touched.ConnecteA && errors.ConnecteA}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Pays"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pays}
                name="Pays"
                error={!!touched.Pays && !!errors.Pays}
                helperText={touched.Pays && errors.Pays}
                sx={{ gridColumn: "span 4" }}
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

const checkoutSchema = yup.object().shape({
  Nom: yup.string().required("required"),
  Type: yup.string().required("required"),
  AdresseIp: yup.string().required("required"),
  RFID: yup.string().required("required"),
  Emplacement: yup.string().required("required"),
  Etat: yup.string().required("required"),
  ConnecteA: yup.string().required("L'ID de l'équipement connecté est requis"),
  Pays: yup.string().required("required")
});

const initialValues = {
  Nom: "",
  Type: "",
  AdresseIp: "",
  RFID: "",
  Emplacement: "",
  Etat: "",
  ConnecteA: "",
  Pays: "",
};

export default Contacts;
