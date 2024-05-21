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

  const handleScan = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit('scanEquip');
  };

  return (
    <div>
      <h1>Équipements en temps réel</h1>
      <button onClick={handleScan}>Scanner RFID</button>
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
