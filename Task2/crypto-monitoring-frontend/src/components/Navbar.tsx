import React from 'react';

import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar: React.FC<{ notificationCount: number }> = ({ notificationCount }) => {
    return (
        <nav className="navbar">
            <div className="logo">Crypto Monitor</div>
            <div className="notification-bell">
                <span className="bell-icon">🔔</span>
                <span className="notification-count">{notificationCount}</span> {/* Display notification count */}
            </div>
            <Link to="/alerts">Alerts</Link> {/* New link to alerts page */}
        </nav>
    );
};


export default Navbar;
