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

  const handleScan = (rfid) => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit('scanEquip', rfid);
  };

  const handleConnectEquipments = async (equipId, connecteAId) => {
    try {
      const response = await fetch(`${ENDPOINT}/equip/updateConnection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equipId, connecteAId }),
      });
      const result = await response.json();
      if (result.success) {
        // Mettez à jour l'interface utilisateur ou affichez un message de succès
      }
    } catch (error) {
      console.error('Erreur lors de la connexion des équipements :', error);
    }
  };

  return (
    <div>
      <h1>Équipements en temps réel</h1>
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
