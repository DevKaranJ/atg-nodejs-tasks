import React, { useState, useEffect } from 'react';
import { subscribeToPriceAlerts } from '../services/NotificationService.ts';

import axios from 'axios';

const PriceAlertSettings: React.FC = () => {
    const [cryptoId, setCryptoId] = useState<string>('');
    const [threshold, setThreshold] = useState<number>(0);

    useEffect(() => {
        subscribeToPriceAlerts((data) => {
            alert(`Price Alert: ${data.cryptoId} changed by ${data.priceChange}% to $${data.newPrice}`);
        });
    }, []);

    const handleSubscribe = async () => {

        try {
            const response = await axios.post('http://localhost:5000/api/subscribe', {
                cryptoId,
                threshold,
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error subscribing to notifications:", error);
            alert("Failed to subscribe to notifications.");
        }
    };

    return (
        <div>
            <h2>Price Alert Settings</h2>
            <input
                type="text"
                placeholder="Cryptocurrency ID (e.g., bitcoin)"
                value={cryptoId}
                onChange={(e) => setCryptoId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Price Change Threshold (%)"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <button onClick={handleSubscribe}>Subscribe to Notifications</button>
        </div>
    );
};

export default PriceAlertSettings;
