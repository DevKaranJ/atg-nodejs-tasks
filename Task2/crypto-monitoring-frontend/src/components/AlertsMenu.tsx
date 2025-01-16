import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertsMenu: React.FC = () => {
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        // Fetch alerts from the backend (assuming an endpoint exists)
        const fetchAlerts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/alerts');
                setAlerts(response.data);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <div>
            <h2>Your Alerts</h2>
            {alerts.length > 0 ? (
                <ul>
                    {alerts.map((alert, index) => (
                        <li key={index}>
                            {alert.cryptoId}: {alert.priceChange}% change to ${alert.newPrice}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No alerts set.</p>
            )}
        </div>
    );
};

export default AlertsMenu;
