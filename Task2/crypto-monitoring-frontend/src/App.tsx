import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Homepage from './components/Homepage.tsx';
import CryptoDetails from './components/CryptoDetails.tsx';

const CryptoDetailsWrapper: React.FC = () => {
    const { cryptoId } = useParams<{ cryptoId: string }>();
    return <CryptoDetails cryptoId={cryptoId!} />;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/prices/:cryptoId" element={<CryptoDetailsWrapper />} />
            </Routes>
        </Router>
    );
};

export default App;
