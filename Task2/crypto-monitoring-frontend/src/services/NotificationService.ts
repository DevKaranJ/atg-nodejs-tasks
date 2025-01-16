import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export const subscribeToPriceAlerts = (callback: (data: any) => void) => {
    socket.on('priceAlert', (data) => {
        callback(data);
    });
};

export const unsubscribeFromPriceAlerts = () => {
    socket.off('priceAlert');
};
