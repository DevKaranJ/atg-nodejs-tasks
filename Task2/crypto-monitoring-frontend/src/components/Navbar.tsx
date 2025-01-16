import React from 'react';

const Navbar: React.FC<{ notificationCount: number }> = ({ notificationCount }) => {
    return (
        <nav className="navbar">
            <div className="logo">Crypto Monitor</div>
            <div className="notification-bell">
                <span className="bell-icon">🔔</span>
                <span className="notification-count">{notificationCount}</span> {/* Display notification count */}
            </div>
        </nav>
    );
};

export default Navbar;
