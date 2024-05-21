import React, { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "https://nodeapp-0ome.onrender.com"; // Remplacez par l'URL correcte

const RealTimeEquip = () => {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('updateEquip', (equip) => {
      setEquipments((prevEquipments) => [...prevEquipments, equip]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleScanRFID = () => {
    // Ici, vous pourriez appeler une fonction pour scanner le tag RFID.
    // Une fois que le tag est scanné avec succès, envoyez-le au backend.
    const scannedRFID = "RFID12345"; // Remplacez ceci par le vrai tag RFID scanné.
    const socket = socketIOClient(ENDPOINT);
    socket.emit('scanEquip', scannedRFID);
  };

  return (
    <div>
      <h1>Équipements en temps réel</h1>
      <button onClick={handleScanRFID}>Scanner RFID</button>
      <ul>
        {equipments.map(equip => (
          <li key={equip._id}>
            {equip.Nom} - {equip.AdresseIp} - Connecté à: {equip.ConnecteA.map(conn => conn.Nom).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeEquip;
