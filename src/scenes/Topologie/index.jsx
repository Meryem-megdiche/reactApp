import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://nodeapp-0ome.onrender.com'); // Assurez-vous que l'URL est correcte

const ScanRFID = () => {
  const [rfid, setRfid] = useState('');
  const [connectToRfid, setConnectToRfid] = useState('');
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    socket.on('equipmentUpdated', (updatedEquipments) => {
      setEquipments(updatedEquipments);
    });
  }, []);

  const handleScan = async () => {
    const response = await fetch('https://nodeapp-0ome.onrender.com/equip/scanRFID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rfid, connectToRfid }),
    });
    const data = await response.json();
    if (data.success) {
      setRfid('');
      setConnectToRfid('');
    } else {
      console.error(data.message);
    }
  };

  return (
    <div>
      <h1>Scanner RFID</h1>
      <input
        type="text"
        value={rfid}
        onChange={(e) => setRfid(e.target.value)}
        placeholder="Scanner le tag RFID"
      />
      <input
        type="text"
        value={connectToRfid}
        onChange={(e) => setConnectToRfid(e.target.value)}
        placeholder="RFID à connecter (optionnel)"
      />
      <button onClick={handleScan}>Scan</button>
      <h2>Équipements</h2>
      <ul>
        {equipments.map((equip) => (
          <li key={equip._id}>{equip.Nom} - Connecté à: {equip.ConnecteA.map(e => e.Nom).join(', ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScanRFID;
